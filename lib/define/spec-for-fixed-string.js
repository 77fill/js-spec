import {reify} from "@/lib/core/spec/reify-spec-idea.js";

export function $str(str) {
    return reify(s => s === str)
}