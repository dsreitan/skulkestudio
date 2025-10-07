using System.Collections.Immutable;

public class PageService
{
    // Hierarkisk side-definisjon som Page-objekter (norsk innhold)
    private static readonly IReadOnlyList<Page> _pages = new List<Page>
    {
        new("magasin", "Magasin", null, "Velkommen til magasinet vårt. Her samler vi artikler og historier."),
        new("magasin/nyheter", "Nyheter", "magasin", "Siste nyheter og oppdateringer."),
        new("magasin/reportasjer", "Reportasjer", "magasin", "Fordypende reportasjer og lengre lesestoff."),
        new("magasin/intervjuer", "Intervjuer", "magasin", "Samtaler med interessante personer."),
        new("magasin/kommentar", "Kommentar", "magasin", "Perspektiver og meninger."),

        new("tv-aksjonen", "TV-aksjonen", null, "Informasjon om årets TV-aksjon."),
        new("tv-aksjonen/om", "Om aksjonen", "tv-aksjonen", "Bakgrunn, mål og organisasjon."),
        new("tv-aksjonen/program", "Program", "tv-aksjonen", "Tidspunkter og sendingsoverblikk."),
        new("tv-aksjonen/bidra", "Slik kan du bidra", "tv-aksjonen", "Finn ut hvordan du kan støtte aksjonen."),
        new("tv-aksjonen/statistikk", "Statistikk", "tv-aksjonen", "Tall, fremskritt og resultater."),
        new("tv-aksjonen/kontakt", "Kontakt", "tv-aksjonen", "Kontaktinformasjon og henvendelser."),
    }.ToImmutableList();

    private static readonly IReadOnlyDictionary<string, Page> _pageIndex =
        _pages.ToImmutableDictionary(p => p.Id, p => p);

    public Page? GetPage(string id) => _pageIndex.TryGetValue(id, out var p) ? p : null;

    public IEnumerable<Page> GetChildren(string parentId) => _pages.Where(p => p.ParentId == parentId);

    public IEnumerable<Page> GetRootPages() => _pages.Where(p => p.ParentId is null);
}

public record Page(string Id, string Title, string? ParentId = null, string? Content = null);
