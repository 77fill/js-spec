import { describe, it } from "vitest";
import { $and, isString } from "../../lib/main";
import { expect } from "chai";

const firstname = $and({
    string: isString, 
    noWhiteSpace: str => /^[^\s]*$/.test(str), 
    onlyAlphabet: str => /^[a-zA-Z]*$/.test(str),
    upperThenLowerCase: str => /^[A-Z][a-z]*$/.test(str)
})  
    
const isFirstname = firstname.valid.bind(firstname)

describe("AND", () => {
    it("VALID", () => {
        expect("Philipp")
        .to.satisfy(isFirstname)

        expect("Peter")
        .to.satisfy(isFirstname)
    })

    it("INVALID", () => {
        expect("pHilipp")
        .to.not.satisfy(isFirstname)

        expect(23)
        .to.not.satisfy(isFirstname)

        expect("nope_nope")
        .to.not.satisfy(isFirstname)
    })
})