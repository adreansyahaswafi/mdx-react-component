import { createElement, useEffect, useId, useMemo, useState } from "react";
import classNames from "classnames";

import "./ui/EdtsInputColorPicker.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function getValue(editableValue) {
    if (!editableValue || editableValue.value == null) {
        return "";
    }

    return String(editableValue.value);
}

function isValidHexColor(value) {
    return /^#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(String(value || "").trim());
}

function normalizeHexColor(value) {
    const normalizedValue = String(value || "").trim();

    if (!normalizedValue) {
        return "";
    }

    const withPrefix = normalizedValue.startsWith("#")
        ? normalizedValue
        : `#${normalizedValue}`;

    return withPrefix.toUpperCase();
}

function getFallbackColor(defaultColor) {
    return isValidHexColor(defaultColor) ? normalizeHexColor(defaultColor) : "#2563EB";
}

function getValidationMessages({
    value,
    required,
    requiredMessage,
    invalidColorMessage,
    mendixValidation
}) {
    const normalizedValue = String(value || "").trim();
    const messages = [];

    if (typeof mendixValidation === "string" && mendixValidation.trim()) {
        messages.push(mendixValidation.trim());
    }

    if (required && !normalizedValue) {
        messages.push(requiredMessage || "This field is required.");
    }

    if (normalizedValue && !isValidHexColor(normalizedValue)) {
        messages.push(invalidColorMessage || "Enter a valid hex color like #2563eb.");
    }

    return Array.from(new Set(messages));
}

export function EdtsInputColorPicker({
    valueAttribute,
    label,
    placeholder,
    helperText,
    defaultColor,
    required,
    requiredMessage,
    invalidColorMessage,
    validateOnChange,
    onChangeAction,
    onBlurAction
}) {
    const [localValue, setLocalValue] = useState(getValue(valueAttribute));
    const [touched, setTouched] = useState(false);
    const [dirty, setDirty] = useState(false);
    const inputId = useId();
    const messageId = useId();
    const fallbackColor = useMemo(() => getFallbackColor(defaultColor), [defaultColor]);
    const normalizedValue = normalizeHexColor(localValue);
    const swatchColor = isValidHexColor(normalizedValue) ? normalizedValue : fallbackColor;

    useEffect(() => {
        setLocalValue(getValue(valueAttribute));
    }, [valueAttribute]);

    const validationMessages = useMemo(() => {
        return getValidationMessages({
            value: localValue,
            required,
            requiredMessage,
            invalidColorMessage,
            mendixValidation: valueAttribute && valueAttribute.validation
        });
    }, [
        invalidColorMessage,
        localValue,
        required,
        requiredMessage,
        valueAttribute
    ]);

    const showValidation = touched || (validateOnChange && dirty);
    const isInvalid = showValidation && validationMessages.length > 0;

    function updateValue(nextValue, shouldExecuteAction = true) {
        setLocalValue(nextValue);
        setDirty(true);

        if (valueAttribute && typeof valueAttribute.setValue === "function" && !valueAttribute.readOnly) {
            valueAttribute.setValue(nextValue);
        }

        if (shouldExecuteAction) {
            executeAction(onChangeAction);
        }
    }

    function handleTextChange(event) {
        updateValue(event.target.value);
    }

    function handleColorChange(event) {
        updateValue(normalizeHexColor(event.target.value));
    }

    function handleBlur() {
        setTouched(true);

        if (localValue && isValidHexColor(localValue)) {
            const normalized = normalizeHexColor(localValue);

            if (normalized !== localValue) {
                updateValue(normalized, false);
            }
        }

        executeAction(onBlurAction);
    }

    function handleInvalid(event) {
        event.preventDefault();
        setTouched(true);
        setDirty(true);
    }

    return (
        <div
            className={classNames("edts-input-color-picker", {
                "edts-input-color-picker--invalid": isInvalid,
                "edts-input-color-picker--readonly": valueAttribute?.readOnly
            })}
        >
            {label ? (
                <label className="edts-input-color-picker__label" htmlFor={inputId}>
                    <span>{label}</span>
                    {required ? <span className="edts-input-color-picker__required">*</span> : null}
                </label>
            ) : null}
            <div className={classNames("edts-input-color-picker__control", { "is-invalid": isInvalid })}>
                <input
                    className="edts-input-color-picker__native"
                    type="color"
                    value={swatchColor}
                    onChange={handleColorChange}
                    onBlur={handleBlur}
                    disabled={Boolean(valueAttribute?.readOnly)}
                    aria-label={label || "Pick color"}
                />
                <div
                    className="edts-input-color-picker__swatch"
                    style={{ "--edts-input-color-picker-value": swatchColor }}
                    aria-hidden="true"
                />
                <input
                    id={inputId}
                    className={classNames(
                        "edts-input-color-picker__field",
                        "form-control",
                        { "is-invalid": isInvalid }
                    )}
                    type="text"
                    value={localValue}
                    placeholder={placeholder || "#2563eb"}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    onInvalid={handleInvalid}
                    readOnly={Boolean(valueAttribute?.readOnly)}
                    required={Boolean(required)}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? messageId : undefined}
                />
            </div>
            {isInvalid ? (
                <div className="edts-input-color-picker__messages" id={messageId}>
                    {validationMessages.map((message, index) => (
                        <div key={index} className={classNames("edts-input-color-picker__message", "invalid-feedback")}>
                            {message}
                        </div>
                    ))}
                </div>
            ) : helperText ? (
                <div className={classNames("edts-input-color-picker__helper", "form-text", "text-muted")}>
                    {helperText}
                </div>
            ) : null}
        </div>
    );
}
