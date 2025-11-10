import {describe, it} from "vitest";
import {or_negative_5_7} from "./_definitions.js";
import {expect} from "chai";

describe("OR", () => {
    it("VALID", () => {
        expect(-5).to.satisfy(or_negative_5_7)
        expect(5).to.satisfy(or_negative_5_7)
        expect(7).to.satisfy(or_negative_5_7)
    })

    it("INVALID", () => {
        expect(0).to.not.satisfy(or_negative_5_7)
        expect(10).to.not.satisfy(or_negative_5_7)
    })
})