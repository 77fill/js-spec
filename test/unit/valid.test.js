import { expect, describe, it } from "chai"
import { $def, $valid, isArray, isInteger, isString } from "../../lib/main"

$def("domain", {
    firstname: isString
})

describe("VALID", () => {
    it("validates a map entity", () => {
        expect(
            $valid({
                "domain/firstname": "Tom"
            })
        )
        .to.be.true
    })

    it("validates a value with a spec-like", () => {
        expect(
            $valid(isInteger, -4)
        )
        .to.be.true
    })

    it("validates several values with spec-likes", () => {
        expect(
            $valid(
                [isArray, []],
                [a => a > 3, 5],
                [true, true]
            )
        )
        .to.be.true
    })
})