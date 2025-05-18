export const isString = (val) => typeof val === "string"
export const isNumber = (val) => typeof val === "number"
export const isNaN = (val) => Number.isNaN(val)
export const notNaN = (val) => !isNaN(val)
export const isInteger = (val) => Number.isInteger(val)
export const isNegative = (val) => val < 0
export const isFunction = (val) => typeof val === "function"
export const isPositive = (val) => val > 0
export const isZero = (val) => val === 0 || val === -0
export const isNullish = (val) => val === undefined || val === null
export const isBoolean = (val) => typeof val === "boolean"
export const isArray = (val) => Array.isArray(val)
export const isSet = (val) => val instanceof Set