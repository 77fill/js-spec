import { describe } from "vitest";
import { $tuple, isInteger } from "../../lib/main";
import { expect } from "chai";


describe("a tuple", () => {
    const name = $tuple(isString, isString)
    const position = $tuple(isInteger, isInteger)

    it("defines valid tuples", () => {
        expect(
            ["Tom", "Mayer"]
        )
        .to.satisfy(name.valid)

        expect(
            [10,10]
        )
        .to.satisfy(position.valid)
    })

    it("defines invalid tuples", () => {
        expect(
            ["philipp", 32]
        )
        .to.not.satisfy(name.valid)

        expect(
            [10,10,0]
        )
        .to.not.satisfy(position.valid)
    })
})