import { describe } from "vitest";
import { $valid, areDistinct, isInteger } from "../lib/main";
import { expect } from "chai";

class Person {
    constructor(health, energy) {
        this.health = health
        this.energy = energy
    }
}

const attackSpec = $fn({
    name: "attack",
    args: (source, target) => 
        $valid(
            [Person, source], 
            [Person, target], 
            [areDistinct, [source,target]],
        ),
    ret: isInteger,
    function: 
        ({args, ret}) => 
            args[0].energy >= ret 
            && args[1].health >= ret
})

const tom = new Person(3, 3)
const jerry = new Person(10, 10)

describe("FUNCTION", () => {
    it("VALID", () => {
        expect(
            (source, target) => {
                if(source.energy >= 2)
                    return Math.min(2, target.health)
                else
                    return source.energy
            }
        )
        .to.satisfy(
            attack => {
                const instrumentedAttack = $fn(attackSpec, attack)

                return $valid(
                    instrumentedAttack, [tom, jerry]
                )
            }
        )
    })
})