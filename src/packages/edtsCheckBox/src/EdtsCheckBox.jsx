import { createElement, useEffect, useId, useMemo, useState } from "react";
import classNames from "classnames";

import "./ui/EdtsCheckBox.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function getAttributeValue(attribute, item, fallback = "") {
    if (!attribute || typeof attribute.get !== "function" || !item) {
        return fallback;
    }

    const value = attribute.get(item);
    if (!value) {
        return fallback;
    }

    if (typeof value.displayValue === "string" && value.displayValue.trim()) {
        return value.displayValue;
    }

    if (value.value != null) {
        return String(value.value);
    }

    return fallback;
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

function normalizeAssociationSelection(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(item => {
            if (!item) {
                return "";
            }

            if (typeof item === "string") {
                return item;
            }

            if (typeof item.id !== "undefined" && item.id !== null) {
                return String(item.id);
            }

            if (typeof item.value !== "undefined" && item.value !== null) {
                return String(item.value);
            }

            return "";
        })
        .filter(Boolean);
}

function getValidationMessages({ selectionMode, booleanValue, selectedValues, required, requiredMessage, mendixValidation }) {
    const messages = [];

    if (typeof mendixValidation === "string" && mendixValidation.trim()) {
        messages.push(mendixValidation.trim());
    }

    if (required) {
        const hasValue = selectionMode === "boolean" ? Boolean(booleanValue) : selectedValues.length > 0;

        if (!hasValue) {
            messages.push(
                requiredMessage ||
                    (selectionMode === "boolean"
                        ? "Please check this box to continue."
                        : "Please choose at least one option.")
            );
        }
    }

    return Array.from(new Set(messages));
}

