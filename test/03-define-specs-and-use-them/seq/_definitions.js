import {$seq, $str, $many, $group, $class} from "@/lib/main"

const digits =
    new Array(10)
        .map( (_, i) => i.toString() )

export const German_IBAN = $seq({
    "country": $group($str("D"), $str("E")),
    "bank": $many($class(...digits), 8),
    "account": $many($class(...digits), 10),
})