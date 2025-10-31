import {$def} from "@/lib/main.js";
import {isInteger, isString} from "@/lib/util/predicates.js";
import {$map} from "@/lib/define/spec-for-map.js";

export const person =
    $def("person", {
        firstname: isString,
        lastname: isString,
        age: isInteger,
        city: isString,
    })

export const living_being =
    $def("living_being", {
        appendage: isString,
    })

export const customer = $map("person/firstname", "person/lastname", "person/age", "person/city")