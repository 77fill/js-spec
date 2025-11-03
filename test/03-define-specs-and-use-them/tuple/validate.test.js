import {describe} from "vitest";
import {bool_num_zero, num_num_str} from "@/test/03-define-specs-and-use-them/tuple/_definitions.js";

describe("TUPLE", () => {
    test("VALID", () => {
        expect( [4, 2, "42"] )  .to.satisfy(num_num_str)
        expect( [true, 42, 0] ) .to.satisfy(bool_num_zero)
    })

    test("INVALID", () => {
        expect( [4,2] )             .to.not.satisfy(num_num_str)
        expect( [true, 42, "0"] )   .to.not.satisfy(bool_num_zero)
    })
})