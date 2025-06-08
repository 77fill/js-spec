import { describe, it } from "vitest";
import { $not, isNumber } from "../../lib/main";
import { expect } from "chai";

const uncountable = $not(isNumber)

const isUncountable = uncountable.valid.bind(uncountable)

describe("NOT", () => {
    it("VALID", () => {
        expect("s")
        .to.satisfy(isUncountable)

        expect(null)
        .to.satisfy(isUncountable)
    })

    it("INVALID", () => {
        expect(23)
        .to.not.satisfy(isUncountable)

        expect(-23)
        .to.not.satisfy(isUncountable)
    })
})