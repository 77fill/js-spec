import {describe, test} from "vitest";
import {$def, $map, isString} from "@/lib/main.js";
import {expect} from "chai";

describe("the all-important namespaced keys", () => {
    test(`
        Ultimate Usage: specifying map entities
        
        However: 
            Only key names are specified! 
            Then the keys themselves are specified separately!
            
        Reason: see Readme.md
    `, () => {
        const aMapEntity = {
            "person/firstname": "Tom",
            "person/lastname": "Mayer",
        }

        const personNamespace = $def("person", {
            firstname: isString,
            lastname: isString,
        })

        const mapSpec = $map("person/firstname", "person/lastname")

        expect(aMapEntity).to.satisfy(mapSpec)
    })
})