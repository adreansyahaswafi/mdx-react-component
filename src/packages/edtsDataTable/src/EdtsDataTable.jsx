import { createElement, useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";

import "react-datepicker/dist/react-datepicker.css";
import "./ui/EdtsDataTable.css";

function getFieldKey(field, index) {
    return `${field.header || "field"}-${index}`;
}

function padDatePart(value) {
    return String(value).padStart(2, "0");
}

function formatDateWithPattern(date, pattern) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return "";
    }

    const formatPattern = pattern || "dd MMM yyyy HH:mm";
    const monthShort = date.toLocaleDateString("en-US", { month: "short" });
    const monthLong = date.toLocaleDateString("en-US", { month: "long" });
    const weekdayShort = date.toLocaleDateString("en-US", { weekday: "short" });
    const weekdayLong = date.toLocaleDateString("en-US", { weekday: "long" });
    const replacements = [
        ["yyyy", String(date.getFullYear())],
        ["MMMM", monthLong],
        ["MMM", monthShort],
        ["MM", padDatePart(date.getMonth() + 1)],
        ["dddd", weekdayLong],
        ["ddd", weekdayShort],
        ["dd", padDatePart(date.getDate())],
        ["HH", padDatePart(date.getHours())],
        ["mm", padDatePart(date.getMinutes())]
    ];

    return replacements.reduce(
        (formattedValue, [token, tokenValue]) => formattedValue.replaceAll(token, tokenValue),
        formatPattern
    );
}

function resolveAttribute(attribute, item, options = {}) {
    if (!attribute || typeof attribute.get !== "function" || !item) {
        return { raw: "", display: "" };
    }

    const value = attribute.get(item);

    if (!value) {
        return { raw: "", display: "" };
    }

    const raw = typeof value.value === "undefined" ? "" : value.value;
    const customDateDisplay =
        raw instanceof Date && options.dateDisplayFormat ? formatDateWithPattern(raw, options.dateDisplayFormat) : "";
    const display =
        customDateDisplay ||
        (typeof value.displayValue !== "undefined" && value.displayValue !== null && String(value.displayValue).trim() !== ""
            ? String(value.displayValue)
            : raw == null
              ? ""
              : raw instanceof Date
                ? new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                  }).format(raw)
                : String(raw));

    return { raw, display };
}

function resolveActionValue(action, item) {
    if (!action) {
        return null;
    }

    if (typeof action.get === "function" && item) {
        return action.get(item);
    }

    return action;
}

function getColorToken(value) {
    const normalized = String(value || "").trim();

    if (!normalized) {
        return "";
    }

    return normalized;
}

function canExecuteAction(action, item) {
    const resolvedAction = resolveActionValue(action, item);

    if (!resolvedAction) {
        return false;
    }

    if (typeof resolvedAction.canExecute === "boolean") {
        return resolvedAction.canExecute;
    }

    return typeof resolvedAction.execute === "function";
}

function executeRowAction(action, item) {
    const resolvedAction = resolveActionValue(action, item);

    if (!resolvedAction || !canExecuteAction(action, item)) {
        return;
    }

    resolvedAction.execute();
}

function compareValues(left, right) {
    if (left == null && right == null) {
        return 0;
    }

    if (left == null) {
        return -1;
    }

    if (right == null) {
        return 1;
    }

    if (left instanceof Date && right instanceof Date) {
        return left.getTime() - right.getTime();
    }

    if (typeof left === "number" && typeof right === "number") {
        return left - right;
    }

    if (typeof left === "boolean" && typeof right === "boolean") {
        return Number(left) - Number(right);
    }

    return String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: "base"
    });
}

function getAlignmentClass(align) {
    switch (align) {
        case "center":
            return "edts-data-table__cell--center";
        case "right":
            return "edts-data-table__cell--right";
        default:
            return "edts-data-table__cell--left";
    }
}

function formatDateFilterValue(value) {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
        return "";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function normalizeFilterComparableValue(value) {
    if (value == null || value === "") {
        return "";
    }

    if (value instanceof Date) {
        return formatDateFilterValue(value);
    }

    if (Array.isArray(value)) {
        return value
            .map(item => (item && typeof item === "object" && "id" in item ? String(item.id) : String(item)))
            .join("|");
    }

    if (typeof value === "object") {
        if ("id" in value && value.id) {
            return String(value.id);
        }

        return "";
    }

    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }

    return String(value);
}

