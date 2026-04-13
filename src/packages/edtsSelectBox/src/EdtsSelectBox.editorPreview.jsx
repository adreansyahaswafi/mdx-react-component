import { createElement } from "react";

export function preview(values) {
  const label = values.label || "Select Label";
  const placeholder = values.placeholder || "Choose an option";
  const showValidation = Boolean(values.required);
  const helperText = values.helperText || "Helper text appears here.";
  const validationText = values.requiredMessage || "This field is required.";
  const typeLabel =
    values.selectType === "boolean"
      ? "Boolean"
      : values.selectType === "enumeration"
        ? "Enumeration"
        : "Association";

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "inline-flex",
          marginBottom: 8,
          padding: "4px 10px",
          borderRadius: 999,
          border: "1px solid #dbe7f5",
          background: "#f8fbff",
          color: "#2563eb",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {typeLabel}
      </div>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontSize: 13,
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
      </label>
      <div
        style={{
          minHeight: 40,
          padding: "9px 14px",
          borderRadius: 12,
          border: showValidation ? "1px solid #dc3545" : "1px solid #ced4da",
          background: "#ffffff",
          color: "#94a3b8",
          fontSize: 14,
          lineHeight: 1.5,
          boxSizing: "border-box",
          boxShadow: showValidation
            ? "0 0 0 0.18rem rgba(220, 53, 69, 0.16)"
            : "none",
        }}
      >
        {placeholder}
      </div>
      {showValidation ? (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.5,
            color: "#dc2626",
          }}
        >
          {validationText}
        </div>
      ) : (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            lineHeight: 1.5,
            color: "#6c757d",
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
