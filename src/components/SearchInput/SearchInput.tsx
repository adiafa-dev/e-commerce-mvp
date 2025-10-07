'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SearchInput() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative flex grow">
      {/* Input search */}
      <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full pl-10 pr-4 py-1 rounded-md border border-neutral-300 focus-visible:ring-2 text-sm" />

      {/* Icon search */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
