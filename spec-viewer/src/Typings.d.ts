/// <reference path="../jspm_packages/npm/reflect-metadata@0.1.3/reflect-metadata.d.ts" />


declare module "hashmap" {
    
    class HashMap<TKey, TValue> {
        public get(key: TKey): TValue;
        public set(key: TKey, value: TValue): this;
        public multi(arg: (TKey|TValue)[]): this;
        public has(key: TKey): boolean;
        public remove(key: TKey): this;
        public count(): number;
        public clear(): this;
        public values(): TValue[];
        public keys(): TKey[];
        public search(value: TValue): TKey;
    }
    
    export = HashMap;
}


declare module "command-line-args" {
    
    class CLI {
        public parse(): any;
    }
    
    interface Options {
        name: string;
        alias?: string;
        type: any;
        multiple?: boolean;
        defaultOption?: boolean;
    }
    
    type CommandLineArgs = (options: Options[]) => CLI;
    
    var x: CommandLineArgs;
    export = x;
}