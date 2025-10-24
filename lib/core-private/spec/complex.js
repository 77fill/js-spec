import {defaultAnalysesAggregator} from "@/lib/core-private/defaults/analyses-aggregator.js";
import {isSpec} from "@/lib/core-private/spec/is-spec.js";

/**
 * Consists of subordinate specs<br>
 * The aggregator combines their Analysis objects into one
 */
export class ComplexSpec {
    /**
     * @param subspecs array of: spec OR Array<spec>
     */
    constructor({name, subspecs, aggregateAnalyses = defaultAnalysesAggregator}) {
        this.name = name
        this.subspecs = subspecs
        this.aggregateAnalyses = aggregateAnalyses
    }

    /**
     * @return Analysis
     */
    analyse(data) {
        const properSpecs = [
            ...this.subspecs.filter(isSpec),
            [].concat(...this.subspecs.filter(s => !isSpec(s))) // flatten Array<Array<spec>>
        ]

        const analyses = properSpecs.map(spec => spec.analyse(data))

        return this.aggregateAnalyses(analyses)
    }

}