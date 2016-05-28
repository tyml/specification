import { TemplateField, TemplateType, ArrayType, StringType, UnionType, FieldOptions, ImplicitTemplateField } from "./Helper/Annotations.ts";
import * as React from "react";
import { EglLexerFactory } from "./Helper/EglLexer.ts";
 
function MyTemplateType() {
    return TemplateType("tyml.org/spec/0.9");
}  


function extend<T>(obj: any, parent: T): T {
	for (const x in parent)
		if (obj[x] === undefined)
			obj[x] = (parent as any)[x];
	return obj;
}

function formatCode(code: string): string {
	var codeLines = code.split(/\r\n|\n/);
	var minWhitespaces = code.length;

	var start = -1;
	var end = -1;
	codeLines.forEach((line, idx) => {
		var c = 0;
		while (c <= line.length && line.charAt(c) === " ") { c++; }

		if (c !== line.length) {
			if (c < minWhitespaces) minWhitespaces = c;
			if (start === -1) start = idx;
			end = idx;
		}
	});

	var result = "";
	codeLines.forEach((line, idx) => {
		if (idx < start || idx > end) return;

		var c = 0;
		while (c <= line.length && line.charAt(c) === " ") { c++; }

		for (var i = minWhitespaces; i < line.length; i++) {
			result += line.charAt(i);
		}
		if (idx != end) result += "\n";
	});

	return result;
}

type HtmlElement = JSX.Element | JSX.Element[];

function elToArr(e: HtmlElement): JSX.Element[] {
	if (Array.isArray(e))
		return e;
	return [e] as any;
}


interface HtmlRenderState {
	chapterDepth: number;
	referenceManager: ReferenceManager;
}

class ReferenceManager {
	
	public register(name: string) {
		
	}
	
	public getId(name: string) {
		return name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
	}
}



@UnionType({ unitedArrayTypes:[() => ContentArray], unitedStringTypes:[() => ContentString] })
export abstract class Content {
	
	public renderToHtmlWithDefaultState(): HtmlElement {
		return this.renderToHtml({ chapterDepth: 1, referenceManager: new ReferenceManager() });
	}
	
	public abstract renderToHtml(state: HtmlRenderState): HtmlElement;
	public abstract canInParagraph(): boolean;
	
	public register(refMngr: ReferenceManager) {
		this.getChildren().forEach(c => c.register(refMngr));
	}
	
	public getChildren(): Content[] { return []; }
}

@MyTemplateType()
class Specification extends Content {
	@TemplateField()
	public title: string;
	
	@TemplateField()
	public content: Content;
	
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		
		this.register(state.referenceManager);
		
		return [
			<h1>{this.title}</h1>,
			...elToArr(this.content.renderToHtml(extend({ chapterDepth: 2 }, state)))
		];
	}
	
	public canInParagraph() { return false; }
	
	public getChildren(): Content[] { return [ this.content ]; }
}


@MyTemplateType()
class Section extends Content {
	@ImplicitTemplateField()
	public title: Content;
	
	@ImplicitTemplateField()
	public content: Content;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		const Hn = `h${state.chapterDepth}` as any;
		
		return [
			<Hn> { this.title.renderToHtml(state) } </Hn>,
			...elToArr(this.content.renderToHtml(extend({ chapterDepth: state.chapterDepth + 1 }, state))) 
		];
	}
	
	public canInParagraph() { return false; }
	
	public getChildren(): Content[] { return [ this.content ]; }
}

@MyTemplateType()
class Null extends Content {
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<span className="null">Null</span>
		);
	}
	
	public canInParagraph() { return true; }
}

@MyTemplateType()
class Reference extends Content {
	@ImplicitTemplateField()
	public referenced: string;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<span className="reference">{ this.referenced }</span>
		);
	}
	
	public canInParagraph() { return true; }
}

@MyTemplateType()
class Keyword extends Content {
	@ImplicitTemplateField()
	public word: string;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<span className="keyword">{ this.word }</span>
		);
	}
	
	public canInParagraph() { return true; }
}

@MyTemplateType()
class Definition extends Content {
	@ImplicitTemplateField()
	public defines: string;
	
