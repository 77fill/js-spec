import { describe, it } from "vitest";
import { $tuple, isInteger, isString } from "../../lib/main";
import { expect } from "chai";

const name = $tuple(isString, isString)
const position = $tuple(isInteger, isInteger)

const isName = name.valid.bind(name)
const isPosition = position.valid.bind(position)

describe("TUPLE", () => {
    it("VALID", () => {
        expect(
            ["Tom", "Mayer"]
        )
        .to.satisfy(isName)

        expect(
            [10,10]
        )
        .to.satisfy(isPosition)
    })

    it("INVALID", () => {
        expect(
            ["philipp", 32]
        )
        .to.not.satisfy(isName)

        expect(
            [10,10,0]
        )
        .to.not.satisfy(isPosition)
    })
})