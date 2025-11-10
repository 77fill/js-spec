import {isZero, isString, $not} from "@/lib/main";

export const not_string = $not(isString)
export const not_zero = $not(isZero)