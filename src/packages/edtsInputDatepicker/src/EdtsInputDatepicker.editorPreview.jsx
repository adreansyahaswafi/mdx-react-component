import { createElement } from "react";

export function preview(values) {
    const label = values.label || "Date";
    const helperText = values.helperText || "Choose a date from the calendar.";
    const showValidation = Boolean(values.required);
    const isDateTime = values.selectionMode === "datetime";
    const previewValue = isDateTime ? "13 Apr 2026 09:30" : "13 Apr 2026";

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
            <div style={{ position: "relative", width: "100%" }}>
                <input
                    type="text"
                    readOnly
                    value={previewValue}
                    placeholder={values.placeholder || "Choose a date"}
                    style={{
                        width: "100%",
                        minHeight: 40,
                        padding: "10px 44px 10px 14px",
                        borderRadius: 12,
                        border: showValidation ? "1px solid #dc3545" : "1px solid #ced4da",
                        background: "#ffffff",
                        color: "#0f172a",
                        fontSize: 14,
                        lineHeight: 1.5,
                        boxSizing: "border-box",
                        boxShadow: showValidation ? "0 0 0 0.18rem rgba(220, 53, 69, 0.16)" : "none"
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: 10,
                        transform: "translateY(-50%)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        color: "#64748b"
                    }}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 18, height: 18 }}>
                        <path
                            d="M7 2.75V5.25M17 2.75V5.25M3.75 8.5H20.25M6.75 4.25H17.25C18.9069 4.25 20.25 5.59315 20.25 7.25V18.25C20.25 19.9069 18.9069 21.25 17.25 21.25H6.75C5.09315 21.25 3.75 19.9069 3.75 18.25V7.25C3.75 5.59315 5.09315 4.25 6.75 4.25Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
            {showValidation ? (
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, lineHeight: 1.5, color: "#dc2626" }}>
                    {values.requiredMessage || "This field is required."}
                </div>
            ) : (
                <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: "#6c757d" }}>{helperText}</div>
            )}
        </div>
    );
}
