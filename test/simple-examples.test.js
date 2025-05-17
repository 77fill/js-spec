import {$def, isNumber, isString, notNaN, isNegative, isInteger} from "../lib/main.js";
import {isValid} from "../lib/isValid.js";
import {describe, it, expect} from "vitest";
import {$and, $not} from "../lib/spec.js";

const basic = $def({
    "basic/word": $and(isString, /[a-zA-Zäöüß]+/.test)
})

const domain = $def({
    "domain/firstname": basic["basic/word"],
    "domain/age": $and(isInteger, notNaN, $not(isNegative)),
})

describe("simple examples", () => {
    it("should greenlight all datastructures of all types", () => {
        expect(isValid({
            "domain/name": "Philipp",
            "domain/age": 28,
        }))
            .to.be.true
    })
})