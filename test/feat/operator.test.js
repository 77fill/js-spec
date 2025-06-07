import { describe, it } from "vitest";
import { $def, $and, $or, $valid, isArray, isInteger, isNumber, isString } from "../../lib/main";
import { expect } from "chai";


describe("values spec'ed by specs joined via an operator", () => {
    const domain = $def("domain", {
        firstname: $and({
            string: isString, 
            noWhiteSpace: /^[^\s]*$/.test, 
            onlyAlphabet: /^[a-zA-Z]*$/.test,
            upperThenLowerCase: /^[A-Z][a-z]*$/.test
        }),
        amount: $or(
            isInteger, 
            val => val === "unknown", 
            $and({
                isArray,
                firstIsNumber: arr => isNumber(arr[0]),
                secondIsObsolete: arr => arr[1] === "obsolete",
            })
        ),
    })

    it("defines valid values", () => {
        expect({
            [domain.firstname]: "Philipp",
            [domain.amount]: 42,
        })
        .to.satisfy($valid)

        expect({
            [domain.firstname]: "Peter",
            [domain.amount]: "unknown",
        })
        .to.satisfy($valid)

        expect({
            [domain.firstname]: "Dsadfsdf",
            [domain.amount]: [42, "obsolete"],
        })
        .to.satisfy($valid)
    })

    it("defines invalid values", () => {
        expect({
            [domain.firstname]: "not_a_name"
        })
        .to.not.satisfy($valid)

        expect({
            [domain.firstname]: "pHilipp"
        })
        .to.not.satisfy($valid)

        expect({
            [domain.amount]: "blah"
        })
        .to.not.satisfy($valid)
    })
})