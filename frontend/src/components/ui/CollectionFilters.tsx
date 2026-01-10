'use client';

import { useState } from 'react';

export function CollectionFilters() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['categories']));

  const toggleSection = (section: string) => {
    const newSections = new Set(openSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setOpenSections(newSections);
  };

  return (
    <div className="bg-white sticky top-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-charcoal-ink">Filters</h3>
          <button className="text-sm text-aegean-blue hover:underline">Clear all</button>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-stone-grey/10 pb-4 mb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex justify-between items-center w-full text-left font-semibold text-charcoal-ink mb-3"
        >
          <span>Categories</span>
          <span className="text-stone-grey">{openSections.has('categories') ? '−' : '+'}</span>
        </button>
        {openSections.has('categories') && (
          <ul className="space-y-2 text-sm">
            <li>
              <label className="flex items-center cursor-pointer hover:text-aegean-blue">
                <input type="checkbox" className="mr-2" />
                <span>Modern Fiction</span>
              </label>
            </li>
            <li>
              <label className="flex items-center cursor-pointer hover:text-aegean-blue">
                <input type="checkbox" className="mr-2" />
                <span>Crime & Mystery</span>
              </label>
            </li>
            <li>
              <label className="flex items-center cursor-pointer hover:text-aegean-blue">
                <input type="checkbox" className="mr-2" />
                <span>Fantasy</span>
              </label>
            </li>
            <li>
              <label className="flex items-center cursor-pointer hover:text-aegean-blue">
                <input type="checkbox" className="mr-2" />
                <span>Romance</span>
              </label>
            </li>
            <li>
              <button className="text-aegean-blue hover:underline text-sm">See More +</button>
            </li>
          </ul>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-stone-grey/10 pb-4 mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center w-full text-left font-semibold text-charcoal-ink mb-3"
        >
          <span>Price</span>
          <span className="text-stone-grey">{openSections.has('price') ? '−' : '+'}</span>
        </button>
        {openSections.has('price') && (
          <div className="space-y-2 text-sm">
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>Under £5</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>£5 - £10</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>£10 - £20</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>Over £20</span>
            </label>
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="border-b border-stone-grey/10 pb-4 mb-4">
        <button
          onClick={() => toggleSection('condition')}
          className="flex justify-between items-center w-full text-left font-semibold text-charcoal-ink mb-3"
        >
          <span>Condition</span>
          <span className="text-stone-grey">{openSections.has('condition') ? '−' : '+'}</span>
        </button>
        {openSections.has('condition') && (
          <div className="space-y-2 text-sm">
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>Like New</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>Very Good</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>Good</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-aegean-blue">
              <input type="checkbox" className="mr-2" />
              <span>Acceptable</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
