import {describe, it} from "vitest";
import {expect} from "chai";
import {/*German_IBAN,*/ string_then_number} from "@/test/03-define-specs-and-use-them/seq/_definitions.js";

describe("SEQ", () => {
    it("VALID", () => {
        expect(["string", 42]).to.satisfy(string_then_number)

        // expect([..."DE123456780000000099"]).to.satisfy(German_IBAN)
    })

    it("INVALID", () => {
        expect(["string", "number"]).to.not.satisfy(string_then_number)

        // expect([..."DF123456780000000099"]).to.not.satisfy(German_IBAN)
        // expect([..."DE1234567800000000991"]).to.not.satisfy(German_IBAN)
        // expect([..."DE#23456780000000099"]).to.not.satisfy(German_IBAN)
    })
})