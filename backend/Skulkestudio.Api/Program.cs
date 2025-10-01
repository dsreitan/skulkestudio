using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapFallbackToFile("/app/{*path}", "__spa-fallback.html");

app.Run();
