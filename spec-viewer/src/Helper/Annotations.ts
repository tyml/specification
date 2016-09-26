import { AnnotationBasedTypeSystem } from "./TypeSystem/AnnotationBasedTypeSystem";
import { NamespacedIdentifier } from "./TypeSystem/AbstractTypeSystem";

export interface FieldOptions {
	canBeImplicit?: boolean;
	isOptional?: boolean;
}

export interface Field {
	options: FieldOptions;
	name: string;
	type: any;
}

export function TemplateField(options: FieldOptions = {}) {
	return function (target : any, key : string) {
		const fieldType = Reflect.getMetadata("design:type", target, key);
		//console.log(target, key, fieldType);
		//(window as any).last1 = target;
		
		let fields = Reflect.getMetadata("tyml:fields", target) as Field[];
		if (fields == undefined) {
			fields = [];
			Reflect.defineMetadata("tyml:fields", fields, target);
		}
		
		fields.push({ name: key, type: fieldType, options: options });	
	};
}

export function ImplicitTemplateField(options: FieldOptions = {}) {
	 options.canBeImplicit = true;
	 return TemplateField(options);
}

export function TemplateType(ns: string) {
    return function(target : any) {
		//console.log(target);
		//(window as any).last2 = target;
		
		const id = new NamespacedIdentifier(ns, target.name);
		
		AnnotationBasedTypeSystem.getInstance().registerObjectType(id, target);
	};
}

export function StringType() {
    return function(target : any) {
		AnnotationBasedTypeSystem.getInstance().registerStringType(target);
	};
}


export interface UnionTypeOptions {
	unitedStringTypes?: (() => any)[];
	unitedArrayTypes?: (() => any)[];
}

export function UnionType(options?: UnionTypeOptions) {
    return function(target : any) {
		AnnotationBasedTypeSystem.getInstance().registerUnionType(target, options);
	};
}

export function ArrayType(itemType: any) {
    return function(target : any) {
		AnnotationBasedTypeSystem.getInstance().registerArrayType(target, itemType);
	};
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func: any) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}

