import { describe, it } from "vitest";
import $def from "../../lib/define/keys-that-are-spec_ed";
import { expect } from "chai";
import { isInteger, isString } from "../../lib/util/predicates";

describe("valid expressions", () => {
    it("creates namespaces", () => {
        expect(() => {
            $def("namespace_name", {})
            $def("domain", {})
            $def("alpha-_123", {})
            $def("hierarchy_top/hierarchy_bottom", {})
            $def("special/hidden-power/person", {})
        })
        .to.not.throw()
    })

    it("registers key names", () => {
        expect(() => {
            $def("namespace_name", {
                "key_name": isString,
                "alpha-_123": isString,
                "firstname": val => typeof val === "string",
                "age": val => typeof val === "number",
            })
        })
        .to.not.throw()
    })
})

describe("invalid expressions", () => {
    it("fails at creating namespaces", () => {
        expect(() => 
            $def("domain/", {})         ).to.throw()
        expect(() => 
            $def("domain//", {})        ).to.throw()
        expect(() => 
            $def("/domain", {})         ).to.throw()
        expect(() => 
            $def("domain//person", {})  ).to.throw()
        expect(() => 
            $def("", {})                ).to.throw()
    })

    it("fails at registering key names", () => {
        expect(() => 
            $def("domain", {"hierarchy/test": isString})    ).to.throw()
        expect(() => 
            $def("domain", {"age+*": isString})             ).to.throw()
        expect(() => 
            $def("domain", {"/height": isInteger})          ).to.throw()
        expect(() => 
            $def("domain", {"hierarchy/": isString})        ).to.throw()
        expect(() => 
            $def("domain", {"": isString})                  ).to.throw()
    })
})