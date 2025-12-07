using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<PageService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("localhost", policy =>
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(origin =>
            {
                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;
                var host = uri.Host;
                return host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                    || host == "127.0.0.1"
                    || host == "::1";
            })
            .AllowCredentials()
    );
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login";
        options.LogoutPath = "/logout";
        options.Cookie.Name = "skulke_auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Events.OnRedirectToLogin = context =>
        {
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            }
            else
            {
                context.Response.Redirect(context.RedirectUri);
            }

            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorizationBuilder()
        .AddPolicy("Authenticated", policy => policy.RequireAuthenticatedUser());

var app = builder.Build();

app.UseDefaultFiles(new DefaultFilesOptions { RedirectToAppendTrailingSlash = false });
app.UseCors("localhost");
app.UseAuthentication();
app.UseAuthorization();

// Helper function to get auth status from user context
static (bool isAuthenticated, string? username) GetAuthStatus(HttpContext context)
{
    var isAuthenticated = context.User?.Identity?.IsAuthenticated == true;
    var username = isAuthenticated ? context.User?.Identity?.Name : null;
    return (isAuthenticated, username);
}

// Helper function to inject auth status into HTML content
static string InjectAuthStatus(string htmlContent, bool isAuthenticated, string? username)
{
    var usernameJson = username != null ? $"\"{username}\"" : "null";
    
    // Script that sets state immediately and synchronously
    var authScript = "<script>window.initialState={user:{isAuthenticated:" 
        + isAuthenticated.ToString().ToLower() 
        + ",username:" + usernameJson 
        + "}};</script>";
    
    var injection = authScript;
    
    // Inject as the very first thing in <head>, before any other content
    var headIndex = htmlContent.IndexOf("<head", StringComparison.OrdinalIgnoreCase);
    if (headIndex >= 0)
    {
        var headTagEnd = htmlContent.IndexOf('>', headIndex);
        if (headTagEnd >= 0)
        {
            // Insert right after <head> tag, before any other content
            return htmlContent.Insert(headTagEnd + 1, injection);
        }
    }
    
    // Fallback: inject at start of body
    var bodyIndex = htmlContent.IndexOf("<body", StringComparison.OrdinalIgnoreCase);
    if (bodyIndex >= 0)
    {
        var bodyTagEnd = htmlContent.IndexOf('>', bodyIndex);
        if (bodyTagEnd >= 0)
        {
            return htmlContent.Insert(bodyTagEnd + 1, injection);
        }
    }
    
    return injection + htmlContent;
}

// Helper function to serve HTML file with auth injection
static async Task<IResult> ServeHtmlWithAuth(string htmlPath, HttpContext context)
{
    if (!File.Exists(htmlPath))
    {
        return Results.NotFound();
    }

    var htmlContent = await File.ReadAllTextAsync(htmlPath);
    var (isAuthenticated, username) = GetAuthStatus(context);
    var htmlWithAuth = InjectAuthStatus(htmlContent, isAuthenticated, username);
    
    return Results.Content(htmlWithAuth, "text/html");
}

app.MapGet("/", async context =>
{
    var htmlPath = Path.Combine(app.Environment.WebRootPath, "index.html");
    var result = await ServeHtmlWithAuth(htmlPath, context);
    await result.ExecuteAsync(context);
});

// Hardcoded user for POC
const string testUsername = "tester";

app.MapGet("/login", async (HttpContext context) =>
{
    // In a real app, validate credentials from request body
    // For POC, just log in as hardcoded user
    var claims = new List<Claim>
    {
        new(ClaimTypes.Name, testUsername),
        new(ClaimTypes.Role, "User")
    };
    var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    var authProperties = new Microsoft.AspNetCore.Authentication.AuthenticationProperties
    {
        IsPersistent = true,
        ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7),
    };
    await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);
    context.Response.Redirect("/", permanent: false);
});

app.MapGet("/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    context.Response.Redirect("/", permanent: false);
});

// Handle HTML files for public routes (tv-aksjonen, etc.) before static files
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";
    
    // Skip API, app, login, logout routes
    if (path.StartsWith("/api") || path.StartsWith("/app") || path.StartsWith("/login") || path.StartsWith("/logout"))
    {
        await next();
        return;
    }
    
    var webRoot = app.Environment.WebRootPath;
    var htmlPath = Path.Combine(webRoot, path.TrimStart('/'));
    
    // Resolve HTML file path
    if (Directory.Exists(htmlPath))
    {
        htmlPath = Path.Combine(htmlPath, "index.html");
    }
    else if (!Path.HasExtension(htmlPath))
    {
        htmlPath += ".html";
    }
    
    // Serve HTML with auth injection if file exists
    if (File.Exists(htmlPath) && htmlPath.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
    {
        var result = await ServeHtmlWithAuth(htmlPath, context);
        await result.ExecuteAsync(context);
        return;
    }
    
    await next();
});

app.UseStaticFiles(new StaticFileOptions { RequestPath = "/app" });

// Any /app/* path that isn't a real file → SPA shell with auth injection
app.MapFallback("/app/{*path}", async (HttpContext context, string path) =>
{
    var htmlPath = Path.Combine(app.Environment.WebRootPath, "__spa-fallback.html");
    return await ServeHtmlWithAuth(htmlPath, context);
}).RequireAuthorization();

// Serve other static files (CSS, JS, images, etc.) - but not HTML (handled above)
app.UseStaticFiles();

app.MapGet("/api/pages/{parentId}", (PageService pageService, string parentId) =>
{
    return Results.Ok(pageService.GetChildren(parentId));
});

app.MapGet("/api/page/{*id}", (PageService pageService, string id) =>
{
    var page = pageService.GetPage(id);
    return page is null
        ? Results.NotFound()
        : Results.Ok(page);
});

app.Run();
