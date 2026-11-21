export const setStorage = (key, value) => {
    try {
        if (typeof window === "undefined") return false;

        if (typeof key !== "string" || !key.trim()) {
            throw new Error("Storage key must be a valid string.");
        }

        const serializedValue = JSON.stringify(value);

        if (serializedValue === undefined) {
            throw new Error("This value cannot be stored in LocalStorage.");
        }

        localStorage.setItem(key, serializedValue);

        return true;
    } catch (error) {
        console.error("Storage Save Error:", error);
        return false;
    }
};


export const getStorage = (key, defaultValue = null) => {
    try {
        if (typeof window === "undefined") return defaultValue;

        if (typeof key !== "string" || !key.trim()) {
            throw new Error("Storage key must be a valid string.");
        }

        const value = localStorage.getItem(key);

        if (value === null) return defaultValue;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }

    } catch (error) {
        console.error("Storage Read Error:", error);
        return defaultValue;
    }
};
