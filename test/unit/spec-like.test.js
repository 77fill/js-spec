import { expect } from "chai";
import { describe, it } from "vitest";
import toSpec from "@/lib/core/spec-like";
import { $tuple } from "../../lib/main";

class Person {}

describe("SPEC-LIKE", () => {
    it("VALID", () => {
        expect(() => {
            const constants = [
                toSpec(2),
                toSpec(Symbol(3)),
                toSpec(true),
            ]

            const predicate = toSpec(val => val % 4 === 1)
            const properSpec = toSpec($tuple(1,2))
            const oneOf = toSpec(["either", "or"])
            const regex = toSpec(/^[a-z]$/)
            const instanceOf = toSpec(Person)
        })
        .to.not.throw()
    })

    it("INVALID", () => {
        expect(() => toSpec(undefined))
        .to.throw

        expect(() => toSpec(null))
        .to.throw

        expect(() => toSpec({bla: 4}))
        .to.throw()
    })
})