	@ImplicitTemplateField()
	public content: Content;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<div className="panel definition">
				<div className="panel-heading">Definition: { this.defines }</div>
				<div className="panel-body">{ this.content.renderToHtml(state) }</div>	
			</div>
		);
	}
	
	public canInParagraph() { return false; }
	
	public register(refMngr: ReferenceManager) { 
		refMngr.register(this.defines); 
		super.register(refMngr);
	}
	
	public getChildren(): Content[] { return [ this.content ]; }
}

@MyTemplateType()
class Constraint extends Content {
	@ImplicitTemplateField()
	public type: string;
	
	@ImplicitTemplateField()
	public constraint: Content;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<div className="panel constraint">
				<div className="panel-heading">Constraint: { this.type }</div>
				<div className="panel-body">{ this.constraint.renderToHtml(state) }</div>	
			</div>
		);
	}
	
	public canInParagraph() { return false; }
	
	public getChildren(): Content[] { return [ this.constraint ]; }
}

@MyTemplateType()
class Productions extends Content {
	@ImplicitTemplateField()
	public productions: string;
	
	public set(value: string) {
		this.productions = value;
	} 
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		
		const lexer = new EglLexerFactory().getLexerFor(formatCode(this.productions));
		const items: JSX.Element[] = [];
		for (const el of lexer.readAllWithStr()) {
			
			const className = "token-" + el.token;
			
			if (state.referenceManager && (el.token == "Identifier" || el.token == "DefinedIdentifier")) {
				const link = "#" + state.referenceManager.getId(el.str);
				const id = el.token == "DefinedIdentifier" ? link.substr(1) : undefined;
				
				items.push(<a className={className} id={id} href={link}>{el.str}</a>);
			}
			else
				items.push(<span className={className}>{el.str}</span>);
		}
		
		return (<div className="productions">{items}</div>);
	}
	
	public canInParagraph() { return false; }
	
	public register(refMngr: ReferenceManager) {
		const lexer = new EglLexerFactory().getLexerFor(formatCode(this.productions));
		lexer.readAllWithStr().filter(t => t.token == "DefinedIdentifier").forEach(t =>
			refMngr.register(t.str));
	}
}

@MyTemplateType()
class Link extends Content {

	@ImplicitTemplateField()
	public link: string;
	
	@ImplicitTemplateField()
	public text: Content;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		const text = this.text || new ContentString(this.link);
		return (
			<a href={this.link}>{ text.renderToHtml(state) }</a>
		);
	}
	
	public canInParagraph() { return true; }
}

@MyTemplateType()
class Text extends Content {

	@ImplicitTemplateField()
	public text: string;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<span className="text">{this.text}</span>
		);
	}
	
	public canInParagraph() { return true; }
}

@StringType()
class ContentString extends Content {
	constructor(private content: string) {
		super();
	}
	
	public toString() {
		return this.content;
	}
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return <span>{this.content}</span>;
	}
	
	public canInParagraph() { return true; }
}

@ArrayType(Content)
class ContentArray extends Content {
	constructor(private items: Content[]) {
		super();
	}
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		
		let resultItems: JSX.Element[] = [];
		let curPara: JSX.Element[] = [];

		const closePara = () => {
			if (curPara.length > 0) {
				resultItems.push(<p>{curPara}</p>);
				curPara = [];
			}
		};

		this.items.forEach((e, index) => {
			if (e instanceof ContentString) {
				var lines = e.toString().split(/\r\n|\n/);

				lines.forEach((line, position) => {
					if ((line.trim() === "") && position != lines.length - 1)
						closePara();
					else
						curPara.push(<span>{line + "\n"}</span>);

					if ((line.trim() !== "" || position === 0) && line.indexOf("  ", line.length - 2) !== -1)
						curPara.push(<br />);
				});
			}
			else {
				if (e.canInParagraph()) 
					curPara.push(...elToArr(e.renderToHtml(state)));
				else {
					closePara();
					resultItems.push(...elToArr(e.renderToHtml(state)));
				}
			}			
		});

		if (resultItems.length > 0)
			closePara();
		else
			resultItems = curPara;
		
		return resultItems;
	}
	
	public canInParagraph() { return false; }
	
	public getChildren(): Content[] { return this.items; }
}

