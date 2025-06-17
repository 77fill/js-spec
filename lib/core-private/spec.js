import ProblemTrace from "./problem-trace"
import { invalid_symbol } from "./symbols"

export default class Spec {
    pathTag
    subspecConfig
    conformationBubbleFactory
    conformationBubbleAggregator

    constructor({pathTag, subspecConfig, conformationBubbleFactory, conformationBubbleAggregator}) {
        this.pathTag = pathTag
        this.subspecConfig = subspecConfig
        this.conformationBubbleFactory = conformationBubbleFactory
        this.conformationBubbleAggregator = conformationBubbleAggregator
    }

    valid = data => this.makeConformationBubble(data).conformedData === invalid_symbol

    makeConformationBubble(data) {
        if(this.conformationBubbleFactory)
            return this.conformationBubbleFactory(data)

        const bubbles = []
        if(this.subspecConfig) {
            const fatConfigs = 
                this.subspecConfig.map(
                    rawConfig => (
                        cdata => {
                            if(rawConfig instanceof Spec)
                                return {
                                    subspec: rawConfig,
                                    subdata: cdata,
                                }
                            if(typeof rawConfig === "function") {
                                return rawConfig(cdata)
                            }
                        }
                    )
                )

            const configs = flatten(fatConfigs)

            let cdata = data
            for(const config in configs) {
                const {subspec, subdata, dataPathTag, specPathTag} = config(cdata)

                let bubble = subspec.makeConformationBubble(subdata(cdata))

                if(dataPathTag)
                    bubble = bubble.prependDataPathTag(dataPathTag)
                if(specPathTag)
                    bubble = bubble.prependSpecPathTag(specPathTag)

                bubbles.push(bubble)
                cdata = bubble.conformedData
                if(cdata === invalid_symbol)
                    break;
            }
        }

        let bubble
        if(this.conformationBubbleAggregator)
            bubble = this.conformationBubbleAggregator(...bubbles)
        else
            bubble = defaultConformationBubbleAggregator(...bubbles)

        return bubble
    }
} 

function flatten(fatConfigs) {
    const configs = []

    for(const c in fatConfigs) 
        if(Array.isArray(c))
            configs.push(...c)
        else
            configs.push(c)

    return configs
}

class SpecOld {
    #type
    #children
    #problemFinders
    #conform

    // Mutually Exclusive:
    #predicate
    #predicateStringTemplate // children => `bla ${children}`

    constructor(config) {
        this.#type = config.type
        this.#children = config.children
        this.#problemFinders = config.problemFinders

        if(config.conform)
            this.#conform = config.conform
        else
            this.#conform = data => data

        if(config.predicate)
            this.#predicate = config.predicate
        else if(config.predicateStringTemplate)
            this.#predicateStringTemplate = config.predicateStringTemplate

    }

    get predicateString() {
        if(this.#predicate)
            return this.#predicate.toString();
        else if(this.#predicateStringTemplate)
            return this.#predicateStringTemplate(this.#children);
        else
            throw new Error(`Tried to get predicate string from spec of type '${this.#type}'.`)
    }

    getProblemTrace(data) {
        return this.#problemFinders
            .map(finder => finder(data, this))
            .reduce(ProblemTrace.merge)
    }

    conform(data) {
        return this.#conform(data)
    }

    valid(data) {
        const problems = this.getProblemTrace(data).problems
    
        if(problems.length !== 0)
            ;//console.log("spec problems", problems)

        return problems.length === 0
    }

    get children() {
        return this.#children
    }

    get type() {
        return this.#type
    }

    get predicate() {
        return this.#predicate
    }
}

