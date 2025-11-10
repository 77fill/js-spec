import {isNumber, $coll, isString} from "@/lib/main";

export const nums_count_btw_2_and_5 = $coll({spec: isNumber, min: 2, max: 5})
export const strings_even_count = $coll({spec: isString, min: 2, predicate: coll => coll.length % 2 === 0})