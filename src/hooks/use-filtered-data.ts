import { useCallback, useMemo, useState } from "react";

/**
 * Hook for managing filtered data with category and search
 */
export function useFilteredData<T>(
  data: T[],
  options: {
    categoryKey?: keyof T;
    searchKeys?: (keyof T)[];
  } = {}
) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { categoryKey, searchKeys = [] } = options;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Category filter
      const matchesCategory =
        !categoryKey ||
        selectedCategory === "All" ||
        item[categoryKey] === selectedCategory;

      // Search filter
      const matchesSearch =
        !searchQuery ||
        searchKeys.some((key) => {
          const value = item[key];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

      return matchesCategory && matchesSearch;
    });
  }, [data, selectedCategory, searchQuery, categoryKey, searchKeys]);

  const resetFilters = useCallback(() => {
    setSelectedCategory("All");
    setSearchQuery("");
  }, []);

  return {
    filteredData,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    resetFilters,
  };
}
