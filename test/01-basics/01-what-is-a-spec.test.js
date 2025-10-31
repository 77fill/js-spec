import {describe, test} from "vitest";
import {reify} from "@/lib/core/spec/reify-spec-idea.js";
import {expect} from "chai";
import {$def, isString} from "@/lib/main.js";

describe('What is a spec?', () => {
    describe(`
            it comes from an -idea- which is "reified" into a spec
            
            it is a specification of the type and structure of data
            
            it can be called like a function to validate data (among other things)
            
        `, () => {
        test('the -idea- can be a predicate function', () => {
            const predicate = num => num % 2 === 0

            const spec = reify(predicate)

            expect(spec(88888)).to.be.true

            // OR

            expect(88888).to.satisfy( spec )
        })

        test(', a fixed value that is matched by the data exactly', () => {
            const fixedNumber = 42
            const fixedSymbol = Symbol("unique")
            const fixedBoolean = true

            // No Strings! They have a special purpose instead!

            expect(42)                          .to.satisfy(reify(fixedNumber))
            expect(fixedSymbol)                     .to.satisfy(reify(fixedSymbol))
            expect(true)                        .to.satisfy(reify(fixedBoolean))
        })

        test(', an array of possible values for the data', () => {
            const possibleValues = ["this one", "or this one"]

            expect("this one").to.satisfy(reify(possibleValues))
        })

        test(', a regex', () => {
            const lowerCaseLetter = /^[a-z]$/

            expect("p").to.satisfy(reify(lowerCaseLetter))
        })

        test(', a class which the data is an instance of', () => {
            class Person {}

            expect(new Person()).to.satisfy(reify(Person))
        })

        /**
         * See the next test file
         */
        test('or a registered namespaced key', () => {
            const person = $def("person", {
                name: isString
            })

            expect("Tom").to.satisfy(reify("person/name"))

            // OR

            expect("Tom").to.satisfy(reify(person.name))
        })
    })
})