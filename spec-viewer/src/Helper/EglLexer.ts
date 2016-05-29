import { LexerFactory, matches, or, TokenWithLen, Handler } from "typed-lexer";

type State = "start" | "inRangeBlock";
type TokenType = "WS" | "Identifier" | "DefinedIdentifier" | "Disj" | "CondDisj" 
    | "Without" | "OpenParen" | "CloseParen" | "Opt" | "Star" | "PosStar" | "ProdDef" | "UnicodePropertyRef"
    | "SingleChar" | "String" | "StringStart" | "StringEnd" | "HexRef" | "Range" | "RangeStart" | "RangeEnd" | "Invalid";


export class EglLexerFactory extends LexerFactory<TokenType, State> {
    constructor() {
        super("start");
        
        const start = matches<State>("start");
        const inRangeBlock = matches<State>("inRangeBlock");

        this.addRuleWithRegexGroups(/([a-zA-Z][a-zA-Z0-9]*)(\s*)(::=)/, [ "DefinedIdentifier", "WS", "ProdDef" ], start);            
        this.addSimpleRule(/[a-zA-Z_][a-zA-Z0-9_]*/, "Identifier", start);
        this.addSimpleRule(/\s+/, "WS", start);

        this.addSimpleRules({
            "||": "CondDisj",
            "|": "Disj",
            ".": "SingleChar",
            "\\": "Without",
            "?": "Opt",
            "*": "Star",
            "+": "PosStar",
            "(": "OpenParen",
            ")": "CloseParen",
            "::=" : "ProdDef",
            "#": "UnicodePropertyRef"
        }, start);
        
        this.addRuleWithRegexGroups(/(")(.*?)(")/,  [ "StringStart", "String", "StringEnd" ], start);
        this.addRuleWithRegexGroups(/(')(.*?)(')/, [ "StringStart", "String", "StringEnd" ], start);
        this.addSimpleRule(/#x[0-9A-F]+/, "HexRef", or(start, inRangeBlock));

        this.addSimpleRule("[", "RangeStart", start, "inRangeBlock");
        this.addSimpleRule("]", "RangeEnd", inRangeBlock, "start");
        this.addSimpleRule("-", "Range", inRangeBlock);
        this.addSimpleRule(/./, "String", inRangeBlock);
        
        this.addSimpleRule(/./, "Invalid", start);
    }
}
