import fromExponential from "from-exponential";

export const trim = (num: number | string, precision: number) => {
    const array = fromExponential(num).split(".");
    if (array.length === 1) return fromExponential(num);
    //@ts-ignore
    array.push(array.pop().substring(0, precision));
    const trimmedNumber = array.join(".");
    return trimmedNumber;
};
