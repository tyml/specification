import * as React from "react";
import * as ReactDOM from "react-dom";
import "reflect-metadata";
import "./types.tsx";
import { Content } from "./types.tsx";
import { Deserializer } from "./Helper/Deserializer.ts";
import { AnnotationBasedTypeSystem } from "./Helper/TypeSystem/AnnotationBasedTypeSystem.ts";
import commandLineArgs from "command-line-args";
import ReactDOMServer from 'react-dom/server';
import "../tyml-parser/tyml.js";
import fs from "fs-extra";
import path from "path";

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
    
    const html = ReactDOMServer.renderToStaticMarkup(<html><head><link rel="stylesheet" href="style.css"></link></head><body><div id="root">{result.renderToHtmlWithDefaultState()}</div></body></html>);
    
    fs.writeFile(options.out + "/SPEC.html", html, err => {
        if(err) return console.log(err);
        console.log("Generated SPEC.html.");
    });
});
