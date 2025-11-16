import {$seq, $str, $many, $group, $class, isString, isNumber} from "@/lib/main"

export const string_then_number = $seq({
    "string": isString,
    "number": isNumber,
})

// const digits =
//     new Array(10)
//         .map( (_, i) => i.toString() )
//
// export const German_IBAN = $seq({
//     "country": $group($str("D"), $str("E")),
//     "bank": $many($class(...digits), 8),
//     "account": $many($class(...digits), 10),
// })