export function getProperties(values, defaultProperties) {
    if (!defaultProperties.properties) {
        return defaultProperties;
    }

    if (values.selectionMode === "boolean") {
        delete defaultProperties.properties.associationValue;
        delete defaultProperties.properties.optionsSource;
        delete defaultProperties.properties.optionLabelAttr;
        delete defaultProperties.properties.optionDescriptionAttr;
    }

    if (values.selectionMode === "array") {
        delete defaultProperties.properties.booleanAttribute;
        delete defaultProperties.properties.booleanCaption;
        delete defaultProperties.properties.booleanDescription;
    }

    return defaultProperties;
}

export function check(values) {
    const errors = [];

    if (values.selectionMode === "boolean" && !values.booleanAttribute) {
        errors.push({
            property: "booleanAttribute",
            severity: "error",
            message: "Select a Boolean Attribute when Mode is Boolean.",
            studioMessage: "Select a boolean attribute.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.selectionMode === "array" && !values.associationValue) {
        errors.push({
            property: "associationValue",
            severity: "error",
            message: "Select a Reference Set association when Mode is Array.",
            studioMessage: "Select a reference set.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.selectionMode === "array" && !values.optionsSource) {
        errors.push({
            property: "optionsSource",
            severity: "error",
            message: "Options Source is required when Mode is Array.",
            studioMessage: "Select an options datasource.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.required && !values.requiredMessage) {
        errors.push({
            property: "requiredMessage",
            severity: "warning",
            message: "Provide a custom required message for a clearer validation experience.",
            studioMessage: "Provide a custom required message.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
