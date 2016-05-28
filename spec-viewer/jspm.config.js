SystemJS.config({
  transpiler: "plugin-typescript",
  meta: {
    "*.tsx": {
      "loader": "plugin-typescript"
    },
    "*.ts": {
      "loader": "plugin-typescript"
    }
  },
  typescriptOptions: {
    "typeCheck": true,
    "tsconfig": true
  },
  packages: {
    "app": {}
  }
});

SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "command-line-args": "npm:command-line-args@2.1.6",
    "constants": "github:jspm/nodelibs-constants@0.2.0-alpha",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "fs-extra": "npm:fs-extra@0.30.0",
    "hashmap": "npm:hashmap@2.0.6",
    "jquery": "npm:jquery@2.2.4",
    "lex": "npm:lex@1.7.9",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "plugin-typescript": "github:frankwallis/plugin-typescript@4.0.1",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "react": "npm:react@0.14.7",
    "react-dom": "npm:react-dom@0.14.7",
    "reflect-metadata": "npm:reflect-metadata@0.1.3",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha"
  },
  packages: {
    "github:frankwallis/plugin-typescript@4.0.1": {
      "map": {
        "typescript": "npm:typescript@1.8.2"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.6.0"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:ansi-escape-sequences@2.2.2": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "collect-all": "npm:collect-all@0.2.1"
      }
    },
    "npm:array-back@1.0.3": {
      "map": {
        "typical": "npm:typical@2.4.2"
      }
    },
    "npm:brace-expansion@1.1.4": {
      "map": {
        "balanced-match": "npm:balanced-match@0.4.1",
        "concat-map": "npm:concat-map@0.0.1"
      }
    },
    "npm:buffer@4.6.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "ieee754": "npm:ieee754@1.1.6",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:collect-all@0.2.1": {
      "map": {
        "stream-connect": "npm:stream-connect@1.0.2",
        "stream-via": "npm:stream-via@0.1.1",
        "typical": "npm:typical@2.4.2"
      }
    },
    "npm:collect-all@1.0.2": {
      "map": {
        "stream-connect": "npm:stream-connect@1.0.2",
        "stream-via": "npm:stream-via@1.0.3"
      }
    },
    "npm:collect-json@1.0.8": {
      "map": {
        "collect-all": "npm:collect-all@1.0.2",
        "stream-connect": "npm:stream-connect@1.0.2",
        "stream-via": "npm:stream-via@1.0.3"
      }
    },
    "npm:column-layout@2.1.4": {
      "map": {
        "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
        "array-back": "npm:array-back@1.0.3",
        "collect-json": "npm:collect-json@1.0.8",
        "command-line-args": "npm:command-line-args@2.1.6",
        "core-js": "npm:core-js@2.4.0",
        "deep-extend": "npm:deep-extend@0.4.1",
        "feature-detect-es6": "npm:feature-detect-es6@1.3.0",
        "object-tools": "npm:object-tools@2.0.6",
        "typical": "npm:typical@2.4.2",
        "wordwrapjs": "npm:wordwrapjs@1.2.0"
      }
    },
    "npm:command-line-args@2.1.6": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "command-line-usage": "npm:command-line-usage@2.0.5",
        "core-js": "npm:core-js@2.4.0",
        "feature-detect-es6": "npm:feature-detect-es6@1.3.0",
        "find-replace": "npm:find-replace@1.0.2",
        "typical": "npm:typical@2.4.2"
      }
    },
    "npm:command-line-usage@2.0.5": {
      "map": {
        "ansi-escape-sequences": "npm:ansi-escape-sequences@2.2.2",
        "array-back": "npm:array-back@1.0.3",
        "column-layout": "npm:column-layout@2.1.4",
        "feature-detect-es6": "npm:feature-detect-es6@1.3.0",
        "typical": "npm:typical@2.4.2",
        "wordwrapjs": "npm:wordwrapjs@1.2.0"
      }
    },
    "npm:feature-detect-es6@1.3.0": {
      "map": {
        "array-back": "npm:array-back@1.0.3"
      }
    },
    "npm:find-replace@1.0.2": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "test-value": "npm:test-value@2.0.0"
      }
    },
    "npm:fs-extra@0.30.0": {
      "map": {
        "graceful-fs": "npm:graceful-fs@4.1.4",
        "jsonfile": "npm:jsonfile@2.3.1",
        "klaw": "npm:klaw@1.2.0",
        "path-is-absolute": "npm:path-is-absolute@1.0.0",
        "rimraf": "npm:rimraf@2.5.2"
      }
    },
    "npm:glob@7.0.3": {
      "map": {
        "inflight": "npm:inflight@1.0.5",
        "inherits": "npm:inherits@2.0.1",
        "minimatch": "npm:minimatch@3.0.0",
        "once": "npm:once@1.3.3",
        "path-is-absolute": "npm:path-is-absolute@1.0.0"
      }
    },
    "npm:inflight@1.0.5": {
      "map": {
        "once": "npm:once@1.3.3",
        "wrappy": "npm:wrappy@1.0.2"
      }
    },
    "npm:minimatch@3.0.0": {
      "map": {
        "brace-expansion": "npm:brace-expansion@1.1.4"
      }
    },
    "npm:object-tools@2.0.6": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "collect-json": "npm:collect-json@1.0.8",
        "object-get": "npm:object-get@2.0.4",
        "test-value": "npm:test-value@1.1.0",
        "typical": "npm:typical@2.4.2"
      }
    },
    "npm:once@1.3.3": {
      "map": {
        "wrappy": "npm:wrappy@1.0.2"
      }
    },
    "npm:react@0.14.7": {
      "map": {
        "fbjs": "npm:fbjs@0.6.1"
      }
    },
    "npm:readable-stream@2.1.4": {
      "map": {
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "string_decoder": "npm:string_decoder@0.10.31",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:rimraf@2.5.2": {
      "map": {
        "glob": "npm:glob@7.0.3"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.4"
      }
    },
    "npm:stream-connect@1.0.2": {
      "map": {
        "array-back": "npm:array-back@1.0.3"
      }
    },
    "npm:test-value@1.1.0": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "typical": "npm:typical@2.4.2"
      }
    },
    "npm:test-value@2.0.0": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "typical": "npm:typical@2.4.2"
      }
    },
    "npm:wordwrapjs@1.2.0": {
      "map": {
        "array-back": "npm:array-back@1.0.3",
        "typical": "npm:typical@2.4.2"
      }
    }
  }
});
