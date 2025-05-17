class Registry {
    #specsByNsKey = {}

    contains(nskey) {
        return Object.hasOwn(this.#specsByNsKey, nskey)
    }

    put(nskey, spec) {
        if(this.contains(nskey))
            throw new Error("Registry only registers constant namespaced keys! Namespaced Key: "+nskey)

        this.#specsByNsKey[nskey] = spec
    }

    get(nskey) {
        if(!this.contains(nskey)) throw new Error("Registry does not contain namespaced key: "+nskey)

        return this.#specsByNsKey[nskey]
    }
}

export default new Registry()