import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";
import "./Types/types";
import { Content } from "./Types/types";
import { Deserializer } from "./Helper/Deserializer";
import { AnnotationBasedTypeSystem } from "./Helper/TypeSystem/AnnotationBasedTypeSystem";
import * as commandLineArgs from "command-line-args";
import * as ReactDOMServer from 'react-dom/server';
import "../tyml-parser/tyml.js";
import * as fs from "fs-extra";
import * as path from "path";

interface CliArgs {
    src: string;
    out: string;
}
 
const cli = commandLineArgs([
  { name: 'src', type: String, defaultOption: true },
  { name: 'out', alias: 'o', type: String }
])

const options = cli.parse() as CliArgs;

fs.readFile(options.src, 'utf8', (err,data) => {
    if (err) return console.log(err);

    const result = new Deserializer(AnnotationBasedTypeSystem.getInstance()).deserialize(data);
    
    const html = ReactDOMServer.renderToStaticMarkup(
        <html>
            <head>
                <link rel="stylesheet" href="katex.min.css"></link>
                <link rel="stylesheet" href="style.css"></link>
            </head>
            <body>
                <div id="root">{result.renderToHtmlWithDefaultState()}</div>
            </body>
        </html>);
    
    fs.writeFile(options.out + "/SPEC.html", html, (err: any) => {
        if(err) return console.log(err);
        console.log("Generated SPEC.html.");
    });
});
