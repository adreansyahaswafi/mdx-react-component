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
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.
    /* Example
    if (values.myProperty === "custom") {
        delete defaultProperties.properties.myOtherProperty;
    }
    */
    return defaultProperties;
}

/**
 * @param {Object} values
 * @returns {Problem[]} returns a list of problems.
 */
export function check(values) {
    /** @type {Problem[]} */
    const errors = [];

    if (values.onDateSelect && !values.selectedDateAttr && !values.selectedEventStartAttr && !values.selectedEventEndAttr) {
        errors.push({
            property: "selectedDateAttr",
            severity: "warning",
            message: "Selected Date, Start, and End attributes are optional. Bind them when your page or dialog also wants the clicked slot values stored on the current object. The action itself can receive Selected Date, Selected Start, and Selected End parameters.",
            studioMessage: "Bind selected date or start/end attributes only if your page also reads the clicked slot values from the current object.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.onEventClick && values.onEventChange && values.onEventClick === values.onEventChange) {
        errors.push({
            property: "onEventClick",
            severity: "warning",
            message: "Using the same action for both On Event Click and On Event Change can cause unexpected UX. Prefer a dialog or page action for click and a dedicated update action for drag or resize.",
            studioMessage: "Use different actions for event click and event change when possible.",
            url: "",
            studioUrl: ""
        });
    }

    if ((values.onEventClick || values.onEventChange) && !values.selectedEventIdAttr && !values.selectedEventTitleAttr && !values.selectedEventStartAttr && !values.selectedEventEndAttr) {
        errors.push({
            property: "selectedEventIdAttr",
            severity: "warning",
            message: "Selected event attributes are optional. Bind them only if you also want the current object to keep the clicked or changed event values.",
            studioMessage: "Bind selected event attributes only when your page, dialog, or save flow also reads event values from the current object.",
            url: "",
            studioUrl: ""
        });
    }

    if (values.onEventChange && !values.selectedEventStartAttr && !values.selectedEventEndAttr) {
        errors.push({
            property: "selectedEventStartAttr",
            severity: "warning",
            message: "For On Event Change, bind Selected Event Start Attribute and Selected Event End Attribute when your page flow also wants the updated drag or resize dates on the current object. The action can still receive the changed event object plus eventStart and eventEnd parameters.",
            studioMessage: "Bind Selected Event Start Attribute and Selected Event End Attribute when your page also reads the changed dates from the current object.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}

// /**
//  * @param {object} values
//  * @param {boolean} isDarkMode
//  * @param {number[]} version
//  * @returns {object}
//  */
// export function getPreview(values, isDarkMode, version) {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     };
// }

// /**
//  * @param {Object} values
//  * @param {("web"|"desktop")} platform
//  * @returns {string}
//  */
// export function getCustomCaption(values, platform) {
//     return "EdtsCalendar";
// }
