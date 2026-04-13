import { createElement, useEffect, useId, useMemo, useState } from "react";
import classNames from "classnames";

import "./ui/EdtsInput.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function getValue(editableValue) {
    if (!editableValue) {
        return "";
    }

    if (editableValue.value == null) {
        return "";
    }

    return String(editableValue.value);
}

function parsePatternConfig(pattern) {
    const rawPattern = typeof pattern === "string" ? pattern.trim() : "";

    if (!rawPattern) {
        return null;
    }

    const slashWrappedMatch = rawPattern.match(/^\/(.+)\/([a-z]*)$/i);

    if (slashWrappedMatch) {
        return {
            source: slashWrappedMatch[1],
            flags: slashWrappedMatch[2] || ""
        };
    }

    return {
        source: rawPattern,
        flags: ""
    };
}

function getValidationMessages({
    value,
    required,
    minLength,
    maxLength,
    pattern,
    requiredMessage,
    minLengthMessage,
    maxLengthMessage,
    patternMessage,
    mendixValidation
}) {
    const normalizedValue = value || "";
    const trimmedValue = normalizedValue.trim();
    const messages = [];
    const patternConfig = parsePatternConfig(pattern);

    if (typeof mendixValidation === "string" && mendixValidation.trim()) {
        messages.push(mendixValidation.trim());
    }

    if (required && !trimmedValue) {
        messages.push(requiredMessage || "This field is required.");
    }

    if (trimmedValue && typeof minLength === "number" && minLength > 0 && normalizedValue.length < minLength) {
        messages.push(minLengthMessage || "Please enter more characters.");
    }

    if (trimmedValue && typeof maxLength === "number" && maxLength > 0 && normalizedValue.length > maxLength) {
        messages.push(maxLengthMessage || "Please shorten this value.");
    }

    if (trimmedValue && patternConfig) {
        try {
            const expression = new RegExp(patternConfig.source, patternConfig.flags);

            if (!expression.test(normalizedValue)) {
                messages.push(patternMessage || "The value format is invalid.");
            }
        } catch (error) {
            messages.push("The validation pattern is invalid.");
        }
    }

    return Array.from(new Set(messages));
}

export function EdtsInput({
    valueAttribute,
    label,
    placeholder,
    helperText,
    inputType,
    required,
    minLength,
    maxLength,
    pattern,
    requiredMessage,
    minLengthMessage,
    maxLengthMessage,
    patternMessage,
    validateOnChange,
    onChangeAction,
    onBlurAction
}) {
    const [localValue, setLocalValue] = useState(getValue(valueAttribute));
    const [touched, setTouched] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputId = useId();
    const messageId = useId();
    const isPasswordField = inputType === "password";
    const resolvedInputType = isPasswordField && showPassword ? "text" : inputType || "text";
    const patternConfig = useMemo(() => parsePatternConfig(pattern), [pattern]);

    useEffect(() => {
        setLocalValue(getValue(valueAttribute));
    }, [valueAttribute]);

    const validationMessages = useMemo(() => {
        return getValidationMessages({
            value: localValue,
            required,
            minLength,
            maxLength,
            pattern,
            requiredMessage,
            minLengthMessage,
            maxLengthMessage,
            patternMessage,
            mendixValidation: valueAttribute && valueAttribute.validation
        });
    }, [
        localValue,
        required,
        minLength,
        maxLength,
        pattern,
        requiredMessage,
        minLengthMessage,
        maxLengthMessage,
        patternMessage,
        valueAttribute
    ]);

    const showValidation = touched || (validateOnChange && dirty);
    const isInvalid = showValidation && validationMessages.length > 0;

    function handleChange(event) {
        const nextValue = event.target.value;

        setLocalValue(nextValue);
        setDirty(true);

        if (valueAttribute && typeof valueAttribute.setValue === "function" && !valueAttribute.readOnly) {
            valueAttribute.setValue(nextValue);
        }

        executeAction(onChangeAction);
    }

    function handleBlur() {
        setTouched(true);
        executeAction(onBlurAction);
    }

    function handleInvalid(event) {
        event.preventDefault();
        setTouched(true);
        setDirty(true);
    }

    return (
        <div className={classNames("edts-input", { "edts-input--invalid": isInvalid, "edts-input--readonly": valueAttribute?.readOnly })}>
            {label ? (
                <label className="edts-input__label" htmlFor={inputId}>
                    {label}
                </label>
            ) : null}
            <div className={classNames("edts-input__control", { "edts-input__control--password": isPasswordField })}>
                <input
                    id={inputId}
                    className={classNames("edts-input__field", "form-control", { "is-invalid": isInvalid })}
                    type={resolvedInputType}
                    value={localValue}
                    placeholder={placeholder || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInvalid={handleInvalid}
                    readOnly={Boolean(valueAttribute?.readOnly)}
                    required={Boolean(required)}
                    minLength={typeof minLength === "number" && minLength > 0 ? minLength : undefined}
                    maxLength={typeof maxLength === "number" && maxLength > 0 ? maxLength : undefined}
                    pattern={patternConfig?.source || undefined}
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? messageId : undefined}
                />
                {isPasswordField ? (
                    <button
                        type="button"
                        className="edts-input__toggle"
                        onClick={() => setShowPassword(current => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                    >
                        {showPassword ? (
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="edts-input__toggle-icon">
                                <path
                                    d="M3 4.5L19.5 21"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                                <path
                                    d="M10.7 6.7A9.9 9.9 0 0 1 12 6.6c5.2 0 9.2 4.4 10 5.4-.4.5-1.6 1.9-3.5 3.2"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                                <path
                                    d="M8.4 8.1C5.4 9.3 3.5 11.6 2 13c.8 1 4.8 5.4 10 5.4 1.5 0 2.8-.3 4-.8"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                                <path
                                    d="M9.9 10a3 3 0 0 0 4.1 4.1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="edts-input__toggle-icon">
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
                        )}
                    </button>
                ) : null}
            </div>
            {isInvalid ? (
                <div className="edts-input__messages" id={messageId}>
                    {validationMessages.map((message, index) => (
                        <div key={index} className={classNames("edts-input__message", "invalid-feedback")}>
                            {message}
                        </div>
                    ))}
                </div>
            ) : helperText ? (
                <div className={classNames("edts-input__helper", "form-text", "text-muted")}>{helperText}</div>
            ) : null}
        </div>
    );
}
