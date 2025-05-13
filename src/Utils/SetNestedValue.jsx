export const setNestedValue = (obj, path, value) => {
    const keys = path.split(".");
    const newObj = { ...obj };
    let current = newObj;

    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = value;
        } else {
            current[key] = { ...current[key] };
            current = current[key];
        }
    });

    return newObj;
};