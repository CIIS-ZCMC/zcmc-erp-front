export function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();

    const newObj = { ...obj };
    let current = newObj;

    for (const key of keys) {
        current[key] = { ...current[key] };
        current = current[key];
    }

    current[lastKey] = value;

    return newObj;
}