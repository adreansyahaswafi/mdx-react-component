import { createElement } from "react";

function getPreviewText(values) {
    if (values.required) {
        return values.requiredMessage || "This field is required.";
    }

    if (values.minLength > 0) {
        return values.minLengthMessage || "Please enter more characters.";
    }

    if (values.maxLength > 0) {
        return values.maxLengthMessage || "Please shorten this value.";
    }

    if (values.pattern) {
        return values.patternMessage || "The value format is invalid.";
    }

    return "";
}

export function preview(values) {
    const label = values.label || "Input Label";
    const placeholder = values.placeholder || `Enter ${label.toLowerCase()}`;
    const helperText = values.helperText || "Helper text appears here.";
    const validationText = getPreviewText(values);
    const showValidation = Boolean(validationText);
    const previewType = values.inputType === "password" ? "password" : "text";
    const previewValue = values.inputType === "email" ? "name@example.com" : values.inputType === "tel" ? "+62 812 3456 7890" : placeholder;
    const isPassword = values.inputType === "password";

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
                    type={previewType}
                    value={previewValue}
                    readOnly
                    placeholder={placeholder}
                    style={{
                        width: "100%",
                        minHeight: 40,
                        padding: isPassword ? "10px 44px 10px 14px" : "10px 14px",
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
                {isPassword ? (
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
                                d="M2 12s3.6-5.5 10-5.5S22 12 22 12s-3.6 5.5-10 5.5S2 12 2 12Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                            />
                            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                    </div>
                ) : null}
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
