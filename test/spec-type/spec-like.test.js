import { expect } from "chai";
import { describe } from "vitest";
import toSpec from "../../lib/core-private/spec-like";
import { $tuple } from "../../lib/main";

describe("SPEC-LIKE", () => {
    it("VALID", () => {
        expect(() => {
            const constants = [
                toSpec(2),
                toSpec("bear"),
                toSpec(Symbol(3)),
                toSpec(true),
            ]

            const predicate = toSpec(val => val % 4 === 1)
            const properSpec = toSpec($tuple(1,2))
            const oneOf = toSpec(["either", "or"])
        })
        .to.not.throw
    })

    it("INVALID", () => {
        expect(() => toSpec(undefined))
        .to.throw

        expect(() => toSpec(null))
        .to.throw

        expect(() => toSpec({bla: 4}))
        .to.throw
    })
})