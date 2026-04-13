/**
 * @param {object} values
 * @param {object} defaultProperties
 * @returns {object}
 */
export function getProperties(values, defaultProperties) {
    return defaultProperties;
}

/**
 * @param {Object} values
 * @returns {Array}
 */
export function check(values) {
    const errors = [];

    if (values.mapHeight != null && values.mapHeight < 240) {
        errors.push({
            property: "mapHeight",
            severity: "warning",
            message: "Map height below 240px can make markers and popups hard to use.",
            studioMessage: "Use at least 240px height for a usable map.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
