import { createElement, useId, useMemo, useState } from "react";
import classNames from "classnames";
import Select from "react-select";

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
    backgroundColor: state.isSelected
      ? "#0d6efd"
      : state.isFocused
        ? "#eff6ff"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#0f172a",
  }),
};

export function EdtsSelectBox({
  selectType,
  associationValue,
  valueAttribute,
  optionsSource,
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

  const selectedValue = isAssociationMode
    ? String(associationValue?.value?.id || "")
    : getEditableValue(valueAttribute);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === selectedValue) || null;
  }, [options, selectedValue]);

  const validationMessages = useMemo(() => {
    return getValidationMessages({
      required,
      value: selectedValue,
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
        associationValue.setValue(nextOption ? nextOption.item : undefined);
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
          {label}
        </label>
      ) : null}
      <div className="edts-select-box__control">
        <input
          className="edts-select-box__native-validator"
          tabIndex={-1}
          autoComplete="off"
          value={selectedValue}
          onChange={() => undefined}
          onInvalid={handleInvalid}
          required={Boolean(required)}
          aria-hidden="true"
        />
        <Select
          inputId={inputId}
          classNamePrefix="edts-select-box__react-select"
          options={options}
          value={selectedOption}
          placeholder={placeholder || "Choose an option"}
          isClearable={Boolean(isClearable)}
          isSearchable={Boolean(isSearchable)}
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
