import Spec from "../core-private/spec.js";
import {invalid_symbol} from "../core-private/symbols.js";
import registry from "../core-private/registry.js";
import ProblemTrace from "../core-private/problem-trace.js";
import Problem from "../core-private/problem.js";
import toSpec from "../core-private/spec-like.js";

/**
 * Map entities are defined only via membership of nskeys \
 * (the latter are usually spec'ed and registered) \
 * Structure of the semantics are not defined here!
 * 
 * @see "@/README.md"
 * @see "@/lib/_info.md"
 */
export function $map(...maybeNsKeys) {
    const nskeys = registry.validate(...maybeNsKeys)

    return new Spec({
        type: "map",
        conform: mapConform,
        children: nskeys,
        predicateStringTemplate: children => `map[${children.join(",")}]`,
        problemFinders: [
            checkIfMap,
            checkIfHasAllKeys,
            checkIfKeysHaveValidSemantics,
        ]
    })
}

/**
 * Only 'spec' is mandatory 
 * 
 * @param {Object} config 
 * @param config.spec Spec-Like - mandatory
 * @param config.kind Predicate for the whole collection
 * @param config.into Conformed Type e.g. Array, Set
 */
export function $coll({spec, count, minCount, maxCount, distinct, kind, into}) {
    const spec = toSpec(spec)

    return new Spec({
        type: "collection",
        conform: collConformFactory(into),
        children: {spec, count, minCount, maxCount, distinct, kind},
        predicateStringTemplate: children => `collection[${spec}]`,
        problemFinders: [
            checkIfCollection,
            checkIfCorrectCount,
            checkIfCorrectDistinct,
            checkIfCorrectKind,
            checkIfCorrectSemantics,
        ]
    })
}

function mapConform(data) {
    if(data instanceof Map)
        return Object.fromEntries(data.entries())
    else if(typeof data === "object")
        return data
    else
        return invalid_symbol
}

function collConformFactory(into) {
    return data => {
        if(into === undefined || into === null)
            into = Array

        const dataArray = toArray(data)

        if(into === Array)
            return dataArray
        else if(into === Set)
            return new Set(dataArray)
        else
            throw new Error(`"into" argument of value "${into}" is not supported!`)
    }
}

function checkIfMap(data, mapSpec) {
    if(mapConform(data) === invalid_symbol)
        return new ProblemTrace({
            invalidValue: data,
            failedPredicate: 'map?',
            failedSpec: mapSpec,
            specPath: [],
            dataPath: [],
        })

    return new ProblemTrace([])
}

function checkIfCollection(data, collSpec) {
    const collection = collConform(data)

    if(collection === invalid_symbol)
        return new ProblemTrace({
            invalidValue: data,
            failedPredicate: 'coll?',
            failedSpec: collSpec,
            specPath: [],
            dataPath: [],
        })
    
    return new ProblemTrace([])
}

function checkIfCorrectCount(data, collSpec) {
    const collection = collConform(data)
    if(collection === invalid_symbol)
        return new ProblemTrace([])

    const array = toArray(data)

    const {count, maxCount, minCount} = collSpec.children

    const problems = []

    if(maxCount && array.length > maxCount)
        problems.push(new Problem({
            invalidValue: data, 
            failedPredicate: `count <= ${maxCount}`, 
            failedSpec: collSpec, 
            dataPath: [], 
            specPath: ["maxCount"]
        }))
    
    if(minCount && array.length < minCount)
        problems.push(new Problem({
            invalidValue: data, 
            failedPredicate: `count >= ${minCount}`, 
            failedSpec: collSpec, 
            dataPath: [], 
            specPath: ["minCount"]
        }))
    
    if(count && array.length !== count)
        problems.push(new Problem({
            invalidValue: data, 
            failedPredicate: `count === ${count}`, 
            failedSpec: collSpec, 
            dataPath: [], 
            specPath: ["count"]
        }))

    return new ProblemTrace(problems)
}

function checkIfCorrectDistinct(data, collSpec) {
    const collection = collConform(data)
    if(collection === invalid_symbol)
        return new ProblemTrace([])

    const array = toArray(data)

    const distinct = collSpec.children.distinct

    if(!distinct || array.length === new Set(array).size())
        return new ProblemTrace([])

    /**
     * all elements in 'array' which have a duplicate at their left \
     * together with their index \
     * [[3, 'a'], [7, 'b'], ...]
     */ 
    const mistakes = array.reduce(
        (acc, val, i, arr) => (
            arr.any((elem,j) => elem == val && j < i)?
                [...acc, [i, val]]
                :acc
        ),
        []
    )

    return new ProblemTrace(
        mistakes.map(([i,val]) => new Problem({
            invalidValue: val,
            failedPredicate: 'distinct?',
            failedSpec: collSpec,
            dataPath: [i],
            specPath: ["distinct"]
        }))
    )
}

function checkIfCorrectKind(data, collSpec) {
    if(collSpec.children.kind(data))
        return new ProblemTrace([])
    else
        return new ProblemTrace({
            invalidValue: data,
            failedPredicate: collSpec.children.kind.toString(),
            failedSpec: collSpec,
            dataPath: [],
            specPath: ["kind"],
        })
}

function checkIfCorrectSemantics(data, collSpec) {
    const collection = collConform(data)
    if(collection === invalid_symbol)
        return new ProblemTrace([])

    const array = toArray(data)

    return array
            .map((elem,i) => [i, collSpec.children.spec.getProblemTrace(elem)])
            .map(([i, ptrace]) => ptrace.withPrependedPathTag_dataPath(i))
            .reduce(ProblemTrace.merge)
            .withPrependedPathTag_specPath(collSpec.children.spec)
}

function toArray(coll) {
    if(Array.isArray(coll))
        return coll
    if(coll instanceof Set)
        return [...coll.values()]
    else
        throw new Error(`Data "${coll}" could not be interpreted as a collection; could not be turned into an array`)
}

function checkIfHasAllKeys(data, mapSpec) {
    const map = mapConform(data)
    if(map === invalid_symbol)
        return new ProblemTrace([])

    const dataKeys = Object.keys(map)
    const missingKeys = mapSpec.children.filter(mustKey => !dataKeys.includes(mustKey))

    if(missingKeys.length === 0)
        return new ProblemTrace([])

    return new ProblemTrace({
        invalidValue: data,
        failedPredicate: `includes[${missingKeys.join(",")}]`,
        failedSpec: mapSpec,
        dataPath: [],
        specPath: [],
    })
}

function checkIfKeysHaveValidSemantics(data, mapSpec) {
    const map = mapConform(data)
    if(map === invalid_symbol)
        return new ProblemTrace([])

    return Object.entries(map)
                .filter(([nskey, _]) => registry.contains(nskey))
                .map(([nskey,val]) => [nskey, registry.get(nskey).getProblemTrace(val)])
                .map(([nskey, ptrace]) => ptrace.withPrependedPathTag_dataPath(nskey))
                .reduce(ProblemTrace.merge)
}