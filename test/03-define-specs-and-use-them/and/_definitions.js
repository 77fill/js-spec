import {isNumber, isString, $and} from "@/lib/main.js";

export const number_and_less_than_10 = $and(isNumber, n => n < 10);
export const prop_a_number_and_prop_b_string = $and(m => isNumber(m.a), m => isString(m.b));