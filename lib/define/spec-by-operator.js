import Spec from "../core-private/spec.js";
import toSpec from "../core-private/spec-like.js";
import ProblemTrace from "../core-private/problem-trace.js";

export function $and(namesWithSpecLikes) {
    for(const name in namesWithSpecLikes)
        namesWithSpecLikes[name] = toSpec(namesWithSpecLikes[name])

    return new Spec({
        type: "and",
        predicateStringTemplate: children => `and{${specNamesComma(children)}}`,
        children: namesWithSpecLikes,
        problemFinders: [
            (data, andSpec) =>
                Object.entries(andSpec.children)
                        .map(([name, subspec]) => [name, subspec.getProblemTrace(data)])
                        .map(([name, ptrace]) => ptrace.withPrependedPathTag_specPath(name))
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
                const traceArrays = 
                    orSpec.children
                        .map((subSpec, i) => [i, subSpec.getProblemTrace(data)])
                        .map(([i, ptrace]) => ptrace.withPrependedPathTag_specPath(i))                
                if(traceArrays.filter(trace => trace.problems.length).length === orSpec.children.length)
                    return traceArrays.reduce(ProblemTrace.merge)
                else
                    return new ProblemTrace([])
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
                    return innerProblemTrace
                        .historical()
                        .addProblem({
                            invalidValue: data,
                            failedPredicate: notSpec.predicateString,
                            failedSpec: notSpec,
                            specPath: [],
                            dataPath: [],
                        })
                else
                    return innerProblemTrace.withArchivedProblems()
            }
        ]
    })
}

function specNamesComma(namesWithSpec) {
    return Object.entries(namesWithSpec)
                .map(([key,val]) => `${key}: ${val}`)
                .join(",\n")
}