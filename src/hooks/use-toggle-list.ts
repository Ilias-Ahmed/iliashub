import { useCallback, useState } from "react";

/**
 * Hook for managing a toggle list (e.g., comparison selections)
 */
export function useToggleList<T = string>(
  maxItems?: number,
  initialItems: T[] = []
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const toggle = useCallback(
    (item: T) => {
      setItems((prev) => {
        if (prev.includes(item)) {
          return prev.filter((i) => i !== item);
        } else if (!maxItems || prev.length < maxItems) {
          return [...prev, item];
        }
        return prev;
      });
    },
    [maxItems]
  );

  const add = useCallback(
    (item: T) => {
      setItems((prev) => {
        if (prev.includes(item)) return prev;
        if (!maxItems || prev.length < maxItems) {
          return [...prev, item];
        }
        return prev;
      });
    },
    [maxItems]
  );

  const remove = useCallback((item: T) => {
    setItems((prev) => prev.filter((i) => i !== item));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const set = useCallback(
    (newItems: T[]) => {
      setItems(maxItems ? newItems.slice(0, maxItems) : newItems);
    },
    [maxItems]
  );

  const has = useCallback(
    (item: T) => {
      return items.includes(item);
    },
    [items]
  );

  return {
    items,
    toggle,
    add,
    remove,
    clear,
    set,
    has,
    count: items.length,
    isFull: maxItems ? items.length >= maxItems : false,
  };
}
