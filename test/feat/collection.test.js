import { describe, it } from "vitest";
import { $coll, isInteger, isString } from "../../lib/main"
import { expect } from "chai";


describe("a collection of numbers", () => {
    const numbers = $coll({
        spec: isInteger,
        minCount: 2,
        maxCount: 10,
    })

    const numbers_valid = numbers.valid.bind(numbers)

    it("defines valid collections", () => {
        expect(
            new Set([1, 2, 3, 4])
        )
        .to.satisfy(numbers_valid)

        expect(
            [-1, 2, 3, 3]
        )
        .to.satisfy(numbers_valid)
    })

    it("defines invalid collections", () => {
        expect(
            new Set()
        )
        .to.not.satisfy(numbers_valid)

        expect(
            new Set([1,2,3,4,5,6,7,8,9,10,11])
        )
        .to.not.satisfy(numbers_valid)

        expect(
            new Set([1,1])
        )
        .to.not.satisfy(numbers_valid)
    })
})

describe("a collection of distinct strings with an even amount > 0", () => {
    const strings = $coll({
        spec: isString,
        minCount: 1,
        kind: (coll => coll.length % 2 == 0),
        distinct: true,
    })

    const strings_valid = strings.valid.bind(strings)

    it("defines valid collections", () => {
        expect(
            ["this", "is", "even", "!"]
        )
        .to.satisfy(strings_valid)

        expect(
            new Set(["this", "too", "too"])
        )
        .to.satisfy(strings_valid)

        expect([
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
            "k", "l", "m", "n", "o", "p", "q", "r", "s",
            "t", "u", "v", "w", "x", "y", "z"
        ])
        .to.satisfy(strings_valid)
    })

    it("defines invalid collections", () => {
        expect(
            []
        )
        .to.not.satisfy(strings_valid)

        expect(
            ["this", "this"]
        )
        .to.not.satisfy(strings_valid)

        expect(
            ["this", "is", "odd"]
        )
        .to.not.satisfy(strings_valid)
    })
})