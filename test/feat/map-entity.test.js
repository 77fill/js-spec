import { beforeAll, describe, it } from "vitest";
import $def from "../../lib/define/keys-that-are-spec_ed";
import { isInteger, isString } from "../../lib/util/predicates";
import { $map } from "../../lib/define/spec-by-membership";
import { expect } from "chai";

describe("an entity map", () => {
    const person = 
        $def("person", {
            firstname: isString,
            lastname: isString,
            age: isInteger,
            city: isString,
            customer: $map("person/firstname", "person/lastname", "person/age", "person/city"),
        })

    const living_being = 
        $def("living_being", {
            appendage: isString,
        })

    it("defines a valid customer", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity"
        })
        .to.satisfy(person.customer.valid)
    })

    it("defines a valid customer with extras", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity",
            [living_being.appendage]: "tentacles"
        })
        .to.satisfy(person.customer.valid)
    })

    it("defines an incomplete customer", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
        })
        .to.not.satisfy(person.customer.valid)
    })
})