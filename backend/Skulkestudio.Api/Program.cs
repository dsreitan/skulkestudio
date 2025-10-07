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
app.UseStaticFiles();
app.UseCors("localhost");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", async context =>
{
    var isAuth = context.User?.Identity?.IsAuthenticated == true;

    if (isAuth)
    {
        context.Response.Redirect("/app", permanent: false);
        return;
    }
    else
    {
        await context.Response.SendFileAsync(Path.Combine(app.Environment.WebRootPath, "index.html"));
    }
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

app.UseStaticFiles(new StaticFileOptions { RequestPath = "/app" });

// Any /app/* path that isn't a real file → SPA shell
app.MapFallbackToFile("/app/{*path}", "__spa-fallback.html").RequireAuthorization();

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
