import {describe, it} from "vitest";
import {$def} from "@/lib/main.js";
import {expect} from "chai";

describe("the all-important namespaced keys", () => {
    const spec = val => val === "42"

    it("registers key names", () => {
        expect(() => {
            $def("namespace_name", {
                "key_name": spec,
                "alpha-_123": spec,
                "firstname": spec,
                "age": spec,
            })
        })
            .to.not.throw()
    })

    it("fails at registering key names", () => {
        expect(() =>
            $def("domain", {"hierarchy/test": spec})    ).to.throw()
        expect(() =>
            $def("domain", {"age+*": spec})             ).to.throw()
        expect(() =>
            $def("domain", {"/height": spec})           ).to.throw()
        expect(() =>
            $def("domain", {"hierarchy/": spec})        ).to.throw()
        expect(() =>
            $def("domain", {"": spec})                  ).to.throw()
    })
})