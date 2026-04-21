import { createElement, useEffect, useId, useMemo, useState } from "react";
import classNames from "classnames";

import "./ui/EdtsRadioButton.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function getValue(attribute) {
    if (!attribute || attribute.value == null) {
        return "";
    }

    if (typeof attribute.value === "boolean") {
        return attribute.value ? "true" : "false";
    }

    return String(attribute.value);
}

function getDynamicText(textValue) {
    if (!textValue) {
        return "";
    }

    if (typeof textValue === "string") {
        return textValue;
    }

    if (typeof textValue === "object" && "value" in textValue) {
        return textValue.value || "";
    }

    return "";
}

function getValidationMessages({ value, required, requiredMessage, mendixValidation }) {
    const messages = [];

    if (typeof mendixValidation === "string" && mendixValidation.trim()) {
        messages.push(mendixValidation.trim());
    }

    if (required && !String(value || "").trim()) {
        messages.push(requiredMessage || "Please choose one option.");
    }

    return Array.from(new Set(messages));
}

export function EdtsRadioButton({
    valueAttribute,
    optionMode,
    options,
    trueLabel,
    falseLabel,
    trueDescription,
    falseDescription,
    label,
    helperText,
    layout,
    appearance,
    required,
    requiredMessage,
    validateOnChange,
    onChangeAction
}) {
    const [localValue, setLocalValue] = useState(getValue(valueAttribute));
    const [touched, setTouched] = useState(false);
    const [dirty, setDirty] = useState(false);
    const groupName = useId();
    const messageId = useId();
    const isReadOnly = Boolean(valueAttribute?.readOnly);
    const isBooleanAttribute = typeof valueAttribute?.value === "boolean";
    const helperTextValue = getDynamicText(helperText);

    useEffect(() => {
        setLocalValue(getValue(valueAttribute));
    }, [valueAttribute]);

    const resolvedOptions = useMemo(
        () => {
            if (optionMode === "boolean" || isBooleanAttribute) {
                return [
                    {
                        label: trueLabel || "Yes",
                        value: "true",
                        description: trueDescription || "",
                        disabled: false
                    },
                    {
                        label: falseLabel || "No",
                        value: "false",
                        description: falseDescription || "",
                        disabled: false
                    }
                ];
            }

            return (Array.isArray(options) ? options : [])
                .filter(option => option && option.label && option.value)
                .map(option => ({
                    ...option,
                    label: String(option.label),
                    value: String(option.value)
                }));
        },
        [falseDescription, falseLabel, isBooleanAttribute, optionMode, options, trueDescription, trueLabel]
    );

    const validationMessages = useMemo(
        () =>
            getValidationMessages({
                value: localValue,
                required,
                requiredMessage,
                mendixValidation: valueAttribute && valueAttribute.validation
            }),
        [localValue, required, requiredMessage, valueAttribute]
    );

    const showValidation = touched || (validateOnChange && dirty);
    const isInvalid = showValidation && validationMessages.length > 0;

    function handleChange(nextValue) {
        setLocalValue(nextValue);
        setDirty(true);
        setTouched(true);

        if (valueAttribute && typeof valueAttribute.setValue === "function" && !valueAttribute.readOnly) {
            valueAttribute.setValue(isBooleanAttribute || optionMode === "boolean" ? nextValue === "true" : nextValue);
        }

        executeAction(onChangeAction);
    }

    return (
        <div
            className={classNames("edts-radio-button", {
                "edts-radio-button--invalid": isInvalid,
                "edts-radio-button--readonly": isReadOnly,
                "edts-radio-button--simple": appearance === "simple"
            })}
        >
            {label ? (
                <label className="edts-radio-button__label">
                    <span>{label}</span>
                    {required ? <span className="edts-radio-button__required">*</span> : null}
                </label>
            ) : null}

            <div
                className={classNames("edts-radio-button__group", {
                    "edts-radio-button__group--horizontal": layout === "horizontal"
                })}
                role="radiogroup"
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? messageId : undefined}
            >
                {resolvedOptions.map(option => {
                    const optionDisabled = isReadOnly || Boolean(option.disabled);
                    const checked = localValue === option.value;

                    return (
                        <label
                            key={`${option.value}-${option.label}`}
                            className={classNames("edts-radio-button__option", {
                                "edts-radio-button__option--checked": checked,
                                "edts-radio-button__option--disabled": optionDisabled,
                                "edts-radio-button__option--simple": appearance === "simple"
                            })}
                        >
                            <span className="edts-radio-button__control">
                                <input
                                    type="radio"
                                    name={groupName}
                                    className="edts-radio-button__input"
                                    value={option.value}
                                    checked={checked}
                                    disabled={optionDisabled}
                                    onChange={() => handleChange(option.value)}
                                    onBlur={() => setTouched(true)}
                                />
                                <span className="edts-radio-button__indicator" aria-hidden="true">
                                    <span className="edts-radio-button__indicator-dot" />
                                </span>
                            </span>
                            <span className="edts-radio-button__content">
                                <span className="edts-radio-button__option-label">{option.label}</span>
                                {option.description ? (
                                    <span className="edts-radio-button__option-description">{option.description}</span>
                                ) : null}
                            </span>
                        </label>
                    );
                })}
            </div>

            {isInvalid ? (
                <div className="edts-radio-button__messages" id={messageId}>
                    {validationMessages.map((message, index) => (
                        <div key={index} className="edts-radio-button__message">
                            {message}
                        </div>
                    ))}
                </div>
            ) : helperTextValue ? (
                <div className="edts-radio-button__helper">{helperTextValue}</div>
            ) : null}
        </div>
    );
}
