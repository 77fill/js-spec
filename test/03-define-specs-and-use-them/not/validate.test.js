import {describe, it} from "vitest";
import {expect} from "chai";
import {not_string, not_zero} from "./_definitions.js";

describe("NOT", () => {
    it("VALID", () => {
        expect(42)
            .to.satisfy(not_string)
            .and.satisfy(not_zero)
    })

    it("INVALID", () => {
        expect("42").to.not.satisfy(not_string)
        expect(0).to.not.satisfy(not_zero)
    })
})