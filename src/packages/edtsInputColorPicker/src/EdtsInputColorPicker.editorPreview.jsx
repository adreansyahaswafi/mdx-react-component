import { createElement } from "react";

function getPreviewColor(values) {
    return values.defaultColor || "#2563eb";
}

export function preview(values) {
    const label = values.label || "Color";
    const placeholder = values.placeholder || "#2563eb";
    const helperText = values.helperText || "Pick a brand or theme color.";
    const showValidation = Boolean(values.required);
    const validationText = values.requiredMessage || "This field is required.";
    const previewColor = getPreviewColor(values);

    return (
        <div style={{ width: "100%" }}>
            <label
                style={{
                    display: "block",
                    marginBottom: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#334155"
                }}
            >
                {label}
            </label>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    minHeight: 48,
                    padding: "8px 12px",
                    borderRadius: 12,
                    border: showValidation ? "1px solid #dc3545" : "1px solid #ced4da",
                    background: "#ffffff",
                    boxSizing: "border-box",
                    boxShadow: showValidation ? "0 0 0 0.18rem rgba(220, 53, 69, 0.16)" : "none"
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 10,
                        border: "1px solid rgba(15, 23, 42, 0.12)",
                        background: previewColor,
                        flex: "0 0 auto"
                    }}
                />
                <input
                    type="text"
                    value={previewColor || placeholder}
                    readOnly
                    style={{
                        width: "100%",
                        border: 0,
                        outline: "none",
                        background: "transparent",
                        color: "#0f172a",
                        fontSize: 14,
                        lineHeight: 1.5,
                        padding: 0,
                        boxSizing: "border-box"
                    }}
                />
            </div>
            {showValidation ? (
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, lineHeight: 1.5, color: "#dc2626" }}>
                    {validationText}
                </div>
            ) : (
                <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: "#6c757d" }}>{helperText}</div>
            )}
        </div>
    );
}
