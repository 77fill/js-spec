export default class Problem {
    invalidValue
    failedPredicate
    path
    data
    failedSpec

    constructor(invalidValue, failedPredicate, path, data, failedSpec) {
        this.invalidValue = invalidValue
        this.failedPredicate = failedPredicate
        this.path = path
        this.data = data
        this.failedSpec = failedSpec
    }

    with(changer) {
        const newProblem = this.clone()
        changer(newProblem)
        return newProblem
    }

    withInvalidValue = val => this.with(p => p.invalidValue = val)
    withFailedPredicate = val => this.with(p => p.failedPredicate = val)
    withPath = val => this.with(p => p.path = val)
    withFailedSpec = val => this.with(p => p.failedSpec = val)
    withData = val => this.with(p => p.data = val)

    withPrependedPathTag = pathTag => this.with(p => p.path = [pathTag, ...p.path])

    clone() {
        return new Problem(this.invalidValue, this.failedPredicate, this.path, this.data, this.failedSpec)
    }
}