import { createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsRadioButton.css";

export function preview({ label, helperText, layout, appearance, optionMode, options, trueLabel, falseLabel, trueDescription, falseDescription }) {
    const resolvedOptions =
        optionMode === "boolean"
            ? [
                  { label: trueLabel || "Yes", value: "true", description: trueDescription || "" },
                  { label: falseLabel || "No", value: "false", description: falseDescription || "" }
              ]
            : Array.isArray(options) && options.length
              ? options
              : [
                    { label: "Meeting room", value: "room", description: "Book a room for a scheduled session." },
                    { label: "Online call", value: "online", description: "Use this for a remote meeting." }
                ];

    return (
        <div className={classNames("edts-radio-button", { "edts-radio-button--simple": appearance === "simple" })}>
            {label ? <label className="edts-radio-button__label">{label}</label> : null}
            <div
                className={classNames("edts-radio-button__group", {
                    "edts-radio-button__group--horizontal": layout === "horizontal"
                })}
            >
                {resolvedOptions.map((option, index) => (
                    <label
                        key={`${option.value || option.label || index}`}
                        className={classNames("edts-radio-button__option", {
                            "edts-radio-button__option--checked": index === 0,
                            "edts-radio-button__option--disabled": option.disabled,
                            "edts-radio-button__option--simple": appearance === "simple"
                        })}
                    >
                        <span className="edts-radio-button__control">
                            <span className="edts-radio-button__indicator" aria-hidden="true">
                                <span className="edts-radio-button__indicator-dot" />
                            </span>
                        </span>
                        <span className="edts-radio-button__content">
                            <span className="edts-radio-button__option-label">{option.label || "Option"}</span>
                            {option.description ? (
                                <span className="edts-radio-button__option-description">{option.description}</span>
                            ) : null}
                        </span>
                    </label>
                ))}
            </div>
            {helperText ? <div className="edts-radio-button__helper">{helperText}</div> : null}
        </div>
    );
}
