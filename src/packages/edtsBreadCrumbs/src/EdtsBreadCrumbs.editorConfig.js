export function getProperties(values, defaultProperties) {
    return defaultProperties;
}

export function check(values) {
    const errors = [];
    const items = Array.isArray(values.items) ? values.items : [];
    const activeItems = items.filter(item => item && item.active);

    if (!items.length) {
        errors.push({
            property: "items",
            severity: "warning",
            message: "Add at least one breadcrumb item.",
            studioMessage: "Add breadcrumb items.",
            url: "",
            studioUrl: ""
        });
    }

    if (activeItems.length > 1) {
        errors.push({
            property: "items",
            severity: "warning",
            message: "Only one breadcrumb item should be marked as active.",
            studioMessage: "Use only one active item.",
            url: "",
            studioUrl: ""
        });
    }

    return errors;
}
