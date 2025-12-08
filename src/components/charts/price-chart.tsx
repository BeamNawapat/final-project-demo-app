"use client";

import { useId } from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { PriceRecord } from "@/types";

interface PriceChartProps {
    data: PriceRecord[];
    height?: number;
}

export function PriceChart({ data, height = 400 }: PriceChartProps) {
    const gradientId = useId();

    const chartData = data
        // .filter((d) => d.priceMin > 0 && d.priceMax > 0) // Filter out invalid zero values
        .map((d) => ({
            date: d.date,
            min: d.priceMin,
            max: d.priceMax,
            avg: (d.priceMin + d.priceMax) / 2,
        }));

    // Sample data for better performance with large datasets
    const sampledData =
        chartData.length > 365
            ? chartData.filter(
                  (_, i) => i % Math.ceil(chartData.length / 365) === 0
              )
            : chartData;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
                data={sampledData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                        />
                        <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.05}
                        />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.slice(5)}
                    interval="preserveStartEnd"
                    stroke="#6b7280"
                />
                <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `฿${value.toFixed(0)}`}
                    stroke="#6b7280"
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: number) => `฿${value.toFixed(2)}`}
                    labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                    type="monotone"
                    dataKey="max"
                    fill={`url(#${gradientId})`}
                    stroke="none"
                    tooltipType="none"
                />
                <Area
                    type="monotone"
                    dataKey="min"
                    fill="#fff"
                    stroke="none"
                    tooltipType="none"
                />
                <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={false}
                    name="Average"
                />
                <Line
                    type="monotone"
                    dataKey="max"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Max"
                />
                <Line
                    type="monotone"
                    dataKey="min"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Min"
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}
