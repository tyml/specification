import { Type, TypeSystem, NamespacedIdentifier, ObjectType, StringType, ArrayType, PrimitiveType, UnionType } from "./TypeSystem/AbstractTypeSystem.ts";

export class Deserializer {
	
	public constructor(private typeSystem: TypeSystem) {
		
	}
	
	public deserialize(tymlDoc: string): any {
		
		const p = new Tyml.Parser.Parser();
		const parseResult = p.parse(tymlDoc);
		const doc = parseResult.getDocument(); 
		
		const v = new DeserializerVisitor(this.typeSystem);
		
		const r = v.accept(doc, null);
		
		return r;
	}
}

class AstVisitor<TArg, TResult> {

	public accept(node: Tyml.Ast.TymlNode, arg: TArg): TResult {
		var nodeType = node.getNodeType();


		if (nodeType.isPrimitive()) {
			return this.visitPrimitive(<Tyml.Ast.TymlPrimitive>node, arg);
		}
		else if (nodeType.isObject()) {
			return this.visitObject(<Tyml.Ast.TymlObject>node, arg);
		}
		else if (nodeType.isMarkupArray()) {
			return this.visitMarkupArray(<Tyml.Ast.TymlMarkupArray>node, arg);
		}
		else if (nodeType.isExplicitArray()) {
			return this.visitExplicitArray(<Tyml.Ast.TymlExplicitArray>node, arg);
		}
		else if (nodeType.isNormalString()) {
			return this.visitNormalString(<Tyml.Ast.TymlNormalString>node, arg);
		}
		else if (nodeType.isEscapedString()) {
			return this.visitEscapedString(<Tyml.Ast.TymlEscapedString>node, arg);
		}
		else if (nodeType.isImplicitString()) {
			return this.visitImplicitString(<Tyml.Ast.TymlImplicitString>node, arg);
		}
		else if (nodeType.isDocument()) {
			return this.visitDocument(<Tyml.Ast.TymlDocument>node, arg);
		}

		throw new Error("Element type is not supported!");

		//todo support attributes etc.
	}

	public visitNode(node: Tyml.Ast.TymlNode, arg: TArg): TResult {
		throw new Error("Not implemented");
	}

	public visitDocument(node: Tyml.Ast.TymlDocument, arg: TArg): TResult {
		return this.visitNode(node, arg);
	}

	public visitElement(node: Tyml.Ast.TymlNode, arg: TArg): TResult {
		return this.visitNode(node, arg);
	}


	public visitObject(node: Tyml.Ast.TymlObject, arg: TArg): TResult {
		return this.visitElement(node, arg);
	}

	public visitPrimitive(node: Tyml.Ast.TymlPrimitive, arg: TArg): TResult {
		return this.visitElement(node, arg);
	}


	public visitArray(node: Tyml.Ast.TymlArray, arg: TArg): TResult {
		return this.visitElement(node, arg);
	}

	public visitExplicitArray(node: Tyml.Ast.TymlExplicitArray, arg: TArg): TResult {
		return this.visitArray(node, arg);
	}

	public visitMarkupArray(node: Tyml.Ast.TymlMarkupArray, arg: TArg): TResult {
		return this.visitArray(node, arg);
	}




	public visitString(node: Tyml.Ast.TymlString, arg: TArg): TResult {
		return this.visitElement(node, arg);
	}

	public visitNormalString(node: Tyml.Ast.TymlNormalString, arg: TArg): TResult {
		return this.visitString(node, arg);
	}

	public visitImplicitString(node: Tyml.Ast.TymlImplicitString, arg: TArg): TResult {
		return this.visitString(node, arg);
	}

	public visitEscapedString(node: Tyml.Ast.TymlEscapedString, arg: TArg): TResult {
		return this.visitString(node, arg);
	}
}
	
	
type Arg = Type;

class DeserializerVisitor extends AstVisitor<Arg, any> {


	constructor(private typeSystem: TypeSystem) {
		super();
	}


	public visitDocument(node: Tyml.Ast.TymlDocument, arg: Arg): any {
		return this.accept(node.getRootNode(), arg);
	}

	public visitString(node: Tyml.Ast.TymlString, arg: Arg): any {

		let t: StringType;
		if (arg instanceof StringType)
			t = arg;
		else if (arg instanceof UnionType)
			t = arg.getStringTypes()[0];
			
		const result = t.createInstance(node.getValue());
		return result;
	}

	public visitPrimitive(node: Tyml.Ast.TymlPrimitive, arg: Arg): any {

//todo
		var v = node.getValue();
		if (v === "true")
			return true;
		if (v === "false")
			return false;
		if (/^-?[\d]+(?:e-?\d+)?$/.test(v)) {
			return parseInt(v);
		}
		if (/^-?[\d.]+(?:e-?\d+)?$/.test(v)) {
			return parseFloat(v);
		}

		throw "Invalid primitive.";
	}

	private getType(identifier: Tyml.Ast.TymlTypeIdentifier): Type {
		const type = this.typeSystem.getType(new NamespacedIdentifier(identifier.getNamespace(), identifier.getName()));
		return type;
	}

	public visitObject(node: Tyml.Ast.TymlObject, arg: Arg) {
		
		var type = this.getType(node.getTypeIdentifier()) as ObjectType;

		const impAttrs = type.getPossibleImplicitAttributes();

		let attrValues: { [name: string]: any } = { };

		let i = 0;
		for (const attrNode of node.getImplicitAttributes()) {
			const attrInfo = impAttrs[i];
			attrValues[attrInfo.name] = this.accept(attrNode, attrInfo.type);
			i++;
		}

		for (const attrNode of node.getAttributes()) {
			const attrInfo = type.getAttribute(attrNode.getIdentifier().getName());
			attrValues[attrInfo.name] = this.accept(attrNode.getValue(), attrInfo.type);
		}
		
		const result = type.createInstance(attrValues);
		return result;
	}

	public visitArray(node: Tyml.Ast.TymlArray, arg: Arg) {
		
		let t: ArrayType;
		if (arg instanceof ArrayType)
			t = arg;
		else if (arg instanceof UnionType)
			t = arg.getArrayTypes()[0];
			
		const itemType = t.getItemType();
		const items: any[] = node.getItems().map(i => this.accept(i, itemType));

		const result = t.createInstance(items);
		return result;
	}
}