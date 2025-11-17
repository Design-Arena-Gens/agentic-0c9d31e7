'use client';

import { useMemo } from "react";
import { useDatasetStore } from "@/store/dataset-store";
import { detectPrimaryKeys, detectDateColumns } from "@/lib/dataset";
import { formatInteger } from "@/lib/format";

export function DatasetOverview() {
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = useMemo(() => {
    if (!dataset) return null;
    const numericColumns = dataset.columns.filter((column) => column.type === "numeric");
    const categoricalColumns = dataset.columns.filter((column) => column.type === "categorical");
    const primaryKeys = detectPrimaryKeys(dataset);
    const dateColumns = detectDateColumns(dataset);

    return {
      numericCount: numericColumns.length,
      categoricalCount: categoricalColumns.length,
      primaryKeys,
      dateColumns
    };
  }, [dataset]);

  if (!dataset || !metadata) return null;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-inner shadow-black/20">
      <header className="flex flex-col gap-2 pb-6">
        <p className="text-xs uppercase tracking-widest text-primary-300/80">Dataset summary</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="text-2xl font-semibold text-white">{dataset.name}</h2>
          <span className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-100">
            {formatInteger(dataset.rowCount)} rows
          </span>
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Columns</p>
          <p className="mt-2 text-2xl font-semibold text-white">{dataset.columns.length}</p>
          <p className="mt-2 text-sm text-slate-400">
            {metadata.numericCount} numeric, {metadata.categoricalCount} categorical
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Primary key candidates</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {metadata.primaryKeys.length > 0 ? metadata.primaryKeys.join(", ") : "None detected"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Date columns</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {metadata.dateColumns.length > 0 ? metadata.dateColumns.join(", ") : "None detected"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Missing values</p>
          <p className="mt-2 text-sm text-slate-300">
            {dataset.columns
              .map((column) => ({
                column: column.label,
                missing: column.missingCount
              }))
              .filter((item) => item.missing > 0)
              .slice(0, 3)
              .map((item) => `${item.column}: ${formatInteger(item.missing)}`)
              .join(" • ") || "All columns complete"}
          </p>
        </div>
      </div>
    </section>
  );
}
