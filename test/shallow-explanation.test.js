import {describe} from "vitest";
import {domain, game} from "./tested-specs.js";
import {$explain} from "../lib/main.js";

describe("explain - shallow invalid structures", () => {
    it("tests by logic e.g. and,or", () => {
        expect($explain(domain.age, "no-age-here")).to.equal([
            {
                invalidValue: "no-age-here",
                failedPredicate: "(val) => Number.isInteger(val)",
                path: [],
                data: "no-age-here",
                failedSpec: "domain/age"
            }
        ])
    })
})