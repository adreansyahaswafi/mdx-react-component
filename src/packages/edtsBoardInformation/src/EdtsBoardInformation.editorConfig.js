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

    if (!values.dataSource) {
        errors.push({
            property: "dataSource",
            severity: "warning",
            message: "Set a datasource so the KPI card can read its content.",
            studioMessage: "Set a datasource for the KPI card.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
