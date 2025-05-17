export const isString = (val) => typeof val === "string"
export const isNumber = (val) => typeof val === "number"
export const isNaN = (val) => Number.isNaN(val)
export const notNaN = (val) => !isNaN(val)
export const isInteger = (val) => Number.isInteger(val)
export const isNegative = (val) => val < 0