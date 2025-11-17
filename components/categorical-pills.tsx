'use client';

import type { CategoricalSummaryItem } from "@/lib/dataset";
import { formatPercent, formatInteger } from "@/lib/format";

interface CategoricalPillsProps {
  categories: CategoricalSummaryItem[];
}

export function CategoricalPills({ categories }: CategoricalPillsProps) {
  if (categories.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-700 text-sm text-slate-400">
        No categorical values detected.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <div
          key={category.value}
          className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm text-slate-100"
        >
          <span className="font-semibold text-primary-200">{category.value}</span>
          <span className="text-xs text-slate-400">
            {formatInteger(category.count)} • {formatPercent(category.percentage)}
          </span>
        </div>
      ))}
    </div>
  );
}
