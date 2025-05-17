import {$def, isNumber, isString, notNaN, isNegative, isInteger, $valid, $and, $not} from "../lib/main";
import {describe, it, expect} from "vitest";

// Specs:

const basic = $def("basic",{
    "word": $and(isString, /[a-zA-Zäöüß]+/.test)
})

const domain = $def("domain",{
    "firstname": basic.word,
    "age": $and(isInteger, notNaN, $not(isNegative)),
    "address": [isString, isString],
    "type": ["employer", "employee"].includes
})

// Behavior:

describe("simple examples", () => {
    it("should greenlight all datastructures of all types", () => {
        const person = {
            [domain.firstname]: "Philipp",
            "domain/age": 28,
            [domain.address]: ["Andreastraße 33", "12345 Blobugen"],
            "domain/type": "employer",
        }

        expect($valid(person)).to.be.true
    })
})