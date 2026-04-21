/**
 * @typedef Property
 * @type {object}
 * @property {string} key
 * @property {string} caption
 * @property {string} description
 * @property {string[]} objectHeaders
 * @property {ObjectProperties[]} objects
 * @property {Properties[]} properties
 */

/**
 * @typedef ObjectProperties
 * @type {object}
 * @property {PropertyGroup[]} properties
 * @property {string[]} captions
 */

/**
 * @typedef PropertyGroup
 * @type {object}
 * @property {string} caption
 * @property {PropertyGroup[]} propertyGroups
 * @property {Property[]} properties
 */

/**
 * @typedef Properties
 * @type {PropertyGroup}
 */

/**
 * @typedef Problem
 * @type {object}
 * @property {string} property
 * @property {("error" | "warning" | "deprecation")} severity
 * @property {string} message
 * @property {string} studioMessage
 * @property {string} url
 * @property {string} studioUrl
 */

/**
 * @param {object} values
 * @param {Properties} defaultProperties
 * @param {("web"|"desktop")} target
 * @returns {Properties}
 */
export function getProperties(values, defaultProperties, target) {
    if (defaultProperties.properties) {
        delete defaultProperties.properties.enableTimeSelect;
        delete defaultProperties.properties.selectionMode;
    }

    if (values.pickerMode !== "range" && defaultProperties.properties) {
        delete defaultProperties.properties.endPlaceholderText;
        delete defaultProperties.properties.rangeDisplayMode;
    }

    return defaultProperties;
}

/**
 * @param {Object} values
 * @returns {Problem[]}
 */
export function check(values) {
    /** @type {Problem[]} */
    const errors = [];

    if (!values.dateAttribute) {
        errors.push({
            property: "dateAttribute",
            severity: "error",
            message: "Date Attribute is required.",
            studioMessage: "Select a DateTime attribute.",
            url: "",
            studioUrl: ""
        });
    }

    if (!values.endDateAttribute) {
        errors.push({
            property: "endDateAttribute",
            severity: "error",
            message: "End Date Attribute is required because the widget always stores an end time.",
            studioMessage: "Select an End Date Attribute so the widget can store the end time.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.selectionMode === "date" || values.selectionMode === "time" || values.enableTimeSelect) {
        errors.push({
            property: values.enableTimeSelect ? "enableTimeSelect" : "selectionMode",
            severity: "deprecation",
            message:
                "Legacy time configuration is deprecated. The widget now uses a unified date flow with start and end time selection.",
            studioMessage: "Legacy time configuration is deprecated. Use the new default date and time flow.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.disabled && values.onChangeAction) {
        errors.push({
            property: "disabled",
            severity: "warning",
            message: "Disabled mode prevents the user from triggering On Change.",
            studioMessage: "Disabled mode prevents On Change from firing.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
