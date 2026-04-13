import { createElement } from "react";

import "./ui/EdtsBoardInformation.css";

function getAttributeValue(attribute, item, fallback = null) {
    if (!attribute || typeof attribute.get !== "function" || !item) {
        return fallback;
    }

    const attributeValue = attribute.get(item);
    return attributeValue && attributeValue.value != null ? attributeValue.value : fallback;
}

function getTrendIcon(direction) {
    if (direction === "down") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="edts-board-information__trend-icon">
                <path
                    d="M12 5v14M6 13l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                />
            </svg>
        );
    }

    if (direction === "neutral") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="edts-board-information__trend-icon">
                <path
                    d="M5 12h14"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="edts-board-information__trend-icon">
            <path
                d="M12 19V5M18 11l-6-6-6 6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
            />
        </svg>
    );
}

function normalizeTrendDirection(value, fallbackDirection) {
    const normalizedValue = String(value || "").trim().toLowerCase();

    if (normalizedValue === "up" || normalizedValue === "down" || normalizedValue === "neutral") {
        return normalizedValue;
    }

    return fallbackDirection || "up";
}

export function EdtsBoardInformation({
    dataSource,
    titleAttr,
    valueAttr,
    subtitleAttr,
    trendValueAttr,
    trendDirectionAttr,
    fallbackTrendDirection,
    theme
}) {
    const item =
        dataSource && dataSource.status === "available" && Array.isArray(dataSource.items) && dataSource.items.length
            ? dataSource.items[0]
            : null;

    if (!dataSource || dataSource.status === "loading") {
        return <div className="edts-board-information edts-board-information--light">Loading...</div>;
    }

    if (dataSource.status !== "available" || !item) {
        return <div className="edts-board-information edts-board-information--light">No KPI data available.</div>;
    }

    const title = getAttributeValue(titleAttr, item, "Metric");
    const value = getAttributeValue(valueAttr, item, "-");
    const subtitle = getAttributeValue(subtitleAttr, item);
    const trendValue = getAttributeValue(trendValueAttr, item);
    const trendDirection = normalizeTrendDirection(getAttributeValue(trendDirectionAttr, item), fallbackTrendDirection);
    const resolvedTheme = theme === "light" ? "light" : "dark";

    return (
        <div className={`edts-board-information edts-board-information--${resolvedTheme}`}>
            <div className="edts-board-information__eyebrow">{String(title)}</div>
            <div className="edts-board-information__row">
                <div className="edts-board-information__value">{String(value)}</div>
                {trendValue != null && String(trendValue).trim() !== "" ? (
                    <div className={`edts-board-information__trend edts-board-information__trend--${trendDirection}`}>
                        {getTrendIcon(trendDirection)}
                        <span>{String(trendValue)}</span>
                    </div>
                ) : null}
            </div>
            {subtitle ? <div className="edts-board-information__subtitle">{String(subtitle)}</div> : null}
        </div>
    );
}
