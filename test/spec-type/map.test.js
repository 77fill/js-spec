import { describe, it } from "vitest";
import { $def, isInteger, isString, $map } from "../../lib/main"
import { expect } from "chai";

const person = 
    $def("person", {
        firstname: isString,
        lastname: isString,
        age: isInteger,
        city: isString,
    })

const living_being = 
    $def("living_being", {
        appendage: isString,
    })

const customer = $map("person/firstname", "person/lastname", "person/age", "person/city")

const isCustomer = customer.valid.bind(customer)

describe("MAP", () => {
    it("VALID", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity"
        })
        .to.satisfy(isCustomer)

        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity",
            [living_being.appendage]: "tentacles"
        })
        .to.satisfy(isCustomer)
    })

    it("INVALID", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
        })
        .to.not.satisfy(isCustomer)
    })
})