export default class Problem {
    invalidValue
    failedPredicate // String
    failedSpec
    specPath // String[]
    dataPath // String[]

    constructor(config) {
        this.invalidValue = config.invalidValue
        this.failedPredicate = config.failedPredicate
        this.failedSpec = config.failedSpec
        this.specPath = config.specPath
        this.dataPath = config.dataPath
    }

    with(changer) {
        const newProblem = this.clone()
        changer(newProblem)
        return newProblem
    }

    withInvalidValue = val => this.with(p => p.invalidValue = val)
    withFailedPredicate = val => this.with(p => p.failedPredicate = val)
    withSpecPath = val => this.with(p => p.specPath = val)
    withFailedSpec = val => this.with(p => p.failedSpec = val)
    withDataPath = val => this.with(p => p.dataPath = val)

    withPrependedPathTag_specPath = pathTag => 
        this.with(p => p.specPath = [pathTag, ...p.specPath])
    withPrependedPathTag_dataPath = pathTag =>
        this.with(p => p.dataPath = [pathTag, ...p.dataPath])

    clone() {
        return new Problem(this.invalidValue, this.failedPredicate, this.path, this.data, this.failedSpec)
    }
}