import {describe, it} from "vitest";
import {expect} from "chai";
import {customer, living_being, person} from "@/test/define-specs-and-use-them/map/_definitions.js";

describe("MAP", () => {
    it("VALID", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity"
        })
            .to.satisfy(customer)

        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
            [person.city]: "ZCity",
            [living_being.appendage]: "tentacles"
        })
            .to.satisfy(customer)
    })

    it("INVALID", () => {
        expect({
            [person.firstname]: "Philipp",
            [person.lastname]: "Schmalz",
            [person.age]: 666,
        })
            .to.not.satisfy(customer)
    })
})