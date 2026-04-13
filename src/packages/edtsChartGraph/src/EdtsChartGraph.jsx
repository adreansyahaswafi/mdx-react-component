import { createElement, useMemo } from "react";

import Chart from "react-apexcharts";

import "./ui/EdtsChartGraph.css";

/*
Example datasource rows for this widget:

[
    {
        "Label": "Pending",
        "Value": 20,
        "Color": "#f59e0b"
    },
    {
        "Label": "Approved",
        "Value": 45,
        "Color": "#16a34a"
    },
    {
        "Label": "Rejected",
        "Value": 10,
        "Color": "#dc2626"
    },
    {
        "Label": "Draft",
        "Value": 15,
        "Color": "#2563eb"
    }
]

Suggested Mendix entity shape:
- Label: String or Enum
- Value: Integer, Long, or Decimal
- Color: String (optional)
*/

function getAttributeValue(attribute, item, fallback = null) {
    if (!attribute || typeof attribute.get !== "function") {
        return fallback;
    }

    const attributeValue = attribute.get(item);
    return attributeValue && attributeValue.value != null ? attributeValue.value : fallback;
}

function normalizeNumber(value) {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === "bigint") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    if (typeof value === "string") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    if (value && typeof value === "object") {
        if (typeof value.toNumber === "function") {
            const parsedValue = value.toNumber();
            return Number.isFinite(parsedValue) ? parsedValue : null;
        }

        if (typeof value.valueOf === "function") {
            const rawValue = value.valueOf();

            if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
                return rawValue;
            }
        }

        if (typeof value.toString === "function") {
            const parsedValue = Number(value.toString());
            return Number.isFinite(parsedValue) ? parsedValue : null;
        }
    }

    return null;
}

function getDefaultPalette() {
    return ["#1d4ed8", "#0f766e", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2", "#65a30d", "#ea580c"];
}

export function EdtsChartGraph({
    dataSource,
    labelAttr,
    valueAttr,
    colorAttr,
    chartTitle,
    chartSubtitle,
    seriesName,
    chartType,
    height,
    showLegend,
    showToolbar,
    showDataLabels,
    useSmoothCurve
}) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const items =
        dataSource && dataSource.status === "available" && Array.isArray(dataSource.items) ? dataSource.items : [];
    const resolvedChartType = chartType || "bar";
    const resolvedHeight = typeof height === "number" && height > 0 ? height : 340;

    const chartData = useMemo(() => {
        const rows = [];

        items.forEach(item => {
            const labelValue = getAttributeValue(labelAttr, item, "Untitled");
            const numericValue = normalizeNumber(getAttributeValue(valueAttr, item));
            const colorValue = getAttributeValue(colorAttr, item);

            if (numericValue == null) {
                return;
            }

            rows.push({
                label: String(labelValue),
                value: numericValue,
                color: colorValue || null
            });
        });

        return rows;
    }, [items, labelAttr, valueAttr, colorAttr]);

    const colors = useMemo(() => {
        const fallbackPalette = getDefaultPalette();
        return chartData.map((row, index) => row.color || fallbackPalette[index % fallbackPalette.length]);
    }, [chartData]);

    const chartSummary = useMemo(() => {
        const total = chartData.reduce((sum, row) => sum + row.value, 0);
        const topItem = chartData.reduce((best, row) => {
            if (!best || row.value > best.value) {
                return row;
            }

            return best;
        }, null);

        return {
            total,
            totalLabel: Number.isInteger(total) ? String(total) : total.toFixed(2),
            itemCount: chartData.length,
            topItem
        };
    }, [chartData]);

    const options = useMemo(() => {
        const baseOptions = {
            chart: {
                type: resolvedChartType,
                toolbar: {
                    show: showToolbar
                },
                fontFamily:
                    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                background: "transparent"
            },
            colors,
            dataLabels: {
                enabled: showDataLabels
            },
            legend: {
                show: showLegend,
                position: "bottom",
                fontSize: "13px",
                labels: {
                    colors: "#475569"
                }
            },
            stroke: {
                width: resolvedChartType === "bar" ? 0 : 3,
                curve: useSmoothCurve ? "smooth" : "straight"
            },
            grid: {
                borderColor: "#e2e8f0",
                strokeDashArray: 4
            },
            tooltip: {
                theme: "light",
                style: {
                    fontSize: "13px",
                    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                }
            },
            xaxis: {
                categories: chartData.map(row => row.label),
                labels: {
                    style: {
                        colors: "#64748b",
                        fontSize: "12px"
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: "#64748b",
                        fontSize: "12px"
                    }
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 8,
                    columnWidth: "52%",
                    distributed: resolvedChartType === "bar"
                },
                pie: {
                    donut: {
                        size: "68%",
                        labels: {
                            show: resolvedChartType === "donut",
                            total: {
                                show: true,
                                label: "Total",
                                color: "#64748b"
                            }
                        }
                    }
                }
            }
        };

        if (resolvedChartType === "pie" || resolvedChartType === "donut") {
            return {
                ...baseOptions,
                labels: chartData.map(row => row.label),
                xaxis: undefined,
                yaxis: undefined,
                stroke: {
                    width: 2,
                    colors: ["#ffffff"]
                }
            };
        }

        return baseOptions;
    }, [chartData, colors, resolvedChartType, showDataLabels, showLegend, showToolbar, useSmoothCurve]);

    const series = useMemo(() => {
        if (resolvedChartType === "pie" || resolvedChartType === "donut") {
            return chartData.map(row => row.value);
        }

        return [
            {
                name: seriesName || chartTitle || "Series",
                data: chartData.map(row => row.value)
            }
        ];
    }, [chartData, chartTitle, resolvedChartType, seriesName]);

    if (!dataSource || dataSource.status === "loading") {
        return <div className="edts-chart-graph edts-chart-graph--state">Loading chart...</div>;
    }

    if (dataSource.status !== "available") {
        return <div className="edts-chart-graph edts-chart-graph--state">Chart data is not available.</div>;
    }

    if (!chartData.length) {
        return <div className="edts-chart-graph edts-chart-graph--state">No chart data to display.</div>;
    }

    return (
        <div className="edts-chart-graph">
            {(chartTitle || chartSubtitle || chartSummary.topItem) && (
                <div className="edts-chart-graph__header">
                    <div>
                        {chartTitle ? <div className="edts-chart-graph__title">{chartTitle}</div> : null}
                        {chartSubtitle ? <div className="edts-chart-graph__subtitle">{chartSubtitle}</div> : null}
                    </div>
                    <div className="edts-chart-graph__stats">
                        <div className="edts-chart-graph__stat">
                            <span className="edts-chart-graph__stat-label">Total</span>
                            <span className="edts-chart-graph__stat-value">{chartSummary.totalLabel}</span>
                        </div>
                        <div className="edts-chart-graph__stat">
                            <span className="edts-chart-graph__stat-label">Items</span>
                            <span className="edts-chart-graph__stat-value">{chartSummary.itemCount}</span>
                        </div>
                        {chartSummary.topItem ? (
                            <div className="edts-chart-graph__stat edts-chart-graph__stat--accent">
                                <span className="edts-chart-graph__stat-label">Top</span>
                                <span className="edts-chart-graph__stat-value">{chartSummary.topItem.label}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
            <div className="edts-chart-graph__canvas">
                <Chart options={options} series={series} type={resolvedChartType} height={resolvedHeight} />
            </div>
        </div>
    );
}
