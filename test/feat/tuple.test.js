import { describe, it } from "vitest";
import { $tuple, isInteger, isString } from "../../lib/main";
import { expect } from "chai";


describe("a tuple", () => {
    const name = $tuple(isString, isString)
    const position = $tuple(isInteger, isInteger)

    const name_valid = name.valid.bind(name)
    const position_valid = position.valid.bind(position)

    it("defines valid tuples", () => {
        expect(
            ["Tom", "Mayer"]
        )
        .to.satisfy(name_valid)

        expect(
            [10,10]
        )
        .to.satisfy(position_valid)
    })

    it("defines invalid tuples", () => {
        expect(
            ["philipp", 32]
        )
        .to.not.satisfy(name_valid)

        expect(
            [10,10,0]
        )
        .to.not.satisfy(position_valid)
    })
})