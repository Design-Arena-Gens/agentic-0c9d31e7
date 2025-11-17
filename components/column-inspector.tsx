'use client';

import { useMemo } from "react";
import { useDatasetStore } from "@/store/dataset-store";
import { analyzeColumn, type ColumnAnalysis, type NumericSummary } from "@/lib/dataset";
import { formatNumber, formatInteger, formatPercent } from "@/lib/format";
import { HistogramChart } from "./histogram-chart";
import { CategoricalPills } from "./categorical-pills";

const METRIC_LABELS: Record<string, string> = {
  min: "Minimum",
  q1: "Q1",
  median: "Median",
  mean: "Mean",
  q3: "Q3",
  max: "Maximum",
  stdev: "Std deviation",
  variance: "Variance",
  sum: "Total",
  count: "Count"
};

export function ColumnInspector() {
  const { dataset, selectedColumn, setSelectedColumn } = useDatasetStore((state) => ({
    dataset: state.dataset,
    selectedColumn: state.selectedColumn,
    setSelectedColumn: state.setSelectedColumn
  }));

  const currentColumn = useMemo(() => {
    if (!dataset || !selectedColumn) return null;
    return analyzeColumn(dataset, selectedColumn);
  }, [dataset, selectedColumn]);

  if (!dataset) return null;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner">
      <header className="flex flex-col gap-3 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Column inspector</h2>
          <p className="text-xs text-slate-500">
            Explore distribution, missingness, and descriptive statistics per column.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="column-select" className="text-xs uppercase tracking-wide text-slate-500">
            Column
          </label>
          <select
            id="column-select"
            value={selectedColumn ?? ""}
            onChange={(event) => setSelectedColumn(event.target.value || null)}
            className="rounded-full border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none"
          >
            {dataset.columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label} • {column.type}
              </option>
            ))}
          </select>
        </div>
      </header>
      {currentColumn ? (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatisticCard
                title="Unique values"
                value={formatInteger(currentColumn.column.uniqueValues)}
                hint={`${formatInteger(currentColumn.column.missingCount)} missing`}
              />
              <StatisticCard
                title="Data type"
                value={currentColumn.column.type === "numeric" ? "Numeric" : "Categorical"}
                hint={currentColumn.column.type === "numeric" ? "Quantitative" : "Nominal"}
              />
              {currentColumn.numeric && (
                <>
                  <StatisticCard title={METRIC_LABELS.min} value={formatNumber(currentColumn.numeric.min)} />
                  <StatisticCard title={METRIC_LABELS.max} value={formatNumber(currentColumn.numeric.max)} />
                  <StatisticCard title={METRIC_LABELS.mean} value={formatNumber(currentColumn.numeric.mean)} />
                  <StatisticCard
                    title={METRIC_LABELS.stdev}
                    value={formatNumber(currentColumn.numeric.stdev)}
                  />
                </>
              )}
            </div>
            {currentColumn.numeric ? (
              <HistogramChart bins={currentColumn.numeric.histogram} />
            ) : currentColumn.categorical ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Top categories
                </h3>
                <div className="mt-3">
                  <CategoricalPills categories={currentColumn.categorical.categories} />
                </div>
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            {currentColumn.numeric ? (
              <DetailedStatsPanel numeric={currentColumn.numeric} />
            ) : currentColumn.categorical ? (
              <CategoryTable categories={currentColumn.categorical.categories} />
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Select a column to inspect its distribution and statistics.</p>
      )}
    </section>
  );
}

interface StatisticCardProps {
  title: string;
  value: string;
  hint?: string;
}

function StatisticCard({ title, value, hint }: StatisticCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function DetailedStatsPanel({ numeric }: { numeric: NonNullable<ColumnAnalysis["numeric"]> }) {
  const metrics: Array<keyof NumericSummary> = ["median", "q1", "q3", "sum", "variance", "count"];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Descriptive metrics</h3>
      <dl className="mt-4 grid gap-4">
        {metrics.map((metric) => {
          const value = numeric[metric];
          return (
            <div key={metric} className="flex items-center justify-between text-sm text-slate-200">
              <dt className="text-slate-400">{METRIC_LABELS[metric]}</dt>
              <dd>{metric === "count" ? formatInteger(value) : formatNumber(value)}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

function CategoryTable({
  categories
}: {
  categories: NonNullable<ColumnAnalysis["categorical"]>["categories"];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category breakdown</h3>
      <ul className="mt-3 space-y-3">
        {categories.map((category) => (
          <li key={category.value} className="flex items-center justify-between text-sm text-slate-200">
            <span>{category.value}</span>
            <span className="text-xs text-slate-400">
              {formatInteger(category.count)} • {formatPercent(category.percentage)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
