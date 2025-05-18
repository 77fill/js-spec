import {describe} from "vitest";
import {domain, game} from "./tested-specs.js";
import {$explain} from "../lib/main.js";

describe("explain - complex invalid structures", () => {
    it("tests by composition e.g. map,tuple", () => {
        expect($explain(game.victory, {
            [domain.person]: {
                [domain.firstname]: "Philipp",
                [domain.age]: "no-age-here",
            },
            [game.status]: {
                [game.points]: true,
                [game.difficulty]: {[game.points]: 3}
            }
        })).to.equal(new Set([
            {
                invalidValue: "domain/person",
                path: [domain.person],
                failedPredicate: predicateType.map.hasKey([domain.type]),
                failedSpec: domain.person,
            },
            {
                invalidValue: "no-age-here",
                path: [domain.person, domain.age],
                failedPredicate: "(val) => Number.isInteger(val)",
                failedSpec: domain.age,
            },
            {
                invalidValue: true,
                path: [game.status, game.points],
                failedPredicate: "(val) => Number.isInteger(val)",
                failedSpec: game.points,
            },
            {
                invalidValue: "{[game.points]: 3}",
                path: [game.status, game.difficulty],
                failedPredicate: '(val) => typeof val === "string"',
                failedSpec: game.difficulty,
            }
        ]))
    })
})