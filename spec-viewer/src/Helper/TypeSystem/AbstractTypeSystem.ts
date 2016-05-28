
export class NamespacedIdentifier {
	
	public constructor(namespace: string, identifier: string) {
		this.namespace = namespace;
		this.identifier = identifier;
	}
	
	public namespace: string;
	public identifier: string;
	
	public toString() { return `${this.namespace}#${this.identifier}`; };
}

export abstract class TypeSystem {
	public abstract getType(id: NamespacedIdentifier): Type;
}

export abstract class Type {
	
}

export abstract class UnionType extends Type {
	public abstract getUnitedTypes(): Type[];
	
	public getPrimitiveTypes(): PrimitiveType[] {
		return this.getUnitedTypes().filter(t => t instanceof PrimitiveType) as PrimitiveType[];
	}
	
	public getStringTypes(): StringType[] {
		return this.getUnitedTypes().filter(t => t instanceof StringType) as StringType[];
	}
	
	public getArrayTypes(): ArrayType[] {
		return this.getUnitedTypes().filter(t => t instanceof ArrayType) as ArrayType[];
	}
}

export abstract class ArrayType extends Type {	
	public abstract getItemType(): Type;
	public abstract createInstance(items: any[]): any;
}

export abstract class PrimitiveType extends Type {
	public abstract createInstance(str: string): any;
}

export abstract class StringType extends Type {
	public abstract createInstance(str: string): any;
}


export interface Attribute {
	name: string;
	isOptional: boolean;
	canBeImplicit: boolean;
	type: Type;
}

export abstract class ObjectType extends Type {
	public abstract getAttributes(): Attribute[];
	
	public getAttribute(name: string): Attribute {
		return this.getAttributes().filter(a => a.name == name)[0];
	}
	
	public getPossibleImplicitAttributes(): Attribute[] {
		return this.getAttributes().filter(a => a.canBeImplicit);
	}
	
	public abstract createInstance(attributeValues: { [name: string]: any }): any;
}
