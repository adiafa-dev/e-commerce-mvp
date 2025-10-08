'use client';

import { useState } from 'react';
import SidebarFilter from '@/components/sections/SidebarFilterProducts/SidebarFilter';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CatalogPage() {
  const [filters, setFilters] = useState({
    categories: [] as number[],
    minPrice: 0,
    maxPrice: 0,
    rating: [] as number[],
  });

  const [productCount, setProductCount] = useState<number>(0);
  const [sortOption, setSortOption] = useState<'latest' | 'name' | 'price' | 'rating'>('latest');

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-0 w-full">
      <h2 className="w-full text-[32px] font-bold md:pt-6">Catalog</h2>
      <div className="flex md:gap-5 items-start pt-2 md:pt-5 pb-12">
        <SidebarFilter filters={filters} onFilterChange={setFilters} />

        <div className="w-full md:w-4/5">
          <div className="grid grid-cols-2 gap-5 md:flex md:gap-0 justify-between items-center">
            <p className="text-base col-span-2">Showing {productCount} products</p>

            {/* <!-- filter button for mobile --> */}
            <div>
              <a href="#" className="flex md:hidden items-center gap-2.5 border-neutral-300 border rounded-md py-2 px-4 grow justify-between">
                <span className="text-neutral-950 text-sm">Filter</span>
                {/* <img src="./assets/images/icons/filter-icon.svg" alt="Filter Icon" /> */}
              </a>
            </div>

            {/* ✅ Sort Dropdown */}
            <div className="flex gap-2 items-center">
              <p className="text-base font-bold hidden md:block">Sort</p>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as 'latest' | 'name' | 'price' | 'rating')}>
                <SelectTrigger className="w-[165px] text-sm border-gray-300">
                  <SelectValue placeholder="Select sort" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <FeaturedProducts filters={filters} onCountChange={setProductCount} sortOption={sortOption} />
        </div>
      </div>
    </div>
  );
}
