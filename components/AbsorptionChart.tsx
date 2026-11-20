'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartDataset,
} from 'chart.js';
import { fa } from '@/lib/site';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

/* series colours, in order: terracotta, petrol, brass */
const COLOURS = ['#cc7529', '#002736', '#c9a15a'];

export type CurveSeries = { label: string; values: number[] };

function faNum(value: number, digits = 2) {
  const fixed = value.toFixed(digits).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  return fa(fixed).replace('.', '٫');
}

/* The absorption curves from the printed catalogue, drawn live so the reader
   can compare thicknesses and air gaps instead of squinting at a scan. */
export function AbsorptionChart({
  freqs,
  series,
  code,
}: {
  freqs: number[];
  series: CurveSeries[];
  code: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [on, setOn] = useState<boolean[]>(() => series.map(() => true));

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const family = getComputedStyle(document.body).fontFamily || 'Tahoma, sans-serif';
    const peak = Math.max(...series.flatMap((s) => s.values));
    const yMax = Math.ceil(peak * 10) / 10;
    const ink = '#55607a';
    const line = 'rgba(15, 19, 31, 0.12)';

    const chart = new Chart(el, {
      type: 'line',
      data: {
        labels: freqs.map((f) => fa(f)),
        datasets: series.map((s, i) => ({
          label: s.label,
          data: s.values,
          borderColor: COLOURS[i % COLOURS.length],
          backgroundColor: COLOURS[i % COLOURS.length],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: COLOURS[i % COLOURS.length],
          pointHoverBorderColor: '#f8f6f0',
          pointHoverBorderWidth: 2,
          tension: 0.35,
        })) as ChartDataset<'line'>[],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 6, right: 4 } },
        scales: {
          x: {
            grid: { display: false },
            border: { color: 'rgba(15, 19, 31, 0.28)' },
            ticks: {
              color: ink,
              font: { family, size: 11 },
              maxRotation: 0,
              autoSkipPadding: 10,
            },
          },
          y: {
            min: 0,
            max: yMax,
            border: { display: false },
            grid: { color: line },
            ticks: {
              stepSize: 0.1,
              color: ink,
              font: { family, size: 11 },
              callback: (value) => faNum(Number(value), 1),
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            textDirection: 'rtl',
            backgroundColor: '#002736',
            titleColor: '#f8f6f0',
            bodyColor: '#f8f6f0',
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            boxWidth: 10,
            boxHeight: 10,
            titleFont: { family, size: 12 },
            bodyFont: { family, size: 12 },
            callbacks: {
              title: (items) => `${items[0]?.label ?? ''} هرتز`,
              label: (item) => `${faNum(Number(item.parsed.y))}  ${item.dataset.label}`,
            },
          },
        },
      },
    });

    chartRef.current = chart;
    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, [freqs, series]);

  function toggle(index: number) {
    const chart = chartRef.current;
    const next = on.map((v, i) => (i === index ? !v : v));
    setOn(next);
    if (chart) {
      chart.setDatasetVisibility(index, next[index]);
      chart.update();
    }
  }

  return (
    <div className="chart-plot">
      <div className="chart-canvas-wrap">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`منحنی ضریب جذب ${code} بر اساس فرکانس`}
        />
      </div>
      <div className="chart-legend" role="group" aria-label="نمایش منحنی‌ها">
        {series.map((s, i) => (
          <button
            key={s.label}
            type="button"
            aria-pressed={on[i]}
            onClick={() => toggle(i)}
            style={{ color: on[i] ? 'inherit' : 'var(--color-muted)' }}
          >
            <i style={{ background: COLOURS[i % COLOURS.length], opacity: on[i] ? 1 : 0.35 }} aria-hidden="true" />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}