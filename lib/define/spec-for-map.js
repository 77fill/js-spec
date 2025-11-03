import registry from "@/lib/core/registry-of-specs/registry.js";
import {ComplexSpec} from "@/lib/core/spec/complex.js";
import zip from "@/lib/util/zip.js";
import Spec from "@/lib/core/spec/base.js";
import PredicateAdvancedSpec, {fail, success} from "@/lib/core/spec/predicate-advanced.js";
import {defaultAnalysesAggregator} from "@/lib/core/analysis-by-spec/default-analyses-aggregator.js";

/**
 * Defines only membership of namespaced keys (not the values!)
 *
 *      {
 *          must_have_this_key: WHATEVER,
 *          this_one_as_well: WHATEVER
 *      }
 *
 * The value schema is defined separately for the nskeys via $def.
 *
 * 'Map' is an abstract idea here, not (necessarily) an instance of Map
 *
 * @see "@/README.md" - TODO: see philosophy
 * @see "@/lib/_info.md"
 *
 * TODO: see test
 */
export function $map(...nskeys) {
    registry.validate(...nskeys)

    return new ComplexSpec({
        name: "map",
        subspecs: [
            reallyMap(),
            hasKeys(nskeys),
            validValues(),
        ]
    })
}

// SUB-SPECS

/**
 * For all subspecs after this one \
 * Assume `typeof data === 'object'`
 * Because it's actually a pipeline
 */
function reallyMap() {
    return new PredicateAdvancedSpec(
        data => {
            if(typeof data !== "object")
                return fail("object?")
            else if(data instanceof Map)
                return success(Object.fromEntries(data.entries()))
            else
                return success(data)
        }
    )
}

function hasKeys(keys) {
    return new PredicateAdvancedSpec(
        data => {
            const dataKeys = Object.keys(data)
            const missingKeys = keys.filter(mustKey => !dataKeys.includes(mustKey))

            if(missingKeys.length === 0)
                return success(data)
            else
                return fail(`includes[${missingKeys.join(",")}]`)
        }
    )
}

/**
 * Needs to generate analyses for all nskeys \
 * And prepend the problem paths with 'key_name'
 *
 * Data:
 *
 *      {
 *          a: 2, // spec: be even
 *          b: 5, // spec: be even
 *          c: 7, // spec: be odd
 *      }
 *
 * Analysis:
 *
 *      [
 *          Problem({
 *              dataPath: 'b'
 *          })
 *      ]
 *
 * Data path of a more complex scenario might be: 'b.inner_key.inner_blah'
 */
function validValues() {
    return new Spec({
        name: "validValues",
        analyse: data => {
            const nskeys = Object.keys(data).filter(key => registry.contains(key))

            const analyses =
                zip(nskeys, nskeys)
                    .map(to_nskey_and_itsSpec())
                    .map(to_nskey_and_analysis(data))
                    .map(to_analysis_with_updated_problem_path())

            return defaultAnalysesAggregator(analyses)
        }
    })
}

// MAPPING FUNCTIONS

function to_nskey_and_itsSpec() {
    return ([key1, key2]) => [key1, registry.get(key2)]
}

function to_nskey_and_analysis(data) {
    return ([key, spec]) => [key, spec.analyse(data[key])]
}

function to_analysis_with_updated_problem_path() {
    return ([key, analysis]) => analysis.allProblemPaths().forData().prepend(key)
}