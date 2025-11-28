"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (selected: string[]) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onCategoryChange,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoryChange(newSelected);
  };

  const clearAll = () => {
    onCategoryChange([]);
  };

  const selectAll = () => {
    onCategoryChange(categories);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <label className="text-sm font-medium text-gray-700">
          Filter Kategori:
        </label>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAll}
          disabled={selectedCategories.length === 0}
        >
          Hapus Semua
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={selectAll}
          disabled={selectedCategories.length === categories.length}
        >
          Pilih Semua
        </Button>
      </div>

      {/* Desktop view - horizontal grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
              selectedCategories.includes(category)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mobile view - dropdown */}
      <div className="md:hidden relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-gray-300"
        >
          <span>
            {selectedCategories.length === 0
              ? "Semua Kategori"
              : `${selectedCategories.length} kategori dipilih`}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                  selectedCategories.includes(category)
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  readOnly
                  className="mr-3"
                />
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected badges */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="px-3 py-1 cursor-pointer hover:bg-gray-200"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <span className="ml-2 text-xs">✕</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
