import {$tuple, isZero, isNumber, isString, isBoolean} from "@/lib/main";

export const num_num_str = $tuple(isNumber, isNumber, isString)
export const bool_num_zero = $tuple(isBoolean, isNumber, isZero)