import { HtmlElement } from "./Utils.ts";
import Katex from "katex";
import * as React from "react";

export class LatexManager {
	
	renderLatex(code: string, inline: boolean): HtmlElement {
		
		let code2 = code.replace(/\\operatorname/g, "")
					    .replace(/ ([a-zA-Z]{2,})/g, (s, firstGroup) =>  `\\mathrm{${firstGroup}}`)
						.replace(/\#/g, " ");
		code2 = "\\begin{aligned}" + code2 + "\\end{aligned}";
		
		let html: string = null;
		try { 
			html = Katex.renderToString(code2);
		}
		catch (e) {
			console.log(e);
		}
		
		return (
			<span dangerouslySetInnerHTML={{ __html: html }} />
		);
	}
}


