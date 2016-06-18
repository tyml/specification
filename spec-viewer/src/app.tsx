import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";
import "./Types/types.tsx";
import { HtmlRenderState, Content, Constraint, ContentArray, Productions } from "./Types/types.tsx";
import $ from "jquery";
import { Deserializer } from "./Helper/Deserializer.ts";
import { AnnotationBasedTypeSystem } from "./Helper/TypeSystem/AnnotationBasedTypeSystem.ts";
import "../tyml-parser/tyml.js";
import * as Utils from "./Types/Utils.ts";

type GUIProps = { };
type GUIState = { content: Content; state: HtmlRenderState; };

class GUI extends React.Component<GUIProps, GUIState> {
	constructor(props: GUIProps) {
		super(props);
		
		setTimeout(() => this.updateLoop(), 400);
	}
	
	private lastContent: string;
	
	
	updateLoop() {
		
		$.get("../SPEC.tyml?c=" + new Date().getMilliseconds() , data => {
			
			setTimeout(() => this.updateLoop(), 400);
			
			if (this.lastContent == data) return;
			this.lastContent = data;
			
			const content: Content = new Deserializer(AnnotationBasedTypeSystem.getInstance()).deserialize(data);
			var state = Content.getDefaultState();
			this.setState({ content: content, state: state });
			
			
		});
	}
	
	render() {
		const content = this.state ? this.state.content : null;
		const state = this.state ? this.state.state : null;

		if (content != null && false) {
			const allProductions = content.getDescendants().filter(d => d instanceof Productions).map(p => Utils.formatCode((p as Productions).productions)).join("\n");
			const p = new Productions();
			p.productions = allProductions;

			return (
				<div>
					{ p.renderToHtml(state) }
				</div>
			);
		}
		if (content != null && false) {
			const el = new ContentArray(content.getDescendants().filter(d => d instanceof Constraint));

			return (
				<div>
					{ el.renderToHtml(state) }
				</div>
			);
		}

		return (
			<div>
				{ content ? content.renderToHtml(state) : "" }
			</div>
		);
	}
}

ReactDOM.render(<GUI  />, document.querySelector("#root"));

