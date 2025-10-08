'use client';

import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

type SidebarFilterProps = {
  filters: {
    categories: number[];
    minPrice: number;
    maxPrice: number;
    rating: number[];
  };
  onFilterChange: (updatedFilters: { categories: number[]; minPrice: number; maxPrice: number; rating: number[] }) => void;
};

export default function SidebarFilter({ filters, onFilterChange }: SidebarFilterProps) {
  const { data, isLoading, error } = useCategories();
  const categories = data?.data?.categories ?? [];

  // === HANDLERS ===
  const toggleCategory = (id: number) => {
    // kalau user klik "All", kosongkan semua filter kategori
    if (id === 0) {
      onFilterChange({ ...filters, categories: [] });
      return;
    }

    const updated = filters.categories.includes(id) ? filters.categories.filter((c) => c !== id) : [...filters.categories, id];

    onFilterChange({ ...filters, categories: updated });
  };

  const toggleRating = (value: number) => {
    const updated = filters.rating.includes(value) ? filters.rating.filter((r) => r !== value) : [...filters.rating, value];
    onFilterChange({ ...filters, rating: updated });
  };

  const updatePrice = (key: 'minPrice' | 'maxPrice', value: number) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const isAllSelected = filters.categories.length === 0;

  return (
    <aside className="hidden md:flex flex-col w-1/5 border border-neutral-300 rounded-2xl">
      {/* === CATEGORY FILTER === */}
      <div className="p-5">
        <h3 className="text-base font-bold mb-2">FILTER</h3>
        <h4 className="text-base font-semibold mb-2">Categories</h4>

        {isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : error ? (
          <p className="text-sm text-red-500">Gagal memuat kategori</p>
        ) : (
          <div className="space-y-2">
            {/* Checkbox "All" */}
            <label className="flex items-center space-x-2 mb-2">
              <input type="checkbox" checked={isAllSelected} onChange={() => toggleCategory(0)} className="accent-neutral-950 w-4 h-4" />
              <span>All</span>
            </label>

            {/* Category list */}
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center space-x-2 mb-2">
                <input type="checkbox" checked={filters.categories.includes(cat.id)} onChange={() => toggleCategory(cat.id)} className="accent-neutral-950 w-4 h-4" />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="my-5 text-neutral-300" />

      {/* === PRICE FILTER === */}
      <div className="px-5">
        <h4 className="text-base font-semibold mb-2">Price</h4>
        <div className="space-y-2">
          {(['minPrice', 'maxPrice'] as const).map((key) => (
            <div key={key} className="flex items-center border rounded-md px-1 border-neutral-300">
              <span className="text-neutral-950 mr-2 bg-neutral-300 p-1 aspect-square w-10 rounded-md font-semibold text-center">Rp</span>
              <input
                type="number"
                value={filters[key] || ''}
                onChange={(e) => updatePrice(key, Number(e.target.value))}
                step={10000}
                className="w-full border-0 focus:ring-0 text-base m-1 mb-2"
                placeholder={key === 'minPrice' ? 'Minimum Price' : 'Maximum Price'}
              />
            </div>
          ))}
        </div>
      </div>

      <hr className="my-5 text-neutral-300" />

      {/* === RATING FILTER === */}
      <div className="p-5">
        <h4 className="text-base font-semibold mb-2">Rating</h4>
        <ul className="space-y-2">
          {[5, 4, 3, 2, 1].map((r) => (
            <li key={r}>
              <label className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
                <input type="checkbox" checked={filters.rating.includes(r)} onChange={() => toggleRating(r)} className="accent-yellow-500 w-4 h-4" />
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {r}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
