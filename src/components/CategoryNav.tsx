import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";
import { useEffect, useRef } from "react";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = scrollRef.current?.querySelector(`[data-id="${activeCategory}"]`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 shadow-sm border-b border-gray-100 py-1">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar px-4 py-2 gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-id={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={cn(
              "whitespace-nowrap px-5 py-2 text-sm transition-all rounded-full border",
              activeCategory === cat.id
                ? "font-bold text-white bg-[#EA1D2C] border-[#EA1D2C] shadow-md shadow-red-100"
                : "font-semibold text-gray-500 bg-white border-gray-100 hover:border-gray-300"
            )}
          >
            {cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
