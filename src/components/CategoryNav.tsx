import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <div className="sticky top-0 bg-[#f7f7f7] z-30 shadow-sm border-b border-gray-200 pb-2">
      <div className="flex overflow-x-auto no-scrollbar px-4 py-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className={cn(
              "whitespace-nowrap px-4 py-2 mr-2 text-sm transition-all rounded-full",
              activeCategory === cat.id
                ? "font-bold text-[#3e3e3e] bg-white shadow-sm border border-gray-100"
                : "font-semibold text-gray-500"
            )}
          >
            {cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
