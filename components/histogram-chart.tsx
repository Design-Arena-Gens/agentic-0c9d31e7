'use client';

import { useMemo } from "react";
import { scaleLinear } from "d3-scale";
import type { HistogramBin } from "@/lib/dataset";
import { formatInteger } from "@/lib/format";

interface HistogramChartProps {
  bins: HistogramBin[];
  width?: number;
  height?: number;
}

export function HistogramChart({ bins, width = 700, height = 220 }: HistogramChartProps) {
  const chart = useMemo(() => {
    if (bins.length === 0) {
      return {
        bars: [],
        xScale: scaleLinear().domain([0, 1]).range([0, width]),
        yScale: scaleLinear().domain([0, 1]).range([height - 20, 0]),
        maxCount: 0
      };
    }
    const maxCount = Math.max(...bins.map((bin) => bin.count));
    const xScale = scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([0, width]);
    const yScale = scaleLinear().domain([0, maxCount]).range([height - 24, 0]);
    return {
      bars: bins,
      xScale,
      yScale,
      maxCount
    };
  }, [bins, height, width]);

  if (bins.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
        Not enough numeric values to build a distribution.
      </div>
    );
  }

  return (
    <figure className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {chart.bars.map((bin, index) => {
          const barWidth = chart.xScale(bin.x1) - chart.xScale(bin.x0);
          const barHeight = chart.yScale(0) - chart.yScale(bin.count);
          const x = chart.xScale(bin.x0);
          const y = chart.yScale(bin.count);
          return (
            <g key={`${bin.x0}-${index}`}>
              <rect
                x={x + 1}
                y={y}
                width={Math.max(barWidth - 2, 1)}
                height={Math.max(barHeight, 0)}
                rx={4}
                className="fill-primary-500/80"
              />
            </g>
          );
        })}
        <line
          x1={0}
          x2={width}
          y1={height - 24}
          y2={height - 24}
          className="stroke-slate-800"
          strokeWidth={1}
        />
      </svg>
      <figcaption className="mt-3 flex justify-between text-xs text-slate-400">
        <span>{formatInteger(chart.maxCount)} max observations per bin</span>
        <span>{bins.length} bins</span>
      </figcaption>
    </figure>
  );
}
