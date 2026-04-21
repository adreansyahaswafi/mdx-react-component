import React, { createElement, forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./ui/Datepicker.css";

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "10:00";

function getStartOfToday() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function clearDateValue(attribute) {
    if (attribute && typeof attribute.setValue === "function" && !attribute.readOnly) {
        attribute.setValue(undefined);
    }
}

function CalendarIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="edts-datepicker__icon-svg">
            <path
                d="M7 2.75V5.25M17 2.75V5.25M3.75 8.5H20.25M6.75 4.25H17.25C18.9069 4.25 20.25 5.59315 20.25 7.25V18.25C20.25 19.9069 18.9069 21.25 17.25 21.25H6.75C5.09315 21.25 3.75 19.9069 3.75 18.25V7.25C3.75 5.59315 5.09315 4.25 6.75 4.25Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 11.25H8.01M12 11.25H12.01M16 11.25H16.01M8 15.25H8.01M12 15.25H12.01M16 15.25H16.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ChevronLeftIcon() {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="edts-datepicker__nav-icon">
            <path
                d="M11.5 5.5L7 10L11.5 14.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="edts-datepicker__nav-icon">
            <path
                d="M8.5 5.5L13 10L8.5 14.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
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

function toDateValue(value) {
    if (!value) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toDayStart(date) {
    if (!date) {
        return null;
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getTimeValue(date) {
    if (!date) {
        return "";
    }

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function compareTimeValues(left, right) {
    if (!left || !right) {
        return 0;
    }

    const [leftHour, leftMinute] = left.split(":").map(Number);
    const [rightHour, rightMinute] = right.split(":").map(Number);

    return leftHour * 60 + leftMinute - (rightHour * 60 + rightMinute);
}

function buildTimeOptions() {
    const allowedMinutes = [0, 10, 15, 20, 30, 35, 40, 45, 50, 55];
    const result = [];

    for (let hour = 0; hour < 24; hour += 1) {
        allowedMinutes.forEach(minute => {
            result.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
        });
    }

    return result;
}

function getNextTimeValue(timeOptions, timeValue) {
    const index = timeOptions.indexOf(timeValue);

    if (index === -1 || index === timeOptions.length - 1) {
        return timeValue;
    }

    return timeOptions[index + 1];
}

function ensureTimeValue(timeValue, fallback) {
    return timeValue || fallback;
}

function applyTimeValue(date, timeValue) {
    if (!date) {
        return undefined;
    }

    const [hour, minute] = ensureTimeValue(timeValue, DEFAULT_START_TIME).split(":").map(Number);
    const nextDate = new Date(date);
    nextDate.setHours(hour, minute, 0, 0);
    return nextDate;
}

function formatDateLabel(date) {
    if (!date) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatDateValue(date) {
    if (!date) {
        return "";
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function splitRangeValue(value) {
    if (!value) {
        return ["", ""];
    }

    const parts = value.split(" - ");
    return [parts[0] || "", parts[1] || ""];
}

function renderCustomHeader({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) {
    const label = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    return (
        <div className="edts-datepicker__calendar-header">
            <button
                type="button"
                className="edts-datepicker__nav-button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
            >
                <ChevronLeftIcon />
            </button>
            <div className="edts-datepicker__calendar-header-copy">
                <div className="edts-datepicker__calendar-kicker">Pick your date</div>
                <div className="edts-datepicker__calendar-title">{label}</div>
            </div>
            <button
                type="button"
                className="edts-datepicker__nav-button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
}

const SingleDateInput = forwardRef(function SingleDateInput(
    { value, onClick, placeholder, disabled, showCalendarIcon, onOpenRequest },
    ref
) {
    return (
        <button
            type="button"
            className={classNames("edts-datepicker__date-trigger", {
                "edts-datepicker__date-trigger--disabled": disabled
            })}
            onClick={
                disabled
                    ? undefined
                    : event => {
                          if (typeof onOpenRequest === "function") {
                              onOpenRequest();
                          }

                          if (typeof onClick === "function") {
                              onClick(event);
                          }
                      }
            }
            ref={ref}
            disabled={disabled}
        >
            {showCalendarIcon ? (
                <span className="edts-datepicker__trigger-icon" aria-hidden="true">
                    <CalendarIcon />
                </span>
            ) : null}
            <span className="edts-datepicker__trigger-copy">
                <span className="edts-datepicker__trigger-label">Selected date</span>
                <span className={classNames("edts-datepicker__trigger-value", { "is-placeholder": !value })}>
                    {value || placeholder || "Choose a date"}
                </span>
            </span>
        </button>
    );
});

const RangeDateInput = forwardRef(function RangeDateInput(
    { value, onClick, disabled, showCalendarIcon, startPlaceholder, endPlaceholder, hideEndDisplay, onOpenRequest },
    ref
) {
    const [startText, endText] = splitRangeValue(value);

    return (
        <button
            type="button"
            className={classNames(
                "edts-datepicker__date-trigger",
                "edts-datepicker__date-trigger--range",
                {
                    "edts-datepicker__date-trigger--disabled": disabled,
                    "edts-datepicker__date-trigger--range-hidden-end": hideEndDisplay
                }
            )}
            onClick={
                disabled
                    ? undefined
                    : event => {
                          if (typeof onOpenRequest === "function") {
                              onOpenRequest();
                          }

                          if (typeof onClick === "function") {
                              onClick(event);
                          }
                      }
            }
            ref={ref}
            disabled={disabled}
        >
            <span className="edts-datepicker__range-segment">
                {showCalendarIcon ? (
                    <span className="edts-datepicker__trigger-icon" aria-hidden="true">
                        <CalendarIcon />
                    </span>
                ) : null}
                <span className="edts-datepicker__range-field">
                    <span className="edts-datepicker__trigger-label">Start date</span>
                    <span className={classNames("edts-datepicker__trigger-value", { "is-placeholder": !startText })}>
                        {startText || startPlaceholder || "Choose start"}
                    </span>
                </span>
            </span>
            {hideEndDisplay ? null : (
                <>
                    <span className="edts-datepicker__range-divider" aria-hidden="true">
                        →
                    </span>
                    <span className="edts-datepicker__range-segment">
                        {showCalendarIcon ? (
                            <span className="edts-datepicker__trigger-icon" aria-hidden="true">
                                <CalendarIcon />
                            </span>
                        ) : null}
                        <span className="edts-datepicker__range-field">
                            <span className="edts-datepicker__trigger-label">End date</span>
                            <span className={classNames("edts-datepicker__trigger-value", { "is-placeholder": !endText })}>
                                {endText || endPlaceholder || "Choose end"}
                            </span>
                        </span>
                    </span>
                </>
            )}
        </button>
    );
});

export function Datepicker({
    dateAttribute,
    endDateAttribute,
    minDateAttribute,
    maxDateAttribute,
    pickerMode,
    labelCaption,
    placeholderText,
    endPlaceholderText,
    helperText,
    dateFormatPattern,
    rangeDisplayMode,
    showCalendarIcon,
    allowClear,
    dateReadOnly,
    disabled,
    onChangeAction,
    class: className,
    style
}) {
    const startValue = dateAttribute ? toDateValue(dateAttribute.value) : null;
    const endValue = endDateAttribute ? toDateValue(endDateAttribute.value) : null;
    const defaultMinDate = useMemo(getStartOfToday, []);
    const minDate = minDateAttribute ? toDateValue(minDateAttribute.value) : defaultMinDate;
    const maxDate = maxDateAttribute ? toDateValue(maxDateAttribute.value) : null;
    const timeOptions = useMemo(buildTimeOptions, []);
    const isRangeMode = pickerMode === "range";
    const hideEndDateDisplay = isRangeMode && rangeDisplayMode !== "full";
    const hasEndAttribute = Boolean(endDateAttribute && typeof endDateAttribute.setValue === "function");
    const readOnly =
        Boolean(disabled) ||
        !dateAttribute ||
        dateAttribute.readOnly ||
        !hasEndAttribute ||
        Boolean(endDateAttribute && endDateAttribute.readOnly);
    const helperTextValue = getDynamicText(helperText);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const startTimeValue = ensureTimeValue(getTimeValue(startValue), DEFAULT_START_TIME);
    const derivedDefaultEnd = getNextTimeValue(timeOptions, startTimeValue) || DEFAULT_END_TIME;
    const endTimeValue = ensureTimeValue(getTimeValue(endValue), derivedDefaultEnd);
    const startDay = toDayStart(startValue);
    const endDay = toDayStart(endValue);
    const sameDaySelection = Boolean(startDay && endDay && startDay.getTime() === endDay.getTime());
    const needsEndDateSelection = isRangeMode && Boolean(startDay && !endDay);
    const endTimeOptions = useMemo(() => {
        if ((sameDaySelection && startDay && endDay) || (!isRangeMode && startDay)) {
            return timeOptions.filter(option => compareTimeValues(option, startTimeValue) >= 0);
        }

        return timeOptions;
    }, [endDay, isRangeMode, sameDaySelection, startDay, startTimeValue, timeOptions]);
    const configError = !hasEndAttribute ? "Please bind End Date Attribute so the widget can store the end time." : "";
    const rangeError =
        startValue && endValue && endValue.getTime() < startValue.getTime() ? "End time must be after start time." : "";
    const supportText =
        rangeError ||
        configError ||
        (needsEndDateSelection ? "Choose an end date to finish the range and enable the end time." : helperTextValue);
    const dateFormat = dateFormatPattern || "dd MMM yyyy";
    const dateSelectionLocked = !readOnly && Boolean(dateReadOnly);
    const dateTriggerDisabled = readOnly || dateSelectionLocked;

    useEffect(() => {
        if (dateTriggerDisabled && isCalendarOpen) {
            setIsCalendarOpen(false);
        }
    }, [dateTriggerDisabled, isCalendarOpen]);

    const triggerOnChangeAction = useCallback(() => {
        if (onChangeAction && onChangeAction.canExecute) {
            onChangeAction.execute();
        }
    }, [onChangeAction]);

    const writeValues = useCallback(
        (nextStart, nextEnd) => {
            if (!dateAttribute || typeof dateAttribute.setValue !== "function" || dateAttribute.readOnly) {
                return;
            }

            dateAttribute.setValue(nextStart);

            if (endDateAttribute && typeof endDateAttribute.setValue === "function" && !endDateAttribute.readOnly) {
                endDateAttribute.setValue(nextEnd);
            }

            triggerOnChangeAction();
        },
        [dateAttribute, endDateAttribute, triggerOnChangeAction]
    );

    const handleCalendarChange = useCallback(
        nextValue => {
            if (
                !dateAttribute ||
                typeof dateAttribute.setValue !== "function" ||
                dateAttribute.readOnly ||
                !hasEndAttribute
            ) {
                return;
            }

            if (isRangeMode) {
                const [nextStartDate, nextEndDate] = Array.isArray(nextValue) ? nextValue : [nextValue, null];
                const nextStartDay = toDayStart(nextStartDate);
                const nextEndDay = toDayStart(nextEndDate);
                const nextStart = nextStartDay ? applyTimeValue(nextStartDay, startTimeValue) : undefined;
                let nextEnd = nextEndDay ? applyTimeValue(nextEndDay, endTimeValue) : undefined;

                if (nextStart && nextEnd && nextEnd.getTime() < nextStart.getTime()) {
                    nextEnd = applyTimeValue(nextEndDay, startTimeValue);
                }

                writeValues(nextStart, nextEnd);
                if (nextEndDate) {
                    setIsCalendarOpen(false);
                }
                return;
            }

            const selectedDay = toDayStart(Array.isArray(nextValue) ? nextValue[0] : nextValue);
            if (!selectedDay) {
                writeValues(undefined, undefined);
                return;
            }

            const nextStart = applyTimeValue(selectedDay, startTimeValue);
            const normalizedEndTime =
                compareTimeValues(endTimeValue, startTimeValue) < 0 ? derivedDefaultEnd : endTimeValue;
            const nextEnd = applyTimeValue(selectedDay, normalizedEndTime);
            writeValues(nextStart, nextEnd);
            setIsCalendarOpen(false);
        },
        [dateAttribute, derivedDefaultEnd, endTimeValue, hasEndAttribute, isRangeMode, startTimeValue, writeValues]
    );

    const handleStartTimeChange = useCallback(
        event => {
            if (
                !hasEndAttribute ||
                !dateAttribute ||
                typeof dateAttribute.setValue !== "function" ||
                dateAttribute.readOnly
            ) {
                return;
            }

            const nextTime = event.target.value;
            const baseStartDay = startDay || getStartOfToday();
            const nextStart = applyTimeValue(baseStartDay, nextTime);
            let nextEnd;

            if (isRangeMode) {
                const targetEndDay = endDay || baseStartDay;
                const nextEndTime =
                    targetEndDay.getTime() === baseStartDay.getTime() && compareTimeValues(endTimeValue, nextTime) < 0
                        ? nextTime
                        : endTimeValue;
                nextEnd = applyTimeValue(targetEndDay, nextEndTime || nextTime);
            } else {
                const nextSingleEndTime =
                    compareTimeValues(endTimeValue, nextTime) < 0
                        ? getNextTimeValue(timeOptions, nextTime)
                        : endTimeValue;
                nextEnd = applyTimeValue(baseStartDay, nextSingleEndTime || nextTime);
            }

            writeValues(nextStart, nextEnd);
        },
        [dateAttribute, endDay, endTimeValue, hasEndAttribute, isRangeMode, startDay, timeOptions, writeValues]
    );

    const handleEndTimeChange = useCallback(
        event => {
            if (
                !hasEndAttribute ||
                !endDateAttribute ||
                typeof endDateAttribute.setValue !== "function" ||
                endDateAttribute.readOnly
            ) {
                return;
            }

            const nextTime = event.target.value;
            const baseStartDay = startDay || getStartOfToday();
            const baseEndDay = endDay || baseStartDay;
            const nextStart = startValue || applyTimeValue(baseStartDay, startTimeValue);
            const nextEnd = applyTimeValue(baseEndDay, nextTime);

            if (nextStart && nextEnd && nextEnd.getTime() < nextStart.getTime()) {
                return;
            }

            writeValues(nextStart, nextEnd);
        },
        [endDateAttribute, endDay, hasEndAttribute, startDay, startTimeValue, startValue, writeValues]
    );

    const handleClear = useCallback(() => {
        clearDateValue(dateAttribute);
        clearDateValue(endDateAttribute);
        setIsCalendarOpen(false);
        triggerOnChangeAction();
    }, [dateAttribute, endDateAttribute, triggerOnChangeAction]);

    return (
        <div
            className={classNames("edts-datepicker", className, {
                "edts-datepicker--range-mode": isRangeMode,
                "edts-datepicker--disabled": readOnly,
                "edts-datepicker--invalid": Boolean(rangeError || configError)
            })}
            style={style}
        >
            {labelCaption ? <label className="edts-datepicker__label">{labelCaption}</label> : null}

            <div className="edts-datepicker__header">
                <div className="edts-datepicker__mode-badge">{isRangeMode ? "Date range" : "Single date"}</div>
                <div className="edts-datepicker__summary">
                    {isRangeMode ? (
                        hideEndDateDisplay ? (
                            <span>{startDay ? formatDateLabel(startDay) : "Choose start"}</span>
                        ) : (
                            <>
                                <span>{startDay ? formatDateLabel(startDay) : "Choose start"}</span>
                                <span className="edts-datepicker__summary-arrow">→</span>
                                <span>{endDay ? formatDateLabel(endDay) : "Choose end"}</span>
                            </>
                        )
                    ) : (
                        <span>{startDay ? formatDateLabel(startDay) : "Choose a date first"}</span>
                    )}
                </div>
            </div>

            {isRangeMode ? (
                <ReactDatePicker
                    selected={startValue}
                    startDate={startValue}
                    endDate={endValue}
                    selectsRange
                    onChange={handleCalendarChange}
                    disabled={readOnly}
                    dateFormat={dateFormat}
                    minDate={minDate}
                    maxDate={maxDate}
                    monthsShown={1}
                    shouldCloseOnSelect={false}
                    open={dateTriggerDisabled ? false : isCalendarOpen}
                    readOnly={dateTriggerDisabled}
                    preventOpenOnFocus
                    disabledKeyboardNavigation
                    onInputClick={() => {
                        if (!dateTriggerDisabled) {
                            setIsCalendarOpen(true);
                        }
                    }}
                    onClickOutside={() => setIsCalendarOpen(false)}
                    onCalendarClose={() => setIsCalendarOpen(false)}
                    calendarClassName="edts-datepicker__calendar"
                    popperClassName="edts-datepicker__popper"
                    popperPlacement="bottom-start"
                    renderCustomHeader={renderCustomHeader}
                    customInput={
                        <RangeDateInput
                            showCalendarIcon={showCalendarIcon}
                            startPlaceholder={placeholderText}
                            endPlaceholder={endPlaceholderText}
                            disabled={dateTriggerDisabled}
                            hideEndDisplay={hideEndDateDisplay}
                            onOpenRequest={() => setIsCalendarOpen(true)}
                        />
                    }
                />
            ) : (
                <ReactDatePicker
                    selected={startValue}
                    onChange={handleCalendarChange}
                    disabled={readOnly}
                    dateFormat={dateFormat}
                    minDate={minDate}
                    maxDate={maxDate}
                    monthsShown={1}
                    shouldCloseOnSelect
                    open={dateTriggerDisabled ? false : isCalendarOpen}
                    readOnly={dateTriggerDisabled}
                    preventOpenOnFocus
                    disabledKeyboardNavigation
                    onInputClick={() => {
                        if (!dateTriggerDisabled) {
                            setIsCalendarOpen(true);
                        }
                    }}
                    onClickOutside={() => setIsCalendarOpen(false)}
                    onCalendarClose={() => setIsCalendarOpen(false)}
                    calendarClassName="edts-datepicker__calendar"
                    popperClassName="edts-datepicker__popper"
                    popperPlacement="bottom-start"
                    renderCustomHeader={renderCustomHeader}
                    customInput={
                        <SingleDateInput
                            placeholder={placeholderText}
                            disabled={dateTriggerDisabled}
                            showCalendarIcon={showCalendarIcon}
                            onOpenRequest={() => setIsCalendarOpen(true)}
                        />
                    }
                />
            )}

            <div
                className={classNames("edts-datepicker__time-panel", {
                    "is-invalid": Boolean(rangeError || configError)
                })}
            >
                <div className="edts-datepicker__time-group">
                    <div className="edts-datepicker__field-meta">
                        <span className="edts-datepicker__field-label">Start time</span>
                        <span className="edts-datepicker__field-date">
                            {startDay ? formatDateValue(startDay) : "Waiting for date"}
                        </span>
                    </div>
                    <select
                        className="edts-datepicker__time-select"
                        value={startTimeValue}
                        onChange={handleStartTimeChange}
                        disabled={readOnly || !startDay}
                    >
                        {timeOptions.map(option => (
                            <option key={`start-${option}`} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="edts-datepicker__time-connector" aria-hidden="true">
                    -
                </div>

                <div className="edts-datepicker__time-group">
                    <div className="edts-datepicker__field-meta">
                        <span className="edts-datepicker__field-label">End time</span>
                        <span className="edts-datepicker__field-date">
                            {isRangeMode
                                ? endDay
                                    ? formatDateValue(endDay)
                                    : "Waiting for end date"
                                : startDay
                                  ? formatDateValue(startDay)
                                  : "Waiting for date"}
                        </span>
                    </div>
                    <select
                        className="edts-datepicker__time-select"
                        value={endTimeValue}
                        onChange={handleEndTimeChange}
                        disabled={readOnly || (!endDay && isRangeMode) || (!startDay && !isRangeMode)}
                    >
                        {endTimeOptions.map(option => (
                            <option key={`end-${option}`} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {supportText ? (
                <div
                    className={classNames("edts-datepicker__helper", {
                        "edts-datepicker__helper--error": Boolean(rangeError || configError)
                    })}
                >
                    {supportText}
                </div>
            ) : null}

            {allowClear && (startValue || endValue) ? (
                <button
                    type="button"
                    className="edts-datepicker__clear-button"
                    onClick={handleClear}
                    disabled={readOnly}
                >
                    Clear selection
                </button>
            ) : null}
        </div>
    );
}
