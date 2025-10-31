import {describe, it} from "vitest";
import {$def} from "@/lib/main.js";
import {expect} from "chai";

describe("the all-important namespaced keys", () => {
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
})