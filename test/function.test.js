import { describe } from "vitest";
import { $valid, areDistinct, isInteger } from "../lib/main";
import { expect } from "chai";

class Person {
    energy
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
    function: ({args, ret}) => args[0].energy >= ret
})

describe("FUNCTION", () => {
    it("VALID", () => {
        expect((source, target) => {
            if(source.energy >= 2)
                return Math.min(2, target.energy)
            else
                return source.energy
        })
        .to.satisfy(attack => $valid(attackSpec, attack))
    })
})