import { TemplateField, TemplateType, ArrayType, StringType, UnionType, FieldOptions, ImplicitTemplateField } from "../Helper/Annotations.ts";
import * as React from "react";
import { EglLexerFactory } from "../Helper/EglLexer.ts";
import { ReferenceManager } from "./ReferenceManager.ts";
import { LatexManager } from "./LatexManager.tsx";
import { HtmlElement, elToArr, extend, formatCode } from "./Utils.ts";
import { Promise } from "es6-promise";


function MyTemplateType() {
    return TemplateType("tyml.org/spec/0.9");
}  



export interface HtmlRenderState {
	chapterDepth: number;
	referenceManager: ReferenceManager;
	latexManager: LatexManager;
}


@UnionType({ unitedArrayTypes:[() => ContentArray], unitedStringTypes:[() => ContentString] })
export abstract class Content {
	
	public static getDefaultState(): HtmlRenderState {
		return { chapterDepth: 1, referenceManager: new ReferenceManager(), latexManager: new LatexManager() };
	}
	
	public renderToHtmlWithDefaultState(): HtmlElement {
		return this.renderToHtml(Content.getDefaultState());
	}
	
	public abstract renderToHtml(state: HtmlRenderState): HtmlElement;
	public abstract canInParagraph(): boolean;
	
	public register(refMngr: ReferenceManager) {
		this.getChildren().forEach(c => c.register(refMngr));
	}
	
	public getChildren(): Content[] { return []; }

	public getDescendants(): Content[] { return [ this as Content ].concat(...this.getChildren().map(c => c.getDescendants())); }
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
		
		const text = this.referenced.replace(/\+/, "");
		
		return (
			<span className="reference">{ text }</span>
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
class Property extends Content {
	@ImplicitTemplateField()
	public nodeType: string;
	
	@ImplicitTemplateField()
	public properyName: string;
	
	@ImplicitTemplateField()
	public content: Content;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<div className="panel definition">
				<div className="panel-heading">Property: { this.nodeType } &rarr; { this.properyName }</div>
				<div className="panel-body">{ this.content.renderToHtml(state) }</div>	
			</div>
		);
	}
	
	public canInParagraph() { return false; }
	
	public register(refMngr: ReferenceManager) { 
		refMngr.register(this.properyName); 
		super.register(refMngr);
	}
	
	public getChildren(): Content[] { return [ this.content ]; }
}


@MyTemplateType()
export class Constraint extends Content {
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
export class Productions extends Content {
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
class TymlCode extends Content {
	@ImplicitTemplateField()
	public code: string;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		
		return (<div className="code">{formatCode(this.code)}</div>);
	}
	
	public canInParagraph() { return false; }
}

@MyTemplateType()
class Example extends Content {
	@ImplicitTemplateField()
	public title: string;

	@ImplicitTemplateField()
	public example: Content;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<div className="panel definition">
				<div className="panel-heading">Example: { this.title }</div>
				<div className="panel-body">{ this.example.renderToHtml(state) }</div>	
			</div>
		);
		
	}
	
	public canInParagraph() { return false; }
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
			<span className="text-span">{this.text}</span>
		);
	}
	
	public canInParagraph() { return true; }
}

@MyTemplateType()
class LatexBlock extends Content {
	@ImplicitTemplateField()
	public code: string;
	
	public getLatexCode(): string { return this.code; }
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return <div className="latex-block">{state.latexManager.renderLatex(this.getLatexCode(), false)}</div>;
	}
	
	public canInParagraph() { return false; }
}

@MyTemplateType()
class Latex extends Content {
	@ImplicitTemplateField()
	public code: string;
	
	public getLatexCode(): string { return this.code; }
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return state.latexManager.renderLatex(this.getLatexCode(), false);
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
export class ContentArray extends Content {
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
					if ((line.trim() === "") && position != lines.length - 1 && position != 0)
						closePara();
					else {
						let l = line;
						if (position != lines.length - 1)
							l += "\n";
						curPara.push(<span>{l}</span>);
					}

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


@MyTemplateType()
class List extends Content {
	
	@ImplicitTemplateField()
	public items: ContentArray;
	
	public renderToHtml(state: HtmlRenderState): HtmlElement {
		return (
			<ul>
				{ this.items.getChildren().map(c => <li>{c.renderToHtml(state)}</li>) }
			</ul>
		);
	}
	
	public canInParagraph() { return false; }
	
	public getChildren(): Content[] { return [ this.items ]; }
}
