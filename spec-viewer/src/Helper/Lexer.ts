export interface Result<TToken, TState> {
    typeDiscriminator: string;
}

export interface TokenWithPosAndLen<TToken> {
    token: TToken;
    startPos: number;
    length: number;
}

export interface TokenWithLen<TToken> {
    token: TToken;
    length: number;
}

export interface ResultFactory<TToken, TState> {
    tokens(tokens: TToken[], nextState?: TState): Result<TToken, TState>;
    tokensWithPos(tokens: TokenWithPosAndLen<TToken>[], nextState?: TState): Result<TToken, TState>;
    tokensWithLen(tokens: TokenWithLen<TToken>[], nextState?: TState): Result<TToken, TState>;
    token(token: TToken, nextState?: TState): Result<TToken, TState>;
    state(nextState: TState): Result<TToken, TState>;
}

export type HandlerResult<TToken, TState> = Result<TToken, TState> | boolean;
export type Handler<TToken, TState> = (matched: string, ret: ResultFactory<TToken, TState>, state: TState, matchedGroups: RegExpExecArray) => HandlerResult<TToken, TState>;
export type Predicate<T> = (v: T) => boolean;


function isString(a: any): a is string { return typeof(a) === "string"; }
function isBool(a: any): a is boolean { return typeof(a) === "boolean"; }

class ResultFactoryImplementation<TToken, TState> implements ResultFactory<TToken, TState> {
    
    public static instance = new ResultFactoryImplementation();
    
    public matchedString: string;
    
    
    public tokensWithPos(tokens: TokenWithPosAndLen<TToken>[], nextState?: TState): ResultImplementation<TToken, TState> {
        const r = new ResultImplementation<TToken, TState>();
        r.nextState = nextState;
        r.matchedString = this.matchedString;
        r.tokens = tokens;
        return r;
    }

    public tokens(tokens: TToken[], nextState?: TState): ResultImplementation<TToken, TState> {

        if (tokens.length == 0)
            return this.tokensWithPos([], nextState);
            
        let t2 = tokens.map<TokenWithPosAndLen<TToken>>(t => ({ token: t, startPos: 0, length: 0 }));
        
        t2[t2.length - 1].length = this.matchedString.length;
    }

    public tokensWithLen(tokens: TokenWithLen<TToken>[], nextState?: TState): ResultImplementation<TToken, TState> {
        
        const t2 = tokens as TokenWithPosAndLen<TToken>[];
        
        let pos = 0;
        for (const t of t2) {
            t.startPos = pos;
            pos += t.length;
        }
        
        return this.tokensWithPos(t2, nextState);
        
    }
    
    public token(token: TToken, nextState?: TState): ResultImplementation<TToken, TState> { 
        return this.tokensWithPos([{ token: token, startPos: 0, length: this.matchedString.length }], nextState);
    }
    
    public state(nextState: TState): ResultImplementation<TToken, TState> {
        return this.tokensWithPos([], nextState);
    }
}


class ResultImplementation<TToken, TState> implements Result<TToken, TState> {
    
    public typeDiscriminator: string;
    
    public tokens: TokenWithPosAndLen<TToken>[];
    public nextState: TState; // |undefined
    
    public matchedString: string;
}


class Rule<TToken, TState> {
    
    private matchStr: string;
    private matchRegex: RegExp;
    
    constructor(regex: RegExp|string, private handler: Handler<TToken, TState>, private statePredicate?: Predicate<TState>) {
        if (isString(regex))
            this.matchStr = regex;
        else 
            this.matchRegex = new RegExp("^" + regex.source);
    }
/*|null*/
    public match(str: string, state: TState): ResultImplementation<TToken, TState>  {
        
        if (!this.statePredicate(state)) return null;
        
        let m: string;
        
        let matchedGroups: RegExpExecArray = null;
        
        if (this.matchStr) {
            const str2 = str.substr(0, this.matchStr.length);
            if (str2 !== this.matchStr) return null;
            m = this.matchStr;
        }
        else {
            matchedGroups = this.matchRegex.exec(str);
            if (matchedGroups == null || matchedGroups.length == 0) return null;
            m = matchedGroups[0];
        }
        
        const i = ResultFactoryImplementation.instance as ResultFactoryImplementation<TToken, TState>;
        i.matchedString = m; // I know that this is not state of the art. :)
        let result = this.handler(m, i, state, matchedGroups) as (ResultImplementation<TToken, TState> | boolean);
        
        if (isBool(result)) {
            if (!result) return null;
            return i.tokens([], state);
        }
        else {
            if (result.nextState === undefined)
                result.nextState = state;
            return result;
        }
    }
}


export class LexerFactory<TToken, TState> {
    
    private rules: Rule<TToken, TState>[] = [];

    public addRule(regex: RegExp|string, handler: Handler<TToken, TState>, statePredicate?: Predicate<TState>): this {
        
        this.rules.push(new Rule<TToken, TState>(regex, handler, statePredicate));
        
        return this;
    }
    
    public getLexerFor(input: string, startState?: TState): Lexer<TToken, TState> {
        if (startState === undefined)
            startState = null;
            
        return new Lexer<TToken, TState>(input, this.rules, startState);
    }
    
}

interface TokenWithStr<TToken> {
    token: TToken;
    str: string;
}


export class Lexer<TToken, TState> {

    
    private pos: number = 0;
    private curT:  TokenWithPosAndLen<TToken> = null;
    private restrainedT: TokenWithPosAndLen<TToken>[] = [];
    
    constructor(private inputStr: string, private rules: Rule<TToken, TState>[], private state: TState) {
        
    }
    
    
    public readAll(): TToken[] {
        
        const result: TToken[] = [];
        while (true) {
            let cur = this.next();
            if (cur == undefined)
                break;
            result.push(cur);
        }
        
        return result;
    }
    
    public readAllWithStr(): TokenWithStr<TToken>[] {
        
        const result: TokenWithStr<TToken>[] = [];

        while (true) {
            let cur = this.next();
            if (cur == undefined)
                break;
            result.push({ token: cur, str: this.inputStr.substr(this.cur.startPos, this.cur.length) });
        }
        
        return result;
    }
    
    
    
    
    
    public get input(): string { return this.inputStr; }
    
    public next(): TToken {
        
        if (this.restrainedT.length == 0) {
            
            var curStr = this.inputStr.substr(this.pos);
            
            if (curStr.length == 0) {
                this.curT = undefined;
                return undefined;
            }
            
            let mr: ResultImplementation<TToken, TState> = null;
            
            for (const r of this.rules) {
                mr = r.match(curStr, this.state);
                if (mr != null) break;
            }
            
            if (mr == null) throw new Error(`${curStr} could not be matched!`);
            
            for (const t of mr.tokens)
                t.startPos += this.pos;
            
            this.pos += mr.matchedString.length;
            this.state = mr.nextState;
            
            this.restrainedT.push(...mr.tokens);
        }
        
        this.curT = this.restrainedT.shift();
        return this.curT ? this.curT.token : undefined;
    }
    
    public get cur(): TokenWithPosAndLen<TToken> {
        return this.curT;
    }
    
    public get curState(): TState {
        return this.state;
    }
    
    public get restrained(): TokenWithPosAndLen<TToken>[] {
        return this.restrainedT;
    }
}

export function matchesWith<T>(withElement: T): Predicate<T> { return (t) => t == withElement; }
export function matchesAny<T>(withElements: T[]): Predicate<T> { return (t) => withElements.some(w => t == w); }