'use client';

import { useCallback, useRef, useState } from "react";
import { useDatasetStore } from "@/store/dataset-store";
import { parseCsvFile, parseCsvText } from "@/lib/dataset";

const SAMPLE_DATASETS: { label: string; description: string; url: string }[] = [
  {
    label: "Iris Measurements",
    description: "Classic dataset for flower classification with sepal/petal metrics.",
    url: "https://raw.githubusercontent.com/uiuc-cse/data-fa14/gh-pages/data/iris.csv"
  },
  {
    label: "Wine Quality",
    description: "Physicochemical tests for Portuguese vinho verde wine samples.",
    url: "https://raw.githubusercontent.com/vega/vega-datasets/master/data/wine.csv"
  },
  {
    label: "NYC Trees",
    description: "Public trees information across New York City boroughs.",
    url: "https://raw.githubusercontent.com/vega/vega-datasets/master/data/nyc_trees.csv"
  }
];

export function UploadDropzone() {
  const { setDataset, setStatus } = useDatasetStore();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setStatus("loading");
      try {
        const dataset = await parseCsvFile(file);
        setDataset(dataset);
      } catch (error) {
        console.error(error);
        setStatus("error", "Failed to parse CSV file.");
      }
    },
    [setDataset, setStatus]
  );

  const handleTriggerInput = () => {
    inputRef.current?.click();
  };

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
      await handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDrag = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleSampleLoad = useCallback(
    async (sample: (typeof SAMPLE_DATASETS)[number]) => {
      setStatus("loading");
      try {
        const response = await fetch(sample.url);
        const csvText = await response.text();
        const dataset = parseCsvText(csvText, `${sample.label}.csv`);
        setDataset(dataset);
      } catch (error) {
        console.error(error);
        setStatus("error", "Unable to load the sample dataset.");
      }
    },
    [setDataset, setStatus]
  );

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <div className="grid gap-6 p-8 md:grid-cols-[1.3fr_.7fr] md:items-center">
        <div>
          <label
            htmlFor="csv-upload"
            className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
              dragActive ? "border-primary-400 bg-slate-800/70" : "border-slate-700 bg-slate-900/60"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-3 text-center text-slate-200">
              <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase text-primary-300 tracking-wide">
                CSV Import
              </span>
              <p className="text-xl font-semibold">Drop your dataset here</p>
              <p className="text-sm text-slate-400">
                Supports UTF-8 CSV files up to 5 MB. Numeric columns detected automatically.
              </p>
              <button
                type="button"
                className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400"
                onClick={handleTriggerInput}
              >
                Browse files
              </button>
            </div>
            <input
              ref={inputRef}
              id="csv-upload"
              type="file"
              accept=".csv"
              hidden
              onChange={(event) => handleFiles(event.target.files)}
            />
          </label>
        </div>
        <div className="space-y-4 rounded-2xl bg-slate-950/50 p-6 ring-1 ring-inset ring-slate-800">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">No dataset?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Jump in instantly by loading one of the curated samples. Each demonstrates different data types
              and shapes.
            </p>
          </div>
          <ul className="space-y-3">
            {SAMPLE_DATASETS.map((sample) => (
              <li key={sample.label}>
                <button
                  type="button"
                  onClick={() => handleSampleLoad(sample)}
                  className="flex w-full flex-col rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left transition hover:border-primary-500/70 hover:bg-slate-900"
                >
                  <span className="text-sm font-semibold text-primary-200">{sample.label}</span>
                  <span className="text-xs text-slate-400">{sample.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
