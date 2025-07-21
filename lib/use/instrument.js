import registry from '@/lib/core-private/registry'
import instrumentedFunctionFactory from '../core-private/instrumented-fn';

/**
 * Dispatch function
 */
export function instrument(...args) {
    if(args.length === 0)
        nsRootIsGlobalThis()
}

function nsRootIsGlobalThis() {
    registry.getAllFunctionSpecs().forEach(([nskey, fnSpec]) => {
        const nameLength = fnSpec.name.length
        let nsLength = nskey.length - nameLength - 1
        nsLength = Math.max(0, nsLength)

        const ns = nskey.slice(0, nsLength).split("/")

        let innerObj = globalThis
        for(const nsPart in ns) {
            if(innerObj === undefined)
                break;
            innerObj = innerObj[nsPart]
        }

        if(innerObj === undefined || !Object.hasOwn(innerObj, fnSpec.name))
            return;

        innerObj[fnSpec.name] = instrumentedFunctionFactory(fnSpec, innerObj[fnSpec.name])
    });
}