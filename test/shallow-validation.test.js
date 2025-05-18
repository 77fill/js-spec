import {$valid} from "../lib/main";
import {describe, expect, it} from "vitest";
import {domain} from "./tested-specs.js";

// Behavior:

describe("validate - shallow structures", () => {
    it("tests valid data", () => {
        const person = {
            [domain.firstname]: "Philipp",
            "domain/age": 28,
            [domain.address]: ["Andreastraße 33", "12345 Blobugen"],
            "domain/type": "employer",
        }

        expect($valid(person)).to.be.true
    })
})