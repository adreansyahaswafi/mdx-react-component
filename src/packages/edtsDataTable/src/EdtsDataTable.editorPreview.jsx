import { createElement } from "react";

function isEnabled(value, fallback = false) {
    if (typeof value === "boolean") {
        return value;
    }

    if (value && typeof value === "object" && typeof value.value === "boolean") {
        return value.value;
    }

    return fallback;
}

export function preview({
    fields,
    title,
    description,
    showSearch,
    searchTitle,
    showFilters,
    paginationRounded,
    showRowNumbers,
    rowNumberHeader,
    showActionsColumn,
    showEditAction,
    showDeleteAction
}) {
    const configuredFields = Array.isArray(fields) ? fields : [];
    const previewFields = configuredFields.filter(field => isEnabled(field.visible, true)).slice(0, 4);
    const previewFilterFields = configuredFields.filter(field => isEnabled(field.showFilter, false)).slice(0, 4);
    const radius = Math.max(Number(paginationRounded) || 10, 0);
    const hasRowNumbers = isEnabled(showRowNumbers, false);
    const hasActionsColumn = isEnabled(showActionsColumn, false) && (isEnabled(showEditAction, true) || isEnabled(showDeleteAction, true));
    const visiblePreviewFields = previewFields.length ? previewFields : [{ header: "Name" }, { header: "Status" }, { header: "Owner" }];

    return (
        <div
            style={{
                display: "grid",
                gap: 14,
                padding: 18,
                borderRadius: 20,
                border: "1px solid #dbe5f2",
                background:
                    "radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 32%), linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{title || "EdtsDataTable"}</div>
                    <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5, color: "#64748b" }}>
                        {description || "Searchable data table with sorting, filters, and configurable visible columns."}
                    </div>
                </div>
            </div>

            {showSearch || showFilters ? (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
                    {showSearch ? (
                        <div style={{ ...controlWrapStyle, flex: "1 1 240px", maxWidth: 320 }}>
                            {searchTitle ? <div style={controlLabelStyle}>{searchTitle}</div> : null}
                            <div style={inputStyle}>Search table...</div>
                        </div>
                    ) : null}
                    {showFilters
                        ? (previewFilterFields.length ? previewFilterFields : [{ header: "Status" }, { header: "Date" }]).map(
                              (field, index) => (
                                  <div key={`${field.header || "filter"}-${index}`} style={controlWrapStyle}>
                                      <div style={controlLabelStyle}>{field.header || "Filter"}</div>
                                      <div style={controlStyle}>All {field.header || "Filter"}</div>
                                  </div>
                              )
                          )
                        : null}
                </div>
            ) : null}

            <div style={{ overflow: "hidden", borderRadius: 18, border: "1px solid #dbe5f2", background: "#fff" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `${hasRowNumbers ? "72px " : ""}repeat(${visiblePreviewFields.length}, minmax(0, 1fr))${
                            hasActionsColumn ? " 112px" : ""
                        }`,
                        background: "#f8fbff"
                    }}
                >
                    {hasRowNumbers ? (
                        <div
                            style={{
                                padding: "14px 16px",
                                borderBottom: "1px solid #edf2f8",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#70829f",
                                textAlign: "center"
                            }}
                        >
                            {rowNumberHeader || "No"}
                        </div>
                    ) : null}
                    {visiblePreviewFields.map((field, index) => (
                        <div
                            key={`${field.header || "field"}-${index}`}
                            style={{
                                padding: "14px 16px",
                                borderBottom: "1px solid #edf2f8",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#70829f"
                            }}
                        >
                            {field.header || "Field"}
                        </div>
                    ))}
                    {hasActionsColumn ? (
                        <div
                            style={{
                                padding: "14px 16px",
                                borderBottom: "1px solid #edf2f8",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: "#70829f",
                                textAlign: "center"
                            }}
                        >
                            Actions
                        </div>
                    ) : null}
                </div>
                {[0, 1, 2].map(row => (
                    <div
                        key={row}
                        style={{
                            display: "grid",
                            gridTemplateColumns: `${hasRowNumbers ? "72px " : ""}repeat(${visiblePreviewFields.length}, minmax(0, 1fr))${
                                hasActionsColumn ? " 112px" : ""
                            }`
                        }}
                    >
                        {hasRowNumbers ? (
                            <div
                                style={{
                                    padding: "16px 12px",
                                    borderBottom: row === 2 ? "0" : "1px solid #edf2f8",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#31517d",
                                    textAlign: "center",
                                    background: row % 2 === 1 ? "rgba(248, 251, 255, 0.9)" : "#fff"
                                }}
                            >
                                {row + 1}
                            </div>
                        ) : null}
                        {Array.from({ length: visiblePreviewFields.length }).map((_, column) => (
                            <div
                                key={`${row}-${column}`}
                                style={{
                                    padding: "16px",
                                    borderBottom: row === 2 ? "0" : "1px solid #edf2f8",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#17263f",
                                    background: row % 2 === 1 ? "rgba(248, 251, 255, 0.9)" : "#fff"
                                }}
                            >
                                Sample value
                            </div>
                        ))}
                        {hasActionsColumn ? (
                            <div
                                style={{
                                    padding: "10px 12px",
                                    borderBottom: row === 2 ? "0" : "1px solid #edf2f8",
                                    background: row % 2 === 1 ? "rgba(248, 251, 255, 0.9)" : "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8
                                }}
                            >
                                {isEnabled(showEditAction, true) ? <span style={actionPreviewStyle}>✎</span> : null}
                                {isEnabled(showDeleteAction, true) ? <span style={actionPreviewDeleteStyle}>🗑</span> : null}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ display: "inline-flex" }}>
                    {["<", "1", "2", "3", "...", "9", "10", ">"].map((item, index, items) => (
                        <div
                            key={`${item}-${index}`}
                            style={{
                                minWidth: 42,
                                height: 42,
                                marginLeft: index === 0 ? 0 : -1,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #d7e3f3",
                                background: item === "1" ? "#6366f1" : "#fff",
                                color: item === "1" ? "#fff" : "#3f5170",
                                fontSize: 14,
                                fontWeight: 700,
                                boxShadow:
                                    item === "1"
                                        ? "0 12px 24px rgba(99, 102, 241, 0.28)"
                                        : "0 6px 18px rgba(15, 23, 42, 0.06)",
                                borderTopLeftRadius: index === 0 ? radius : 0,
                                borderBottomLeftRadius: index === 0 ? radius : 0,
                                borderTopRightRadius: index === items.length - 1 ? radius : 0,
                                borderBottomRightRadius: index === items.length - 1 ? radius : 0
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    minWidth: 220,
    padding: "14px 16px",
    border: "1px solid #cfdbeb",
    borderRadius: 14,
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    color: "#94a3b8"
};

const controlStyle = {
    padding: "14px 16px",
    border: "1px solid #cfdbeb",
    borderRadius: 14,
    background: "#fff",
    fontSize: 13,
    fontWeight: 700,
    color: "#31517d"
};

const controlWrapStyle = {
    display: "grid",
    gap: 8,
    minWidth: 160,
    flex: "1 1 180px",
    maxWidth: 220
};

const controlLabelStyle = {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6b7f9d"
};

const actionPreviewStyle = {
    width: 34,
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    border: "1px solid #d7e4f8",
    background: "#ffffff",
    color: "#4f46e5",
    fontSize: 16
};

const actionPreviewDeleteStyle = {
    ...actionPreviewStyle,
    color: "#dc2626"
};
