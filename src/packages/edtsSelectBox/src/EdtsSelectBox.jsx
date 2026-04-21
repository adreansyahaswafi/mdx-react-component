import { createElement, useId, useMemo, useState } from "react";
import classNames from "classnames";
import Select, { components } from "react-select";

import "./ui/EdtsSelectBox.css";

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
  return value && value.value != null ? String(value.value) : fallback;
}

function getEditableValue(attribute) {
  if (!attribute || attribute.value == null) {
    return "";
  }

  return String(attribute.value);
}

function getDisplayValue(attribute) {
  if (!attribute) {
    return "";
  }

  if (typeof attribute.displayValue === "string" && attribute.displayValue) {
    return attribute.displayValue;
  }

  return getEditableValue(attribute);
}

function isEnabled(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value && typeof value === "object") {
    if (typeof value.value === "boolean") {
      return value.value;
    }

    if (typeof value.value === "string") {
      return value.value === "true";
    }

    if (typeof value.displayValue === "string") {
      return value.displayValue === "true";
    }
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return fallback;
}

function normalizeAssociationSelection(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
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

function normalizeSingleAssociationSelection(value) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return normalizeAssociationSelection(value)[0] || "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value.id !== "undefined" && value.id !== null) {
    return String(value.id);
  }

  if (typeof value.value !== "undefined" && value.value !== null) {
    if (typeof value.value === "string") {
      return value.value;
    }

    if (typeof value.value.id !== "undefined" && value.value.id !== null) {
      return String(value.value.id);
    }

    return String(value.value);
  }

  return "";
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function formatEnumCaption(value) {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getValidationMessages({
  required,
  value,
  requiredMessage,
  mendixValidation,
}) {
  const messages = [];

  if (typeof mendixValidation === "string" && mendixValidation.trim()) {
    messages.push(mendixValidation.trim());
  }

  if (required && !value) {
    messages.push(requiredMessage || "This field is required.");
  }

  return Array.from(new Set(messages));
}

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 12,
    overflow: "hidden",
    borderColor: state.selectProps["data-invalid"]
      ? "#dc3545"
      : state.isFocused
        ? "#86b7fe"
        : "#ced4da",
    boxShadow: state.selectProps["data-invalid"]
      ? "0 0 0 0.18rem rgba(220, 53, 69, 0.16)"
      : state.isFocused
        ? "0 0 0 0.2rem rgba(13, 110, 253, 0.2)"
        : "none",
    backgroundColor: state.isDisabled ? "#f8f9fa" : "#ffffff",
    "&:hover": {
      borderColor: state.selectProps["data-invalid"]
        ? "#dc3545"
        : state.isFocused
          ? "#86b7fe"
          : "#ced4da",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
  }),
  valueContainer: (base) => ({
    ...base,
    minHeight: 38,
    padding: "0 14px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  menu: (base) => ({
    ...base,
    zIndex: 30,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eff6ff" : "#ffffff",
    color: "#0f172a",
  }),
};

function MultiSelectOption(props) {
  const { isSelected, label } = props;

  return (
    <components.Option {...props}>
      <span className="edts-select-box__option-content">
        <span
          className={classNames("edts-select-box__option-checkbox", {
            "edts-select-box__option-checkbox--checked": isSelected,
          })}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
          </svg>
        </span>
        <span className="edts-select-box__option-label">{label}</span>
      </span>
    </components.Option>
  );
}

