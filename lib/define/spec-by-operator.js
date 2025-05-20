import spec from "../core-private/spec.js";
import Spec from "../core-private/spec.js";
import toSpec from "../core-private/spec-like.js";

export function $and(...maybeSpecs) {
    const specs = maybeSpecs.map(maybe => toSpec(maybe))

    return new Spec({
        type: "and",
        predicateStringTemplate: children => `and[${specNamesComma(children)}]`,
        children: specs,
        problemFinders: [
            (data, andSpec) =>
                andSpec.children.map(subSpec => subSpec.getProblemTrace(data))
                                .reduce(ProblemTrace.merge)
        ],
    })
}

export function $or(...maybeSpecs) {
    const specs = maybeSpecs.map(maybe => toSpec(maybe))

    return new Spec({
        type: "or",
        predicateStringTemplate: children => `or[${specNamesComma(children)}]`,
        children: specs,
        problemFinders: [
            (data, orSpec) => {
                const traceArrays = orSpec.children.map(subSpec => subSpec.getProblemTrace(data))
                if(traceArrays.length === orSpec.children.length)
                    return traceArrays.reduce(ProblemTrace.merge)
                else
                    return []
            }
        ]
    })
}

export function $not(maybeSpec) {
    const properSpec = toSpec(maybeSpec)

    return new Spec({
        type: "not",
        predicateStringTemplate: children => `not[${specNamesComma(children)}]`,
        children: [properSpec],
        problemFinders: [
            (data, notSpec) => {
                const innerProblemTrace = notSpec.children[0].getProblemTrace(data)

                if(innerProblemTrace.problems.length === 0)
                    return [new ProblemTrace(innerProblemTrace.history)]
                else
                    return [new ProblemTrace([]).withHistory(innerProblemTrace.problems)]
            }
        ]
    })
}

function specNamesComma(specs) {
    return specs.map(spec => spec.name).join(",")
}