function parseFilterDate(value) {
    if (!value || typeof value !== "string") {
        return null;
    }

    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function inferFilterType(field, rows) {
    if (field.filterType && field.filterType !== "none") {
        return field.filterType;
    }

    const sampleRawValue = rows
        .map(row => row.filterValues?.[field.key]?.raw)
        .find(value => value != null && value !== "");

    if (sampleRawValue instanceof Date) {
        return "date";
    }

    return "select";
}

const selectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: 40,
        borderRadius: 8,
        borderColor: state.isFocused ? "#94a3b8" : "#d0d7de",
        boxShadow: state.isFocused ? "0 0 0 3px rgba(148, 163, 184, 0.25)" : "none",
        backgroundColor: "#ffffff",
        transition: "all 0.2s ease",
        "&:hover": {
            borderColor: state.isFocused ? "#94a3b8" : "#d0d7de"
        }
    }),
    valueContainer: base => ({
        ...base,
        minHeight: 40,
        padding: "0 16px"
    }),
    input: base => ({
        ...base,
        margin: 0,
        padding: 0
    }),
    placeholder: base => ({
        ...base,
        color: "#94a3b8",
        fontWeight: 400
    }),
    menu: base => ({
        ...base,
        zIndex: 20,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e5e7eb"
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? "#111827" : state.isFocused ? "#f9fafb" : "#ffffff",
        color: state.isSelected ? "#ffffff" : "#111827",
        transition: "all 0.2s ease"
    }),
    indicatorSeparator: base => ({
        ...base,
        backgroundColor: "#e5e7eb"
    })
};

function isEnabled(value, fallback = false) {
    if (typeof value === "boolean") {
        return value;
    }

    if (value && typeof value === "object") {
        if (typeof value.value === "boolean") {
            return value.value;
        }

        if (typeof value.value === "string") {
            return value.value === "true";
        }

        if (typeof value.displayValue === "string") {
            return value.displayValue === "true";
        }
    }

    if (typeof value === "string") {
        return value === "true";
    }

    return fallback;
}

function buildPaginationItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, currentPage]);

    if (currentPage > 1) {
        pages.add(currentPage - 1);
    }

    if (currentPage < totalPages) {
        pages.add(currentPage + 1);
    }

    if (currentPage <= 3) {
        pages.add(2);
        pages.add(3);
    }

    if (currentPage >= totalPages - 2) {
        pages.add(totalPages - 1);
        pages.add(totalPages - 2);
    }

    const sortedPages = Array.from(pages)
        .filter(page => page >= 1 && page <= totalPages)
        .sort((left, right) => left - right);

    const items = [];

    sortedPages.forEach((page, index) => {
        if (index > 0 && page - sortedPages[index - 1] > 1) {
            items.push("ellipsis");
        }

        items.push(page);
    });

    return items;
}

