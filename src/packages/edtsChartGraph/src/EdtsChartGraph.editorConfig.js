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
    return defaultProperties;
}

/**
 * @param {Object} values
 * @returns {Problem[]} returns a list of problems.
 */
export function check(values) {
    /** @type {Problem[]} */
    const errors = [];

    if (values.height != null && values.height < 160) {
        errors.push({
            property: "height",
            severity: "warning",
            message: "Chart height below 160px can make labels and legends hard to read.",
            studioMessage: "Use at least 160px height for a clearer chart.",
            url: "",
            studioUrl: ""
        });
    }

    if ((values.chartType === "pie" || values.chartType === "donut") && values.useSmoothCurve) {
        errors.push({
            property: "useSmoothCurve",
            severity: "warning",
            message: "Smooth curve is only relevant for line or area charts.",
            studioMessage: "Smooth curve only affects line and area charts.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}

/**
 * @param {Object} values
 * @param {("web"|"desktop")} platform
 * @returns {string}
 */
export function getCustomCaption(values, platform) {
    return values.chartTitle || "EdtsChartGraph";
}