export function EdtsCheckBox({
    selectionMode,
    booleanAttribute,
    associationValue,
    optionsSource,
    optionLabelAttr,
    optionDescriptionAttr,
    label,
    booleanCaption,
    booleanDescription,
    helperText,
    layout,
    appearance,
    required,
    requiredMessage,
    validateOnChange,
    onChangeAction
}) {
    const [touched, setTouched] = useState(false);
    const [dirty, setDirty] = useState(false);
    const messageId = useId();
    const isArrayMode = selectionMode === "array";
    const isReadOnly = isArrayMode ? Boolean(associationValue?.readOnly) : Boolean(booleanAttribute?.readOnly);
    const groupName = useId();
    const helperTextValue = getDynamicText(helperText);
    const booleanDescriptionValue = getDynamicText(booleanDescription);

    const arrayOptions = useMemo(() => {
        if (!isArrayMode || !optionsSource || optionsSource.status !== "available" || !Array.isArray(optionsSource.items)) {
            return [];
        }

        return optionsSource.items.map(item => ({
            id: String(item.id),
            label: getAttributeValue(optionLabelAttr, item, String(item.id)),
            description: getAttributeValue(optionDescriptionAttr, item, ""),
            item
        }));
    }, [isArrayMode, optionDescriptionAttr, optionLabelAttr, optionsSource]);

    const selectedValues = useMemo(
        () => (isArrayMode ? normalizeAssociationSelection(associationValue?.value) : []),
        [associationValue, isArrayMode]
    );

    const [localBooleanValue, setLocalBooleanValue] = useState(Boolean(booleanAttribute?.value));

    useEffect(() => {
        setLocalBooleanValue(Boolean(booleanAttribute?.value));
    }, [booleanAttribute]);

    const validationMessages = useMemo(
        () =>
            getValidationMessages({
                selectionMode,
                booleanValue: localBooleanValue,
                selectedValues,
                required,
                requiredMessage,
                mendixValidation: isArrayMode ? associationValue?.validation : booleanAttribute?.validation
            }),
        [
            associationValue,
            booleanAttribute,
            isArrayMode,
            localBooleanValue,
            required,
            requiredMessage,
            selectedValues,
            selectionMode
        ]
    );

    const showValidation = touched || (validateOnChange && dirty);
    const isInvalid = showValidation && validationMessages.length > 0;

    function handleBooleanChange(event) {
        const nextValue = event.target.checked;

        setLocalBooleanValue(nextValue);
        setDirty(true);
        setTouched(true);

        if (booleanAttribute && typeof booleanAttribute.setValue === "function" && !booleanAttribute.readOnly) {
            booleanAttribute.setValue(nextValue);
        }

        executeAction(onChangeAction);
    }

    function handleArrayChange(option) {
        setDirty(true);
        setTouched(true);

        if (!associationValue || typeof associationValue.setValue !== "function" || associationValue.readOnly) {
            return;
        }

        const currentItems = Array.isArray(associationValue.value) ? associationValue.value : [];
        const nextItems = selectedValues.includes(option.id)
            ? currentItems.filter(item => String(item?.id || item?.value || item) !== option.id)
            : [...currentItems, option.item];

        associationValue.setValue(nextItems);
        executeAction(onChangeAction);
    }

    return (
        <div
            className={classNames("edts-check-box", {
                "edts-check-box--invalid": isInvalid,
                "edts-check-box--readonly": isReadOnly,
                "edts-check-box--simple": appearance === "simple"
            })}
        >
            {label ? (
                <label className="edts-check-box__label">
                    <span>{label}</span>
                    {required ? <span className="edts-check-box__required">*</span> : null}
                </label>
            ) : null}

            {isArrayMode ? (
                <div
                    className={classNames("edts-check-box__group", {
                        "edts-check-box__group--horizontal": layout === "horizontal"
                    })}
                    role="group"
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? messageId : undefined}
                >
                    {arrayOptions.map(option => {
                        const checked = selectedValues.includes(option.id);

                        return (
                            <label
                                key={option.id}
                                className={classNames("edts-check-box__option", {
                                    "edts-check-box__option--checked": checked,
                                    "edts-check-box__option--disabled": isReadOnly,
                                    "edts-check-box__option--simple": appearance === "simple",
                                    "edts-check-box__option--compact": !option.description
                                })}
                            >
                                <span className="edts-check-box__control">
                                    <input
                                        type="checkbox"
                                        name={groupName}
                                        className="edts-check-box__input"
                                        checked={checked}
                                        disabled={isReadOnly}
                                        onChange={() => handleArrayChange(option)}
                                        onBlur={() => setTouched(true)}
                                    />
                                    <span className="edts-check-box__indicator" aria-hidden="true">
                                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                                        </svg>
                                    </span>
                                </span>
                                <span className="edts-check-box__content">
                                    <span className="edts-check-box__option-label">{option.label}</span>
                                    {option.description ? (
                                        <span className="edts-check-box__option-description">{option.description}</span>
                                    ) : null}
                                </span>
                            </label>
                        );
                    })}
                </div>
            ) : (
                <label
                    className={classNames("edts-check-box__option", {
                        "edts-check-box__option--checked": localBooleanValue,
                        "edts-check-box__option--disabled": isReadOnly,
                        "edts-check-box__option--simple": appearance === "simple",
                        "edts-check-box__option--compact": !booleanDescriptionValue
                    })}
                >
                    <span className="edts-check-box__control">
                        <input
                            type="checkbox"
                            className="edts-check-box__input"
                            checked={localBooleanValue}
                            disabled={isReadOnly}
                            onChange={handleBooleanChange}
                            onBlur={() => setTouched(true)}
                        />
                        <span className="edts-check-box__indicator" aria-hidden="true">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                            </svg>
                        </span>
                    </span>
                    <span className="edts-check-box__content">
                        <span className="edts-check-box__option-label">{booleanCaption || "Checkbox option"}</span>
                        {booleanDescriptionValue ? (
                            <span className="edts-check-box__option-description">{booleanDescriptionValue}</span>
                        ) : null}
                    </span>
                </label>
            )}

            {isInvalid ? (
                <div className="edts-check-box__messages" id={messageId}>
                    {validationMessages.map((message, index) => (
                        <div key={index} className="edts-check-box__message">
                            {message}
                        </div>
                    ))}
                </div>
            ) : helperTextValue ? (
                <div className="edts-check-box__helper">{helperTextValue}</div>
            ) : null}
        </div>
    );
}
