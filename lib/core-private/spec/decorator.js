export class Spec {
    constructor(primitiveSpec) {
        this.primitiveSpec = primitiveSpec
    }

    get name() {
        return this.primitiveSpec.name
    }

    analyse(data) {
        return this.primitiveSpec.analyse(data)
    }

    valid(data) {
        return !! this.analyse(data).problems
    }
}