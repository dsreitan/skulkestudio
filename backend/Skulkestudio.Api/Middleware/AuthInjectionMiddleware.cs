using System.Text.Json;

namespace Skulkestudio.Api.Middleware;

/// <summary>
/// Intercepts HTML responses for public routes and injects a synchronous script tag
/// into &lt;head&gt; that sets <c>window.initialState</c> with the current user's
/// authentication status and the list of content sections for navigation.
/// </summary>
public sealed class AuthInjectionMiddleware(RequestDelegate next)
{
    private static readonly string[] SkippedPrefixes = ["/api", "/app", "/login", "/logout", "/openapi"];

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value ?? "";

        if (ShouldSkip(path))
        {
            await next(context);
            return;
        }

        var webRoot = context.RequestServices.GetRequiredService<IWebHostEnvironment>().WebRootPath;
        var htmlPath = ResolveHtmlPath(webRoot, path);

        if (htmlPath is not null)
        {
            await ServeHtmlWithAuth(htmlPath, context);
            return;
        }

        await next(context);
    }

    private static bool ShouldSkip(string path)
    {
        foreach (var prefix in SkippedPrefixes)
        {
            if (path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                return true;
        }
        return false;
    }

    internal static string? ResolveHtmlPath(string webRoot, string requestPath)
    {
        var relativePath = requestPath.TrimStart('/');
        var fullPath = Path.Combine(webRoot, relativePath);

        if (Directory.Exists(fullPath))
            fullPath = Path.Combine(fullPath, "index.html");
        else if (!Path.HasExtension(fullPath))
            fullPath += ".html";

        if (File.Exists(fullPath) && fullPath.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
            return fullPath;

        return null;
    }

    internal static async Task ServeHtmlWithAuth(string htmlPath, HttpContext context)
    {
        var htmlContent = await File.ReadAllTextAsync(htmlPath);
        var pageService = context.RequestServices.GetRequiredService<PageService>();
        var injected = InjectInitialState(htmlContent, context, pageService);
        context.Response.ContentType = "text/html";
        await context.Response.WriteAsync(injected);
    }

    internal static (bool isAuthenticated, string? username) GetAuthStatus(HttpContext context)
    {
        var isAuthenticated = context.User?.Identity?.IsAuthenticated == true;
        var username = isAuthenticated ? context.User?.Identity?.Name : null;
        return (isAuthenticated, username);
    }

    internal static string InjectInitialState(string html, HttpContext context, PageService pageService)
    {
        var (isAuthenticated, username) = GetAuthStatus(context);
        var sections = pageService.GetRootPages().Select(p => new { p.Id, p.Title });
        var sectionsJson = JsonSerializer.Serialize(sections, JsonOptions);
        var usernameJson = username is not null ? $"\"{username}\"" : "null";

        var script = "<script>window.initialState={"
            + $"user:{{isAuthenticated:{isAuthenticated.ToString().ToLower()},username:{usernameJson}}},"
            + $"sections:{sectionsJson}"
            + "};</script>";

        var headIndex = html.IndexOf("<head", StringComparison.OrdinalIgnoreCase);
        if (headIndex >= 0)
        {
            var headTagEnd = html.IndexOf('>', headIndex);
            if (headTagEnd >= 0)
                return html.Insert(headTagEnd + 1, script);
        }

        var bodyIndex = html.IndexOf("<body", StringComparison.OrdinalIgnoreCase);
        if (bodyIndex >= 0)
        {
            var bodyTagEnd = html.IndexOf('>', bodyIndex);
            if (bodyTagEnd >= 0)
                return html.Insert(bodyTagEnd + 1, script);
        }

        return script + html;
    }
}

public static class AuthInjectionMiddlewareExtensions
{
    public static IApplicationBuilder UseAuthInjection(this IApplicationBuilder app)
        => app.UseMiddleware<AuthInjectionMiddleware>();
}
