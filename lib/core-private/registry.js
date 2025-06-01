class Registry {
    #specsByNsKey = {}

    contains(nskey) {
        return Object.hasOwn(this.#specsByNsKey, nskey)
    }

    lacks(nskey) {
        return !this.contains(nskey)
    }

    put(nskey, spec) {
        if(this.contains(nskey))
            throw new Error(`Registry only registers constant namespaced keys! Namespaced Key: "${nskey}"`)

        this.#specsByNsKey[nskey] = spec
    }

    get(nskey) {
        if(this.lacks(nskey)) throw new Error(`Registry does not contain namespaced key: "${nskey}"`)

        return this.#specsByNsKey[nskey]
    }

    validate(...maybeNsKeys) {
        const error =
            maybeNsKeys
                .filter(this.lacks)
                .map(k => `"${k}"`)
                .join(", ")

        if(error) throw new Error(`Registry does not contain the following namespaced keys: ${error}`)

        return maybeNsKeys
    }
}

export default new Registry()