import { beforeAll, describe, it } from "vitest";
import { $def, isInteger, isString, $map } from "../../lib/main"
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

    const customer_valid = person.customer.valid.bind(person.customer)

    it("defines a valid customer", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity"
        })
        .to.satisfy(customer_valid)
    })

    it("defines a valid customer with extras", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity",
            [living_being.appendage]: "tentacles"
        })
        .to.satisfy(customer_valid)
    })

    it("defines an incomplete customer", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
        })
        .to.not.satisfy(customer_valid)
    })
})