import { describe, it } from "vitest";
import { $or } from "../../lib/main";
import { expect } from "chai";

const criterion = $or(
    val => typeof val === "function",
    ["wealth", "power", "age"],
)

const isCriterion = criterion.valid.bind(criterion)

describe("OR", () => {
    it("VALID", () => {
        expect("wealth")
        .to.satisfy(isCriterion)

        expect(obj => obj.important)
        .to.satisfy(isCriterion)
    })

    it("INVALID", () => {
        expect(23)
        .to.not.satisfy(isCriterion)

        expect(Symbol(2))
        .to.not.satisfy(isCriterion)

        expect(null)
        .to.not.satisfy(isCriterion)
    })
})