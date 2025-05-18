import {describe} from "vitest";
import {domain} from "./tested-specs.js";

describe("explain - shallow structures", () => {
    it("tests invalid data", () => {
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