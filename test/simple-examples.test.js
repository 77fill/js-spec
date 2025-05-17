import {sdef, isNumber, isString} from "../lib/main.js";
import {isValid} from "../lib/isValid.js";
import {describe, it, expect} from "vitest";

const domain = sdef({
    "domain/name": isString,
    "domain/age": isNumber,
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