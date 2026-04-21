import { createElement } from "react";

import "./ui/Datepicker.css";

export function preview({
    labelCaption,
    helperText,
    pickerMode,
    rangeDisplayMode,
    endPlaceholderText,
    showCalendarIcon,
    dateReadOnly,
    disabled
}) {
    const isRangeMode = pickerMode === "range";
    const hideEndDateDisplay = isRangeMode && rangeDisplayMode !== "full";
    const dateLocked = disabled || dateReadOnly;

    return (
        <div className="edts-datepicker">
            {labelCaption ? <label className="edts-datepicker__label">{labelCaption}</label> : null}

            <div className="edts-datepicker__header">
                <div className="edts-datepicker__mode-badge">{isRangeMode ? "Date range" : "Single date"}</div>
                <div className="edts-datepicker__summary">
                    {isRangeMode ? (
                        hideEndDateDisplay ? (
                            <span>Thu, 09 Apr 2026</span>
                        ) : (
                            <>
                                <span>Thu, 09 Apr 2026</span>
                                <span className="edts-datepicker__summary-arrow">→</span>
                                <span>Fri, 10 Apr 2026</span>
                            </>
                        )
                    ) : (
                        <span>Thu, 09 Apr 2026</span>
                    )}
                </div>
            </div>

            {isRangeMode ? (
                <div
                    className={`edts-datepicker__date-trigger edts-datepicker__date-trigger--range${
                        hideEndDateDisplay ? " edts-datepicker__date-trigger--range-hidden-end" : ""
                    }`}
                    style={dateLocked ? { opacity: 0.6 } : undefined}
                >
                    {showCalendarIcon ? <span className="edts-datepicker__trigger-icon">ico</span> : null}
                    <span className="edts-datepicker__range-field">
                        <span className="edts-datepicker__trigger-label">Start date</span>
                        <span className="edts-datepicker__trigger-value">09 Apr 2026</span>
                    </span>
                    {hideEndDateDisplay ? null : (
                        <>
                            <span className="edts-datepicker__range-divider">→</span>
                            <span className="edts-datepicker__range-field">
                                <span className="edts-datepicker__trigger-label">End date</span>
                                <span className="edts-datepicker__trigger-value">{endPlaceholderText || "10 Apr 2026"}</span>
                            </span>
                        </>
                    )}
                </div>
            ) : (
                <div className="edts-datepicker__date-trigger" style={dateLocked ? { opacity: 0.6 } : undefined}>
                    {showCalendarIcon ? <span className="edts-datepicker__trigger-icon">ico</span> : null}
                    <span className="edts-datepicker__trigger-copy">
                        <span className="edts-datepicker__trigger-label">Selected date</span>
                        <span className="edts-datepicker__trigger-value">09 Apr 2026</span>
                    </span>
                </div>
            )}

            <div className="edts-datepicker__time-panel">
                <div className="edts-datepicker__time-group">
                    <div className="edts-datepicker__field-meta">
                        <span className="edts-datepicker__field-label">Start time</span>
                        <span className="edts-datepicker__field-date">
                            {isRangeMode ? "09 Apr 2026" : "09 Apr 2026"}
                        </span>
                    </div>
                    <div className="edts-datepicker__preview-select">13:00</div>
                </div>
                <div className="edts-datepicker__time-connector">-</div>
                <div className="edts-datepicker__time-group">
                    <div className="edts-datepicker__field-meta">
                        <span className="edts-datepicker__field-label">End time</span>
                        <span className="edts-datepicker__field-date">
                            {isRangeMode ? "10 Apr 2026" : "09 Apr 2026"}
                        </span>
                    </div>
                    <div className="edts-datepicker__preview-select">14:00</div>
                </div>
            </div>

            {helperText ? <div className="edts-datepicker__helper">{helperText}</div> : null}
        </div>
    );
}
