/**
 * @param {object} values
 * @param {object} defaultProperties
 * @returns {object}
 */
export function getProperties(values, defaultProperties) {
  if (values.selectType !== "association" && defaultProperties.properties) {
    delete defaultProperties.properties.associationValue;
    delete defaultProperties.properties.optionsSource;
    delete defaultProperties.properties.optionLabelAttr;
    delete defaultProperties.properties.allowMultiple;
  }

  if (values.selectType === "association" && defaultProperties.properties) {
    delete defaultProperties.properties.valueAttribute;
    delete defaultProperties.properties.trueCaption;
    delete defaultProperties.properties.falseCaption;
  }

  if (values.selectType !== "boolean" && defaultProperties.properties) {
    delete defaultProperties.properties.trueCaption;
    delete defaultProperties.properties.falseCaption;
  }

  return defaultProperties;
}

/**
 * @param {Object} values
 * @returns {Array}
 */
export function check(values) {
  const errors = [];

  if (values.selectType === "association" && !values.associationValue) {
    errors.push({
      property: "associationValue",
      severity: "error",
      message: "Select an association when Type is Association.",
      studioMessage: "Select an association.",
      url: "",
      studioUrl: "",
    });
  }

  if (values.selectType === "association" && !values.optionsSource) {
    errors.push({
      property: "optionsSource",
      severity: "error",
      message: "Selectable Objects is required in Association mode.",
      studioMessage: "Select a datasource for Selectable Objects.",
      url: "",
      studioUrl: "",
    });
  }

  if (values.selectType !== "association" && !values.valueAttribute) {
    errors.push({
      property: "valueAttribute",
      severity: "error",
      message: "Select a value attribute when Type is Enumeration or Boolean.",
      studioMessage: "Select a value attribute.",
      url: "",
      studioUrl: "",
    });
  }

  if (values.required && !values.requiredMessage) {
    errors.push({
      property: "requiredMessage",
      severity: "warning",
      message:
        "Provide a custom required message for a clearer validation experience.",
      studioMessage: "Provide a custom required message.",
      url: "",
      studioUrl: "",
    });
  }

  return errors;
}
