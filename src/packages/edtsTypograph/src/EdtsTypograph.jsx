import { createElement } from "react";

import "./ui/EdtsTypograph.css";

function getAttributeValue(attribute, fallback = "") {
    if (!attribute) {
        return fallback;
    }

    if (attribute.displayValue) {
        return attribute.displayValue;
    }

    if (attribute.value != null) {
        return attribute.value;
    }

    return fallback;
}

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        return "";
    }

    return new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function formatTime(date) {
    if (!(date instanceof Date)) {
        return "";
    }

    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(date);
}

function getScheduleText({ scheduleText, start, end }) {
    if (start instanceof Date && end instanceof Date) {
        return `${formatDate(start)} ${formatTime(start)} – ${formatTime(end)}`;
    }

    if (start instanceof Date) {
        return `${formatDate(start)} ${formatTime(start)}`;
    }

    return scheduleText || "Friday, 10 April 2026 04:30 – 05:30";
}

function hasContent(value) {
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return Boolean(value);
}

function Icon({ type }) {
    if (type === "category") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 11.5 11.5 3H20v8.5L11.5 20 3 11.5Z" />
                <path d="M15.8 7.2h.01" />
            </svg>
        );
    }

    if (type === "user") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
        );
    }

    if (type === "delete") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M6 7l1 14h10l1-14" />
                <path d="M9 7V4h6v3" />
            </svg>
        );
    }

    if (type === "edit") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m4 20 4.5-1 10-10L15 5.5l-10 10L4 20Z" />
                <path d="m14 6 4 4" />
            </svg>
        );
    }

    return null;
}

export function EdtsTypograph({
    title,
    titleAttr,
    titleContent,
    scheduleText,
    startAttr,
    endAttr,
    scheduleContent,
    categoryText,
    categoryAttr,
    categoryContent,
    ownerText,
    ownerAttr,
    ownerContent,
    detailItems,
    variant,
    accentColor,
    showActions,
    onEdit,
    onDelete
}) {
    const resolvedTitle = getAttributeValue(titleAttr, title || "tostx");
    const resolvedStart = startAttr && startAttr.value instanceof Date ? startAttr.value : null;
    const resolvedEnd = endAttr && endAttr.value instanceof Date ? endAttr.value : null;
    const resolvedSchedule = getScheduleText({
        scheduleText,
        start: resolvedStart,
        end: resolvedEnd
    });
    const resolvedCategory = getAttributeValue(categoryAttr, categoryText || "Respect");
    const resolvedOwner = getAttributeValue(ownerAttr, ownerText || "Adreansyah Aswafi ( PT ASIK BANGET )");
    const resolvedAccentColor = accentColor || "#14236f";
    const className = `edts-typograph edts-typograph--${variant || "lined"}`;
    const rows = Array.isArray(detailItems) && detailItems.length > 0
        ? detailItems.map((item, index) => ({
            key: `custom-${index}`,
            icon: item.iconContent || <span className="edts-typograph__icon-fallback">{index + 1}</span>,
            content: item.content || item.text || "Detail item"
        }))
        : [
            {
                key: "category",
                icon: <Icon type="category" />,
                content: categoryContent || resolvedCategory,
                isCategory: true
            },
            {
                key: "owner",
                icon: <Icon type="user" />,
                content: ownerContent || resolvedOwner
            }
        ];

    return (
        <article className={className} style={{ "--edts-typograph-accent": resolvedAccentColor }}>
            <div className="edts-typograph__content">
                <header className="edts-typograph__header">
                    <h2>{titleContent || resolvedTitle}</h2>
                    {hasContent(scheduleContent) || resolvedSchedule ? <p>{scheduleContent || resolvedSchedule}</p> : null}
                </header>

                <div className="edts-typograph__rows">
                    {rows.map(row => (
                        <div key={row.key} className="edts-typograph__row">
                            <span className={`edts-typograph__icon${row.isCategory ? " edts-typograph__icon--category" : ""}`}>
                                {row.icon}
                            </span>
                            <span className="edts-typograph__row-content">{row.content}</span>
                        </div>
                    ))}
                </div>

                {showActions !== false ? (
                    <footer className="edts-typograph__actions">
                        <button type="button" aria-label="Delete" onClick={() => executeAction(onDelete)}>
                            <Icon type="delete" />
                        </button>
                        <button type="button" aria-label="Edit" onClick={() => executeAction(onEdit)}>
                            <Icon type="edit" />
                        </button>
                    </footer>
                ) : null}
            </div>
        </article>
    );
}
