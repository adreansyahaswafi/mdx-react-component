import { createElement } from "react";
import classNames from "classnames";

import "./ui/EdtsCheckBox.css";

export function preview({ selectionMode, label, booleanCaption, booleanDescription, helperText, layout, appearance }) {
    const isArrayMode = selectionMode === "array";
    const previewOptions = isArrayMode
        ? [
              { label: "Administrator", description: "Full access role", checked: true },
              { label: "Employee", description: "Standard internal access", checked: false },
              { label: "Anonymous", description: "Guest access only", checked: true }
          ]
        : [
              {
                  label: booleanCaption || "I agree with the terms",
                  description:
                      (booleanDescription && typeof booleanDescription === "object" && "value" in booleanDescription
                          ? booleanDescription.value
                          : booleanDescription) || "Optional helper text for the single checkbox.",
                  checked: true
              }
          ];

    return (
        <div
            className={classNames("edts-check-box", {
                "edts-check-box--simple": appearance === "simple"
            })}
        >
            {label ? <label className="edts-check-box__label">{label}</label> : null}
            <div
                className={classNames("edts-check-box__group", {
                    "edts-check-box__group--horizontal": layout === "horizontal" && isArrayMode
                })}
            >
                {previewOptions.map((option, index) => (
                    <label
                        key={`${option.label}-${index}`}
                        className={classNames("edts-check-box__option", {
                            "edts-check-box__option--checked": option.checked,
                            "edts-check-box__option--simple": appearance === "simple"
                        })}
                    >
                        <span className="edts-check-box__control">
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
                ))}
            </div>
            {helperText ? <div className="edts-check-box__helper">{helperText}</div> : null}
        </div>
    );
}
