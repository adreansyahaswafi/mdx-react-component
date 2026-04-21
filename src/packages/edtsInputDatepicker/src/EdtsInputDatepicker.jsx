import { createElement, useEffect, useId, useMemo, useState } from "react";
import classNames from "classnames";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./ui/EdtsInputDatepicker.css";

function executeAction(action) {
    if (action && action.canExecute) {
        action.execute();
    }
}

function toDateValue(value) {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function getDateValue(attribute) {
    if (!attribute || attribute.value == null) {
        return null;
    }

    return toDateValue(attribute.value);
}

function getMinimumDate(minDateAttribute, disablePreviousDates) {
    const attributeDate = getDateValue(minDateAttribute);

    if (!disablePreviousDates) {
        return attributeDate || undefined;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!attributeDate) {
        return today;
    }

    return attributeDate > today ? attributeDate : today;
}

function getValidationMessages({ value, required, requiredMessage, mendixValidation }) {
    const messages = [];

    if (typeof mendixValidation === "string" && mendixValidation.trim()) {
        messages.push(mendixValidation.trim());
    }

    if (required && !value) {
        messages.push(requiredMessage || "This field is required.");
    }

    return Array.from(new Set(messages));
}

function CalendarIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="edts-input-datepicker__icon-svg">
            <path
                d="M7 2.75V5.25M17 2.75V5.25M3.75 8.5H20.25M6.75 4.25H17.25C18.9069 4.25 20.25 5.59315 20.25 7.25V18.25C20.25 19.9069 18.9069 21.25 17.25 21.25H6.75C5.09315 21.25 3.75 19.9069 3.75 18.25V7.25C3.75 5.59315 5.09315 4.25 6.75 4.25Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 11.25H8.01M12 11.25H12.01M16 11.25H16.01M8 15.25H8.01M12 15.25H12.01M16 15.25H16.01"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ClearIcon() {
    return (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="edts-input-datepicker__icon-svg">
            <path
                d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function EdtsInputDatepicker({
    valueAttribute,
    minDateAttribute,
    maxDateAttribute,
    label,
    placeholder,
    helperText,
    selectionMode,
    dateFormatPattern,
    showCalendarIcon,
    showMonthDropdown,
    showYearDropdown,
    allowClear,
    disabled,
    required,
    requiredMessage,
    validateOnChange,
    disablePreviousDates,
    onChangeAction,
    onBlurAction
}) {
    const [touched, setTouched] = useState(false);
    const [dirty, setDirty] = useState(false);
    const inputId = useId();
    const messageId = useId();
    const pickerValue = getDateValue(valueAttribute);
    const isDateTime = selectionMode === "datetime";
    const minDate = useMemo(
        () => getMinimumDate(minDateAttribute, disablePreviousDates),
        [minDateAttribute, disablePreviousDates]
    );
    const maxDate = useMemo(() => getDateValue(maxDateAttribute) || undefined, [maxDateAttribute]);
    const validationMessages = useMemo(
        () =>
            getValidationMessages({
                value: pickerValue,
                required,
                requiredMessage,
                mendixValidation: valueAttribute?.validation
            }),
        [pickerValue, required, requiredMessage, valueAttribute]
    );
    const showValidation = touched || (validateOnChange && dirty);
    const isInvalid = showValidation && validationMessages.length > 0;
    const isReadOnly = Boolean(disabled || valueAttribute?.readOnly);

    useEffect(() => {
        if (!pickerValue) {
            setDirty(false);
        }
    }, [pickerValue]);

    function handleChange(nextValue) {
        setDirty(true);

        if (valueAttribute && typeof valueAttribute.setValue === "function" && !valueAttribute.readOnly) {
            valueAttribute.setValue(nextValue || undefined);
        }

        executeAction(onChangeAction);
    }

    function handleClear() {
        setTouched(true);
        handleChange(null);
    }

    function handleBlur() {
        setTouched(true);
        executeAction(onBlurAction);
    }

    return (
        <div
            className={classNames("edts-input-datepicker", {
                "edts-input-datepicker--invalid": isInvalid,
                "edts-input-datepicker--readonly": valueAttribute?.readOnly,
                "edts-input-datepicker--disabled": isReadOnly
            })}
        >
            {label ? (
                <label className="edts-input-datepicker__label" htmlFor={inputId}>
                    <span>{label}</span>
                    {required ? <span className="edts-input-datepicker__required">*</span> : null}
                </label>
            ) : null}
            <div className="edts-input-datepicker__control">
                <ReactDatePicker
                    id={inputId}
                    selected={pickerValue}
                    onChange={handleChange}
                    onCalendarClose={handleBlur}
                    placeholderText={placeholder || ""}
                    className={classNames("edts-input-datepicker__field", "form-control", { "is-invalid": isInvalid })}
                    dateFormat={dateFormatPattern || (isDateTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy")}
                    showTimeSelect={isDateTime}
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    minDate={minDate}
                    maxDate={maxDate}
                    showMonthDropdown={showMonthDropdown}
                    showYearDropdown={showYearDropdown}
                    dropdownMode="select"
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? messageId : undefined}
                    popperClassName="edts-input-datepicker__popper"
                    showPopperArrow={false}
                    autoComplete="off"
                />
                <div className="edts-input-datepicker__icons" aria-hidden="true">
                    {allowClear && pickerValue && !isReadOnly ? (
                        <button
                            type="button"
                            className="edts-input-datepicker__icon-button edts-input-datepicker__icon-button--clear"
                            onClick={handleClear}
                            aria-label="Clear date"
                        >
                            <ClearIcon />
                        </button>
                    ) : null}
                    {showCalendarIcon ? (
                        <span className="edts-input-datepicker__icon-button edts-input-datepicker__icon-button--calendar">
                            <CalendarIcon />
                        </span>
                    ) : null}
                </div>
            </div>
            {isInvalid ? (
                <div id={messageId} className="edts-input-datepicker__messages">
                    {validationMessages.map(message => (
                        <div key={message} className="edts-input-datepicker__message invalid-feedback">
                            {message}
                        </div>
                    ))}
                </div>
            ) : helperText ? (
                <div className="edts-input-datepicker__helper">{helperText}</div>
            ) : null}
        </div>
    );
}
