class Registry {
    #specs = {}

    contains(key) {
        return Object.hasOwn(this.#specs, key)
    }

    put(key, spec) {
        if(this.contains(key))
            throw new Error("Registry only registers constant keys! Key: "+key)

        this.#specs[key] = spec
    }

    get(key) {
        if(!this.contains(key)) throw new Error("Registry does not contain key: "+key)

        return this.#specs[key]
    }
}

export default new Registry()