export function EdtsDataTable({
    dataSource,
    fields,
    title,
    description,
    showSearch,
    searchTitle,
    searchPlaceholder,
    showFilters,
    rowsPerPage,
    compact,
    striped,
    stickyHeader,
    showRowNumbers,
    rowNumberHeader,
    emptyMessage,
    paginationRounded,
    disablePreviousDates,
    showMonthDropdown,
    showYearDropdown,
    staticFilterOptions,
    onRowClick,
    showActionsColumn,
    actionsHeader,
    showEditAction,
    editAction,
    editButtonLabel,
    showDeleteAction,
    deleteAction,
    deleteButtonLabel
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortState, setSortState] = useState({ key: "", direction: "asc" });
    const [activeFilters, setActiveFilters] = useState({});
    const [page, setPage] = useState(1);

    const resolvedFields = useMemo(
        () =>
            (Array.isArray(fields) ? fields : [])
                .filter(field => field && field.header && field.valueAttr)
                .map((field, index) => ({
                    ...field,
                    key: getFieldKey(field, index)
                })),
        [fields]
    );

    useEffect(() => {
        setActiveFilters(previous =>
            Object.keys(previous).reduce((accumulator, key) => {
                if (resolvedFields.some(field => field.key === key)) {
                    accumulator[key] = previous[key];
                }

                return accumulator;
            }, {})
        );
    }, [resolvedFields]);

    const sourceItems = dataSource && dataSource.status === "available" && Array.isArray(dataSource.items) ? dataSource.items : [];

    const normalizedRows = useMemo(
        () =>
            sourceItems.map((item, index) => {
                const fieldValues = resolvedFields.reduce((accumulator, field) => {
                    accumulator[field.key] = resolveAttribute(field.valueAttr, item, {
                        dateDisplayFormat: field.dateDisplayFormat
                    });
                    return accumulator;
                }, {});

                const colorValues = resolvedFields.reduce((accumulator, field) => {
                    accumulator[field.key] = getColorToken(resolveAttribute(field.colorByAttr, item).display);
                    return accumulator;
                }, {});

                const filterValues = resolvedFields.reduce((accumulator, field) => {
                    accumulator[field.key] = resolveAttribute(field.filterAttr || field.valueAttr, item, {
                        dateDisplayFormat: field.dateDisplayFormat
                    });
                    return accumulator;
                }, {});

                return {
                    id: item.id || `row-${index}`,
                    item,
                    fieldValues,
                    colorValues,
                    filterValues
                };
            }),
        [sourceItems, resolvedFields]
    );

    const filterableFields = useMemo(() => {
        return resolvedFields
            .filter(field => isEnabled(field.showFilter) || isEnabled(field.filterable))
            .map(field => ({
                ...field,
                effectiveFilterType: inferFilterType(field, normalizedRows)
            }));
    }, [normalizedRows, resolvedFields]);

    const filterOptions = useMemo(
        () =>
            filterableFields.reduce((accumulator, field) => {
                if (field.effectiveFilterType === "date") {
                    return accumulator;
                }

                if (field.filterOptionsMode === "static") {
                    accumulator[field.key] = (Array.isArray(staticFilterOptions) ? staticFilterOptions : [])
                        .filter(option => option && String(option.fieldHeader || "").trim() === String(field.header || "").trim())
                        .map(option => ({
                            label: String(option.label || "").trim(),
                            value: String(option.value || "").trim()
                        }))
                        .filter(option => option.label && option.value)
                        .filter(
                            (option, index, list) =>
                                list.findIndex(
                                    candidate => candidate.label === option.label && candidate.value === option.value
                                ) === index
                        );

                    return accumulator;
                }

                if (field.filterOptionsSource) {
                    const sourceItems =
                        field.filterOptionsSource &&
                        field.filterOptionsSource.status === "available" &&
                        Array.isArray(field.filterOptionsSource.items)
                            ? field.filterOptionsSource.items
                            : [];

                    accumulator[field.key] = sourceItems
                        .map(item => {
                            const labelValue = resolveAttribute(field.filterOptionLabelAttr, item);
                            const valueValue = resolveAttribute(field.filterOptionValueAttr || field.filterOptionLabelAttr, item);

                            return {
                                label: labelValue.display || normalizeFilterComparableValue(labelValue.raw),
                                value: normalizeFilterComparableValue(valueValue.raw)
                            };
                        })
                        .filter(option => option.label && option.value)
                        .filter(
                            (option, index, list) =>
                                list.findIndex(candidate => candidate.value === option.value) === index
                        )
                        .sort((left, right) =>
                            left.label.localeCompare(right.label, undefined, { numeric: true, sensitivity: "base" })
                        );

                    return accumulator;
                }

                accumulator[field.key] = normalizedRows
                    .map(row => ({
                        label: row.filterValues[field.key]?.display || "",
                        value: normalizeFilterComparableValue(row.filterValues[field.key]?.raw)
                    }))
                    .filter(option => option.label && option.value)
                    .filter(
                        (option, index, list) =>
                            list.findIndex(candidate => candidate.value === option.value) === index
                    )
                    .sort((left, right) =>
                        left.label.localeCompare(right.label, undefined, { numeric: true, sensitivity: "base" })
                    );

                return accumulator;
            }, {}),
        [normalizedRows, filterableFields, staticFilterOptions]
    );

    const visibleFields = useMemo(
        () => resolvedFields.filter(field => isEnabled(field.visible, true)),
        [resolvedFields]
    );

    const filteredRows = useMemo(() => {
        const loweredSearch = searchTerm.trim().toLowerCase();

        return normalizedRows.filter(row => {
            const matchesSearch =
                !loweredSearch ||
                resolvedFields.some(field => {
                    if (!field.searchable) {
                        return false;
                    }

                    return (row.fieldValues[field.key]?.display || "").toLowerCase().includes(loweredSearch);
                });

            if (!matchesSearch) {
                return false;
            }

            return resolvedFields.every(field => {
                const selectedValue = activeFilters[field.key];

                if (!selectedValue) {
                    return true;
                }

                if (field.effectiveFilterType === "date") {
                    return formatDateFilterValue(row.filterValues[field.key]?.raw) === selectedValue;
                }

                return normalizeFilterComparableValue(row.filterValues[field.key]?.raw) === selectedValue;
            });
        });
    }, [normalizedRows, resolvedFields, searchTerm, activeFilters]);

    const sortedRows = useMemo(() => {
        if (!sortState.key) {
            return filteredRows;
        }

        const sorted = [...filteredRows].sort((left, right) =>
            compareValues(left.fieldValues[sortState.key]?.raw, right.fieldValues[sortState.key]?.raw)
        );

        return sortState.direction === "desc" ? sorted.reverse() : sorted;
    }, [filteredRows, sortState]);

    const safeRowsPerPage = Math.max(Number(rowsPerPage) || 8, 1);
    const totalPages = Math.max(Math.ceil(sortedRows.length / safeRowsPerPage), 1);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, activeFilters, sortState, visibleFields]);

    useEffect(() => {
        setPage(previous => Math.min(previous, totalPages));
    }, [totalPages]);

    const pagedRows = useMemo(() => {
        const start = (page - 1) * safeRowsPerPage;
        return sortedRows.slice(start, start + safeRowsPerPage);
    }, [page, safeRowsPerPage, sortedRows]);

    const paginationItems = useMemo(() => buildPaginationItems(page, totalPages), [page, totalPages]);
    const minFilterDate = disablePreviousDates ? new Date(new Date().setHours(0, 0, 0, 0)) : undefined;
    const hasEditAction = isEnabled(showEditAction) && !!editAction;
    const hasDeleteAction = isEnabled(showDeleteAction) && !!deleteAction;
    const hasActionsColumn = isEnabled(showActionsColumn) && (hasEditAction || hasDeleteAction);
    const hasRowNumbers = isEnabled(showRowNumbers);

    function handleSort(field) {
        if (!field.sortable) {
            return;
        }

        setSortState(previous => {
            if (previous.key === field.key) {
                return {
                    key: field.key,
                    direction: previous.direction === "asc" ? "desc" : "asc"
                };
            }

            return { key: field.key, direction: "asc" };
        });
    }

    function handleFilterChange(fieldKey, value) {
        setActiveFilters(previous => ({
            ...previous,
            [fieldKey]: value
        }));
    }

    function handleActionClick(event, action, item) {
        event.stopPropagation();
        executeRowAction(action, item);
    }

    return (
        <div
            className={`edts-data-table ${compact ? "edts-data-table--compact" : ""} ${
                striped ? "edts-data-table--striped" : ""
            } ${stickyHeader ? "edts-data-table--sticky" : ""}`}
            style={{
                "--edts-data-table-pagination-radius": `${Math.max(Number(paginationRounded) || 10, 0)}px`
            }}
        >
            <div className="edts-data-table__shell">
                <div className="edts-data-table__header">
                    <div className="edts-data-table__intro">
                        {title ? <div className="edts-data-table__title">{title}</div> : null}
                        {description ? <div className="edts-data-table__description">{description}</div> : null}
                    </div>
                </div>

                {showSearch || showFilters ? (
                    <div className="edts-data-table__toolbar">
                        {showSearch ? (
                            <label className="edts-data-table__search ui-form-group">
                                {searchTitle ? <span className="edts-data-table__control-label ui-label">{searchTitle}</span> : null}
                                <span className="edts-data-table__search-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="7" />
                                        <path d="M20 20l-3.5-3.5" />
                                    </svg>
                                </span>
                                <input
                                    type="search"
                                    className="ui-field ui-size-md"
                                    value={searchTerm}
                                    placeholder={searchPlaceholder || "Search table..."}
                                    onChange={event => setSearchTerm(event.target.value)}
                                />
                            </label>
                        ) : null}

                        {showFilters
                            ? filterableFields.map(field => (
                                  <label key={field.key} className="edts-data-table__filter">
                                      <span className="ui-label">{field.header}</span>
                                      {field.effectiveFilterType === "date" ? (
                                          <ReactDatePicker
                                              selected={parseFilterDate(activeFilters[field.key])}
                                              onChange={value =>
                                                  handleFilterChange(
                                                      field.key,
                                                      value instanceof Date ? formatDateFilterValue(value) : ""
                                                  )
                                              }
                                              dateFormat="dd MMM yyyy"
                                              placeholderText={`All ${field.header}`}
                                              className="edts-data-table__date-filter ui-field ui-size-md"
                                              isClearable
                                              showPopperArrow={false}
                                              minDate={minFilterDate}
                                              showMonthDropdown={showMonthDropdown}
                                              showYearDropdown={showYearDropdown}
                                              dropdownMode="select"
                                          />
                                      ) : (
                                          <Select
                                              className="edts-data-table__select-filter"
                                              classNamePrefix="edts-data-table__react-select"
                                              placeholder={`All ${field.header}`}
                                              isClearable
                                              isSearchable
                                              value={
                                                  activeFilters[field.key]
                                                      ? (filterOptions[field.key] || []).find(
                                                            option => option.value === activeFilters[field.key]
                                                        ) || null
                                                      : null
                                              }
                                              options={filterOptions[field.key] || []}
                                              styles={selectStyles}
                                              onChange={option => handleFilterChange(field.key, option ? option.value : "")}
                                          />
                                      )}
                                  </label>
                              ))
                            : null}
                    </div>
                ) : null}

                <div className="edts-data-table__surface">
                    <table className="edts-data-table__table">
                        <thead>
                            <tr>
                                {hasRowNumbers ? <th className="edts-data-table__th edts-data-table__th--number">{rowNumberHeader || "No"}</th> : null}
                                {visibleFields.map(field => (
                                    <th
                                        key={field.key}
                                        className={field.sortable ? "edts-data-table__th--sortable" : ""}
                                    >
                                        <button
                                            type="button"
                                            className="edts-data-table__sort ui-control ui-variant-ghost"
                                            onClick={() => handleSort(field)}
                                            disabled={!field.sortable}
                                        >
                                            <span>{field.header}</span>
                                            {field.sortable ? (
                                                <span
                                                    className={`edts-data-table__sort-indicator ${
                                                        sortState.key === field.key
                                                            ? `edts-data-table__sort-indicator--${sortState.direction}`
                                                            : ""
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                        <path d="M6 8l4-4 4 4" />
                                                        <path d="M14 12l-4 4-4-4" />
                                                    </svg>
                                                </span>
                                            ) : null}
                                        </button>
                                    </th>
                                ))}
                                {hasActionsColumn ? (
                                    <th className="edts-data-table__actions-header">{actionsHeader || "Actions"}</th>
                                ) : null}
                            </tr>
                        </thead>
                        <tbody>
                            {pagedRows.length ? (
                                pagedRows.map((row, rowIndex) => (
                                    <tr
                                        key={row.id}
                                        className={onRowClick ? "edts-data-table__row--clickable" : ""}
                                        onClick={() => executeRowAction(onRowClick, row.item)}
                                    >
                                        {hasRowNumbers ? (
                                            <td className="edts-data-table__cell edts-data-table__cell--number">
                                                {(page - 1) * safeRowsPerPage + rowIndex + 1}
                                            </td>
                                        ) : null}
                                        {visibleFields.map(field => (
                                            <td key={`${row.id}-${field.key}`} className={getAlignmentClass(field.align)}>
                                                <span className="edts-data-table__cell-value">
                                                    {row.colorValues[field.key] ? (
                                                        <span
                                                            className="edts-data-table__color-indicator"
                                                            style={{ backgroundColor: row.colorValues[field.key] }}
                                                            aria-hidden="true"
                                                        />
                                                    ) : null}
                                                    {row.fieldValues[field.key]?.display || "—"}
                                                </span>
                                            </td>
                                        ))}
                                        {hasActionsColumn ? (
                                            <td className="edts-data-table__actions-cell">
                                                <div className="edts-data-table__actions">
                                                    {hasEditAction ? (
                                                        <button
                                                            type="button"
                                                            className="edts-data-table__action-button edts-data-table__action-button--edit ui-control ui-size-sm ui-variant-outline"
                                                            onClick={event => handleActionClick(event, editAction, row.item)}
                                                            disabled={!canExecuteAction(editAction, row.item)}
                                                            aria-label={editButtonLabel || "Edit row"}
                                                            title={editButtonLabel || "Edit"}
                                                        >
                                                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                                <path d="M3 14.75V17h2.25L15 7.25 12.75 5 3 14.75z" />
                                                                <path d="M11.75 6l2.25 2.25" />
                                                            </svg>
                                                            {editButtonLabel ? (
                                                                <span className="edts-data-table__action-label">{editButtonLabel}</span>
                                                            ) : null}
                                                        </button>
                                                    ) : null}
                                                    {hasDeleteAction ? (
                                                        <button
                                                            type="button"
                                                            className="edts-data-table__action-button edts-data-table__action-button--delete ui-control ui-size-sm ui-variant-destructive"
                                                            onClick={event => handleActionClick(event, deleteAction, row.item)}
                                                            disabled={!canExecuteAction(deleteAction, row.item)}
                                                            aria-label={deleteButtonLabel || "Delete row"}
                                                            title={deleteButtonLabel || "Delete"}
                                                        >
                                                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                                <path d="M5.5 6.5h9" />
                                                                <path d="M7 6.5V5a1 1 0 011-1h4a1 1 0 011 1v1.5" />
                                                                <path d="M7.5 8.5V14" />
                                                                <path d="M10 8.5V14" />
                                                                <path d="M12.5 8.5V14" />
                                                                <path d="M6.5 6.5l.5 9a1 1 0 001 1h4a1 1 0 001-1l.5-9" />
                                                            </svg>
                                                            {deleteButtonLabel ? (
                                                                <span className="edts-data-table__action-label">{deleteButtonLabel}</span>
                                                            ) : null}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </td>
                                        ) : null}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={Math.max(
                                            visibleFields.length + (hasActionsColumn ? 1 : 0) + (hasRowNumbers ? 1 : 0),
                                            1
                                        )}
                                        className="edts-data-table__empty"
                                    >
                                        <div className="edts-data-table__empty-title">{emptyMessage || "No rows found."}</div>
                                        <div className="edts-data-table__empty-copy">
                                            Try another search keyword or filter value.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="edts-data-table__footer">
                    <div className="edts-data-table__summary">
                        Showing {pagedRows.length ? (page - 1) * safeRowsPerPage + 1 : 0}-
                        {Math.min(page * safeRowsPerPage, sortedRows.length)} of {sortedRows.length}
                    </div>
                    <div className="edts-data-table__pagination">
                        <button
                            type="button"
                            className="edts-data-table__page-button edts-data-table__page-button--nav ui-control ui-size-md ui-variant-outline"
                            onClick={() => setPage(previous => Math.max(previous - 1, 1))}
                            disabled={page === 1}
                            aria-label="Previous page"
                        >
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12.5 4.5L7 10l5.5 5.5" />
                            </svg>
                        </button>
                        {paginationItems.map((item, index) =>
                            item === "ellipsis" ? (
                                <span key={`ellipsis-${index}`} className="edts-data-table__page-ellipsis" aria-hidden="true">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={`page-${item}`}
                                    type="button"
                                    className={`edts-data-table__page-button ${
                                        item === page ? "edts-data-table__page-button--active" : ""
                                    } ui-control ui-size-md ${item === page ? "ui-variant-default" : "ui-variant-outline"}`}
                                    onClick={() => setPage(item)}
                                    aria-current={item === page ? "page" : undefined}
                                >
                                    {item}
                                </button>
                            )
                        )}
                        <button
                            type="button"
                            className="edts-data-table__page-button edts-data-table__page-button--nav ui-control ui-size-md ui-variant-outline"
                            onClick={() => setPage(previous => Math.min(previous + 1, totalPages))}
                            disabled={page === totalPages}
                            aria-label="Next page"
                        >
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M7.5 4.5L13 10l-5.5 5.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
