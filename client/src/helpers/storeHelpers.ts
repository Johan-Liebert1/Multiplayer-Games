export const getFromLocalStorage = <Type>(key: string): Type => {
    const item = localStorage.getItem(key);

    if (!item) return {} as Type;

    return JSON.parse(item) as Type;
};
