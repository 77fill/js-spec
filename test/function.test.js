import { describe } from "vitest";
import { $and, areDistinct, isInteger } from "../lib/main";
import { expect } from "chai";

class Person {
    constructor(health, energy) {
        this.health = health
        this.energy = energy
    }
}

const attackSpec = $fn({
    namespace: "domain/actions",
    name: "attack",
    args: $and({
        people: $cat({
            source: Person,
            target: Person,
        }),
        "are distinct": areDistinct
    }),
    ret: isInteger,
    function: $and({
        "source has enough energy": ({args: {people}, ret}) => people.source.energy >= ret,
        "no overkill of target": ({args: {people}, ret}) => people.target.health >= ret,
    })
})

const tom = new Person(3, 3)
const jerry = new Person(10, 10)

describe("FUNCTION", () => {
    it("VALID", () => {
        const root = {domain:{actions:{}}}

        root.domain.actions.attack = 
            (source, target) => {
                        if(source.energy >= 2)
                            return Math.min(2, target.health)
                        else
                            return source.energy
                    }

        $instrument(root)

        expect(
            root.domain.actions.attack(tom, jerry)
        )
        .to.not.throw()
    })
})