import { describe, it } from "vitest"
import { isInteger, isString } from "../../lib/util/predicates"
import { expect } from "chai"

const triple = $cat(
    "firstString", isString,
    "firstNumber", isInteger,
    "secondString", isString,
)
const isTriple = triple.valid.bind(triple)

describe("CAT", () => {
    it("VALID", () => {
        expect(["string", 2, "blah"])
        .to.satisfy(isTriple)
    })

    it("INVALID", () => {
        expect(["string", 42])
        .to.not.satisfy(isTriple)
    })
})