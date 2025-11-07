import {describe, it} from "vitest";
import {expect} from "chai";
import {
    number_and_less_than_10,
    prop_a_number_and_prop_b_string
} from "./_definitions";

describe("AND", () => {
    it("VALID", () => {
        expect(5).to.satisfy(number_and_less_than_10)
        expect({
            a: 42,
            b: "42"
        }).to.satisfy(prop_a_number_and_prop_b_string)
    })

    it("INVALID", () => {
        expect(10).to.not.satisfy(number_and_less_than_10)
        expect({
            a: 42,
            b: 42
        }).to.not.satisfy(prop_a_number_and_prop_b_string)
    })
})