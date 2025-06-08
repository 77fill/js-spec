import { describe, it } from "vitest";
import { $coll, isInteger, isString } from "../../lib/main"
import { expect } from "chai";

const numbers = $coll({
    spec: isInteger,
    minCount: 2,
    maxCount: 10,
})

const strings = $coll({
    spec: isString,
    minCount: 1,
    kind: (coll => coll.length % 2 == 0),
    distinct: true,
})

const areNumbers = numbers.valid.bind(numbers)
const areStrings = strings.valid.bind(strings)

describe("COLLECTION", () => {
    describe("VALID", () => {
        it("numbers", () => {
            expect(
                new Set([1, 2, 3, 4])
            )
            .to.satisfy(areNumbers)

            expect(
                [-1, 2, 3, 3]
            )
            .to.satisfy(areNumbers)
        })

        it("strings", () => {
            expect(
                ["this", "is", "even", "!"]
            )
            .to.satisfy(areStrings)

            expect(
                new Set(["this", "too", "too"])
            )
            .to.satisfy(areStrings)

            expect([
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
                "k", "l", "m", "n", "o", "p", "q", "r", "s",
                "t", "u", "v", "w", "x", "y", "z"
            ])
            .to.satisfy(areStrings)
        })
        
    })

    describe("INVALID", () => {
        it("numbers", () => {
            expect(
                new Set()
            )
            .to.not.satisfy(areNumbers)

            expect(
                new Set([1,2,3,4,5,6,7,8,9,10,11])
            )
            .to.not.satisfy(areNumbers)

            expect(
                new Set([1,1])
            )
            .to.not.satisfy(areNumbers)
        })

        it("strings", () => {
            expect(
                []
            )
            .to.not.satisfy(areStrings)

            expect(
                ["this", "this"]
            )
            .to.not.satisfy(areStrings)

            expect(
                ["this", "is", "odd"]
            )
            .to.not.satisfy(areStrings)
        })
    })
})