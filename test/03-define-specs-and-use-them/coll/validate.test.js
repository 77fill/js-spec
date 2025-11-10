import {describe, it} from "vitest";
import {expect} from "chai";
import {nums_count_btw_2_and_5, strings_even_count} from "./_definitions.js";

describe("COLL", () => {
    it("VALID", () => {
        expect(new Set([1,2,3]))            .to.satisfy(nums_count_btw_2_and_5)
        expect(["one", "two", "three", "four"]).to.satisfy(strings_even_count)
    })

    it("INVALID", () => {
        expect(new Set([1,2,3,4,5,6]))      .to.not.satisfy(nums_count_btw_2_and_5)
        expect(["one", "two", "three"])         .to.not.satisfy(strings_even_count)
    })
})