export function EdtsSelectBox({
  selectType,
  associationValue,
  valueAttribute,
  optionsSource,
  allowMultiple,
  optionLabelAttr,
  label,
  placeholder,
  helperText,
  trueCaption,
  falseCaption,
  isClearable,
  isSearchable,
  required,
  requiredMessage,
  validateOnChange,
  onChangeAction,
  onBlurAction,
}) {
  const inputId = useId();
  const messageId = useId();
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const isAssociationMode = selectType === "association";
  const isBooleanMode = selectType === "boolean";
  const isReferenceSetAssociation =
    isAssociationMode && associationValue?.type === "ReferenceSet";
  const isMultiAssociation =
    isReferenceSetAssociation && isEnabled(allowMultiple);
  const currentValueSource = isAssociationMode
    ? associationValue
    : valueAttribute;
  const readOnly = Boolean(currentValueSource?.readOnly);

  const options = useMemo(() => {
    if (isAssociationMode) {
      if (
        !optionsSource ||
        optionsSource.status !== "available" ||
        !Array.isArray(optionsSource.items)
      ) {
        return [];
      }

      return optionsSource.items.map((item) => {
        const caption = getAttributeValue(
          optionLabelAttr,
          item,
          String(item.id),
        );

        return {
          label: caption || String(item.id),
          value: String(item.id),
          item,
        };
      });
    }

    const universe = Array.isArray(valueAttribute?.universe)
      ? valueAttribute.universe
      : [];

    if (isBooleanMode) {
      const booleanUniverse = universe.length > 0 ? universe : [true, false];

      return booleanUniverse.map((option) => ({
        label: option ? trueCaption || "True" : falseCaption || "False",
        value: String(option),
        rawValue: option,
      }));
    }

    return universe.map((option) => ({
      label: formatEnumCaption(option),
      value: String(option),
      rawValue: option,
    }));
  }, [
    falseCaption,
    isAssociationMode,
    isBooleanMode,
    optionLabelAttr,
    optionsSource,
    trueCaption,
    valueAttribute,
  ]);

  const selectedValue = useMemo(() => {
    if (isAssociationMode) {
      if (isMultiAssociation) {
        return normalizeAssociationSelection(associationValue?.value);
      }

      return normalizeSingleAssociationSelection(associationValue?.value);
    }

    return getEditableValue(valueAttribute);
  }, [associationValue, isAssociationMode, isMultiAssociation, valueAttribute]);

  const selectedOption = useMemo(() => {
    if (isMultiAssociation) {
      return options.filter(option => selectedValue.includes(option.value));
    }

    if (isAssociationMode) {
      const associationLabel = getDisplayValue(valueAttribute);
      const normalizedAssociationLabel = normalizeText(associationLabel);
      const matchedOption = selectedValue
        ? options.find((option) => option.value === selectedValue)
        : null;

      if (matchedOption) {
        return matchedOption;
      }

      if (normalizedAssociationLabel) {
        const matchedByLabel = options.find(
          (option) => normalizeText(option.label) === normalizedAssociationLabel,
        );

        if (matchedByLabel) {
          return matchedByLabel;
        }
      }

      if (associationLabel) {
        return {
          label: associationLabel,
          value: selectedValue || associationLabel,
        };
      }
    }

    return options.find((option) => option.value === selectedValue) || null;
  }, [isAssociationMode, isMultiAssociation, options, selectedValue, valueAttribute]);

  const validationMessages = useMemo(() => {
    return getValidationMessages({
      required,
      value: Array.isArray(selectedValue) ? selectedValue.length : selectedValue,
      requiredMessage,
      mendixValidation: currentValueSource && currentValueSource.validation,
    });
  }, [currentValueSource, required, requiredMessage, selectedValue]);

  const showValidation = touched || (validateOnChange && dirty);
  const isInvalid = showValidation && validationMessages.length > 0;

  function handleChange(nextOption) {
    setDirty(true);

    if (isAssociationMode) {
      if (
        associationValue &&
        typeof associationValue.setValue === "function" &&
        !associationValue.readOnly
      ) {
        if (isMultiAssociation) {
          associationValue.setValue(
            Array.isArray(nextOption) ? nextOption.map((option) => option.item) : [],
          );
        } else if (isReferenceSetAssociation) {
          associationValue.setValue(nextOption ? [nextOption.item] : []);
        } else {
          associationValue.setValue(nextOption ? nextOption.item : undefined);
        }
      }
    } else if (
      valueAttribute &&
      typeof valueAttribute.setValue === "function" &&
      !valueAttribute.readOnly
    ) {
      if (!nextOption) {
        valueAttribute.setValue(undefined);
      } else if (isBooleanMode) {
        valueAttribute.setValue(nextOption.rawValue);
      } else {
        valueAttribute.setValue(nextOption.rawValue ?? nextOption.value);
      }
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
    <div
      className={classNames("edts-select-box", {
        "edts-select-box--invalid": isInvalid,
        "edts-select-box--readonly": readOnly,
      })}
    >
      {label ? (
        <label className="edts-select-box__label" htmlFor={inputId}>
          <span>{label}</span>
          {required ? <span className="edts-select-box__required">*</span> : null}
        </label>
      ) : null}
      <div className="edts-select-box__control">
        <input
          className="edts-select-box__native-validator"
          tabIndex={-1}
          autoComplete="off"
          value={Array.isArray(selectedValue) ? selectedValue.join(",") : selectedValue}
          onChange={() => undefined}
          onInvalid={handleInvalid}
          required={isEnabled(required)}
          aria-hidden="true"
        />
        <Select
          inputId={inputId}
          classNamePrefix="edts-select-box__react-select"
          components={isMultiAssociation ? { Option: MultiSelectOption } : undefined}
          options={options}
          value={selectedOption}
          placeholder={placeholder || "Choose an option"}
          isClearable={isEnabled(isClearable, true)}
          isSearchable={isEnabled(isSearchable, true)}
          isMulti={isMultiAssociation}
          closeMenuOnSelect={!isMultiAssociation}
          hideSelectedOptions={false}
          isDisabled={readOnly}
          onChange={handleChange}
          onBlur={handleBlur}
          styles={selectStyles}
          data-invalid={isInvalid}
        />
      </div>
      {isInvalid ? (
        <div className="edts-select-box__messages" id={messageId}>
          {validationMessages.map((message, index) => (
            <div
              key={index}
              className={classNames(
                "edts-select-box__message",
                "invalid-feedback",
              )}
            >
              {message}
            </div>
          ))}
        </div>
      ) : helperText ? (
        <div
          className={classNames(
            "edts-select-box__helper",
            "form-text",
            "text-muted",
          )}
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
