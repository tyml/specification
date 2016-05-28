import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";
import "./types.tsx";
import { Content } from "./types.tsx";
import $ from "jquery";
import { Deserializer } from "./Helper/Deserializer.ts";
import { AnnotationBasedTypeSystem } from "./Helper/TypeSystem/AnnotationBasedTypeSystem.ts";
import "../tyml-parser/tyml.js";

type GUIProps = { };
type GUIState = { content: Content };

class GUI extends React.Component<GUIProps, GUIState> {
	constructor(props: GUIProps) {
		super(props);
		
		$.get("../SPEC.tyml", data => {
			const result = new Deserializer(AnnotationBasedTypeSystem.getInstance()).deserialize(data);
			this.setState({ content: result });
		});
		
	}
	
	render() {
		return <div>
			{ this.state ? this.state.content.renderToHtmlWithDefaultState() : "" }
		</div>;
	}
}

ReactDOM.render(<GUI  />, document.querySelector("#root"));

