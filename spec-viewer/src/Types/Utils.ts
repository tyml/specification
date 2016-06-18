
export function extend<T>(obj: any, parent: T): T {
	for (const x in parent)
		if (obj[x] === undefined)
			obj[x] = (parent as any)[x];
	return obj;
}


export function formatCode(code: string): string {
	var codeLines = code.split(/\r\n|\n/);
	var minWhitespaces = code.length;

	const isWs = (s: string) => s == " ";


	var start = -1;
	var end = -1;
	codeLines.forEach((line, idx) => {
		var c = 0;
		while (c <= line.length && isWs(line.charAt(c))) { c++; }

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
		while (c <= line.length && isWs(line.charAt(c))) { c++; }

		for (var i = minWhitespaces; i < line.length; i++) {
			result += line.charAt(i);
		}
		if (idx != end) result += "\n";
	});

	return result;
}

export type HtmlElement = JSX.Element | JSX.Element[];

export function elToArr(e: HtmlElement): JSX.Element[] {
	if (Array.isArray(e))
		return e;
	return [e] as any;
}