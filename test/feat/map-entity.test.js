import { beforeAll, describe, it } from "vitest";
import { $def, isInteger, isString, $map, $valid } from "../../lib/main"
import { expect } from "chai";
import registry from "../../lib/core-private/registry";

describe("an entity map", () => {
    let person = 
        $def("person", {
            firstname: isString,
            lastname: isString,
            age: isInteger,
            city: isString,
           
        })

    person = {...person, ...$def("person", {
        customer: $map("person/firstname", "person/lastname", "person/age", "person/city"),
    })}

    const living_being = 
        $def("living_being", {
            appendage: isString,
        })

    const customer_valid = registry.get(person.customer).valid.bind(registry.get(person.customer))

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