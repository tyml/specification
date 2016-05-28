
import { LexerFactory, matchesAny, matchesWith, TokenWithLen } from "./Lexer.ts";

type State = "inRangeBlock";
type TokenType = "WS" | "Identifier" | "DefinedIdentifier" | "Disj" | "CondDisj" 
    | "Without" | "OpenParen" | "CloseParen" | "Opt" | "Star" | "PosStar" | "ProdDef" | "UnicodePropertyRef"
    | "SingleChar" | "String" | "StringStart" | "StringEnd" | "HexRef" | "Range" | "RangeStart" | "RangeEnd";

const start = matchesWith<State>(null);
const inRangeBlock = matchesWith<State>("inRangeBlock");

export class EglLexerFactory extends LexerFactory<TokenType, State> {
    
    constructor() {
        
        super();
        
        let lexerFactory = this;
        
        lexerFactory.addRule(/([a-zA-Z][a-zA-Z0-9]*)(\s*)(::=)/, 
            (m, r, state, g) => r.tokensWithLen([tWLen("DefinedIdentifier", g[1].length), tWLen("WS", g[2].length), tWLen("ProdDef", g[3].length)]), start);
            
        lexerFactory.addRule(/[a-zA-Z_][a-zA-Z0-9_]*/, (m, r) => r.token("Identifier"), start);
        lexerFactory.addRule(/\s+/, (m, r) => r.token("WS"), start);

        const chars: { [char: string]: TokenType } = {
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
        };
        for (const c in chars) 
            lexerFactory.addRule(c, (m, ret) => ret.token(chars[c]), start);

        function tWLen(token: TokenType, length: number): TokenWithLen<TokenType> {
            return { token: token, length: length };
        }

        lexerFactory.addRule(/".*?"/, (m, r) => r.tokensWithLen([tWLen("StringStart", 1), tWLen("String", m.length - 2), tWLen("StringEnd", 1)]), start);
        lexerFactory.addRule(/'.*?'/, (m, r) => r.tokensWithLen([tWLen("StringStart", 1), tWLen("String", m.length - 2), tWLen("StringEnd", 1)]), start);

        lexerFactory.addRule(/#x[0-9A-F]+/, (m, r) => r.token("HexRef"), matchesAny<State>([null, "inRangeBlock"]));

        lexerFactory.addRule("[", (m, r) => r.token("RangeStart", "inRangeBlock"), start);
        lexerFactory.addRule("]", (m, r) => r.token("RangeEnd", null), inRangeBlock);
        lexerFactory.addRule("-", (m, r) => r.token("Range"), inRangeBlock);
        lexerFactory.addRule(/./, (m, r) => r.token("String"), inRangeBlock);
        
    }
    
}
