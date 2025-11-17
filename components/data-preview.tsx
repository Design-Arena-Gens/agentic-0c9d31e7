'use client';

import { useMemo, useState } from "react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatInteger } from "@/lib/format";

const PAGE_SIZE = 25;

export function DataPreview() {
  const dataset = useDatasetStore((state) => state.dataset);
  const [page, setPage] = useState(0);

  const paginatedRows = useMemo(() => {
    if (!dataset) return [];
    const start = page * PAGE_SIZE;
    return dataset.rows.slice(start, start + PAGE_SIZE);
  }, [dataset, page]);

  if (!dataset) return null;

  const totalPages = Math.ceil(dataset.rowCount / PAGE_SIZE);

  const handleNext = () => setPage((value) => Math.min(value + 1, totalPages - 1));
  const handlePrev = () => setPage((value) => Math.max(value - 1, 0));

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Sample rows</h3>
          <p className="text-xs text-slate-500">
            Displaying {formatInteger(page * PAGE_SIZE + 1)}-
            {formatInteger(Math.min((page + 1) * PAGE_SIZE, dataset.rowCount))} of{" "}
            {formatInteger(dataset.rowCount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={page === 0}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition enabled:hover:border-primary-500 enabled:hover:text-primary-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs text-slate-400">
            Page {page + 1} of {totalPages || 1}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition enabled:hover:border-primary-500 enabled:hover:text-primary-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-x-0 border-spacing-y-1 text-left">
          <thead className="sticky top-0 z-10">
            <tr>
              {dataset.columns.map((column) => (
                <th key={column.key} className="rounded-lg bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{column.label}</span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-500">
                      {column.type} • {column.uniqueValues} unique
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, index) => (
              <tr key={index} className="rounded-lg">
                {dataset.columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={column.key} className="rounded-lg bg-slate-950/40 px-3 py-2 text-xs text-slate-200">
                      {value === null ? <span className="text-slate-500">∅</span> : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
