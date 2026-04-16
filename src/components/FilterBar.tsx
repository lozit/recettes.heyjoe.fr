import { useState, useEffect } from 'react';

interface Recipe {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  photo?: string;
}

interface Props {
  recipes: Recipe[];
}

export default function FilterBar({ recipes }: Props) {
  const [activeFilter, setActiveFilter] = useState('tout');
  const [search, setSearch] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 60); }, []);

  // Build filter list from tags
  const tagCounts = new Map<string, number>();
  for (const r of recipes) {
    for (const t of r.tags) {
      const key = t.toLowerCase();
      tagCounts.set(key, (tagCounts.get(key) || 0) + 1);
    }
  }

  // Keep only most common tags as filters
  const FILTER_KEYS = ['salé', 'sucré', 'boulangerie', 'dessert', 'apéritif', 'cétogène'];
  const filters = [
    { key: 'tout', label: 'Tout', count: recipes.length },
    ...FILTER_KEYS
      .filter(k => tagCounts.has(k))
      .map(k => ({ key: k, label: k.charAt(0).toUpperCase() + k.slice(1), count: tagCounts.get(k)! })),
  ];

  const filtered = recipes.filter(r => {
    const matchFilter = activeFilter === 'tout' || r.tags.some(t => t.toLowerCase() === activeFilter);
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Dispatch custom event so the page can show/hide cards
  useEffect(() => {
    const slugs = new Set(filtered.map(r => r.slug));
    window.dispatchEvent(new CustomEvent('filter-recipes', { detail: { slugs, count: filtered.length, activeFilter, search } }));
  }, [activeFilter, search, filtered.length]);

  return (
    <>
      <div className="nav-search-wrap">
        <input
          className="nav-search"
          type="search"
          placeholder="Rechercher…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-wrap">
        <div className={`filter-bar ${loaded ? 'loaded' : ''}`}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}<span className="filter-count">{f.count}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
