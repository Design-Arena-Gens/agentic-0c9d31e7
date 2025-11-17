"use client";

import { UploadDropzone } from "@/components/upload-dropzone";
import { DatasetOverview } from "@/components/dataset-overview";
import { ColumnInspector } from "@/components/column-inspector";
import { DataPreview } from "@/components/data-preview";
import { useDatasetStore } from "@/store/dataset-store";

export default function Page() {
  const { dataset, status, error } = useDatasetStore((state) => ({
    dataset: state.dataset,
    status: state.status,
    error: state.error
  }));

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-16 pt-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-100">
          <span>DS</span>
          <span className="text-primary-200/80">Insight Studio</span>
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Turn CSV files into instant insight.</h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Drop a dataset, explore column statistics, spot anomalies, and export quick summaries. Built for
            data scientists and analytics engineers who need answers fast.
          </p>
        </div>
        {status === "loading" && (
          <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs text-slate-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-400" />
            Parsing dataset...
          </div>
        )}
        {status === "error" && error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}
      </header>

      <UploadDropzone />

      {dataset ? (
        <>
          <DatasetOverview />
          <ColumnInspector />
          <DataPreview />
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
      <h2 className="text-xl font-semibold text-white">Awaiting dataset</h2>
      <p className="mt-2 text-sm text-slate-400">
        Import your own CSV or explore a sample dataset to unlock automated profiling, descriptive stats, and
        interactive charts.
      </p>
    </section>
  );
}
