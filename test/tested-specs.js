import {$and, $def, $not, isInteger, isNegative, isString, notNaN} from "../lib/main.js";

export const basic = $def("basic",{
    "word": $and(isString, /[a-zA-Zäöüß]+/.test)
})

export const domain = $def("domain",{
    "firstname": basic.word,
    "age": $and(isInteger, notNaN, $not(isNegative)),
    "address": [isString, isString],
    "type": ["employer", "employee"].includes
})