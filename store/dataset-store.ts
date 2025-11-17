import { create } from "zustand";
import type { Dataset } from "@/lib/dataset";

interface DatasetState {
  dataset: Dataset | null;
  selectedColumn: string | null;
  status: "idle" | "loading" | "error";
  error: string | null;
  setDataset: (dataset: Dataset) => void;
  setStatus: (status: DatasetState["status"], error?: string | null) => void;
  setSelectedColumn: (column: string | null) => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  dataset: null,
  selectedColumn: null,
  status: "idle",
  error: null,
  setDataset: (dataset) =>
    set(() => ({
      dataset,
      selectedColumn: dataset.columns.find((column) => column.type === "numeric")?.key ?? null,
      status: "idle",
      error: null
    })),
  setStatus: (status, error = null) =>
    set(() => ({
      status,
      error
    })),
  setSelectedColumn: (selectedColumn) => set(() => ({ selectedColumn }))
}));
