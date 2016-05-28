import { Type, ArrayType, StringType, PrimitiveType, ObjectType, UnionType, NamespacedIdentifier, TypeSystem } from "./AbstractTypeSystem.ts";
import { Field, UnionTypeOptions } from "./../Annotations.ts";
import HashMap from "hashmap";
import { Cached } from "../Cached.ts";


type Ctor = any;

export class AnnotationBasedTypeSystem extends TypeSystem {
    
    private static instance: AnnotationBasedTypeSystem;    
    public static getInstance(): AnnotationBasedTypeSystem {
        if (this.instance == null)
            this.instance = new AnnotationBasedTypeSystem();
        return this.instance;
    }
    
    private map: HashMap<Ctor, Type> = new HashMap<Ctor, Type>();
    private idMap: HashMap<string, Type> = new HashMap<string, Type>();
    
    constructor() {
        super();
        this.map.set(String, new JsStringTypeImplementation());
    }
    
    public registerObjectType(id: NamespacedIdentifier, ctor: Ctor) {
        var objType = new ObjectTypeImplementation(ctor, this);
        this.map.set(ctor, objType);
        this.idMap.set(id.toString(), objType);
    }
    
    public registerStringType(ctor: Ctor) {
        var objType = new StringTypeImplementation(ctor);
        this.map.set(ctor, objType);
    }
    
    public registerUnionType(ctor: Ctor, options: UnionTypeOptions) {
        const arr1 = options.unitedArrayTypes || [];
        const arr2 = options.unitedStringTypes || [];
        var unionType = new UnionTypeImplementation(arr1.concat(arr2), this);
        this.map.set(ctor, unionType);
    }
    
    public registerArrayType(ctor: Ctor, itemType: Ctor) {
        const type = new ArrayTypeImplementation(ctor, itemType, this);
        this.map.set(ctor, type);
    }
    
    public getTypeByCtor(ctor: Ctor): Type {
        const type = this.map.get(ctor);
        return type;
    }
    
	public getType(id: NamespacedIdentifier): Type {
        return this.idMap.get(id.toString());
    }
}



class UnionTypeImplementation extends UnionType {
    
    constructor(private unitedTypes: (() => Ctor)[], private ts: AnnotationBasedTypeSystem) {
        super();
    }
    
	public getUnitedTypes(): Type[] {
        return this.unitedTypes.map(t => this.ts.getTypeByCtor(t()));
    }
}

class ArrayTypeImplementation extends ArrayType {
    
    constructor(private ctor: Ctor, private itemType: Ctor, private ts: AnnotationBasedTypeSystem) {
        super();
    }
    
	public getItemType(): Type {
        
        //const itemType = (Reflect.getMetadata("design:paramtypes", this.ctor) as any[])[0];
        const itemType2 = this.ts.getTypeByCtor(this.itemType);
        
        return itemType2;
    }
    
	public createInstance(items: any[]): any {
        return new this.ctor(items);
    }
}

class PrimitiveTypeImplementation extends PrimitiveType {
	public createInstance(str: string): any {
        
    }
}

class JsStringTypeImplementation extends StringType {
	public createInstance(str: string): any { return str; }
}

class StringTypeImplementation extends StringType {
    
    constructor(private ctor: Ctor) {
        super();
    }
    
	public createInstance(str: string): any {
        return new this.ctor(str);
    }
}

export interface Attribute {
	name: string;
	isOptional: boolean;
	canBeImplicit: boolean;
	type: Type;
}

interface Attribute2 extends Attribute {
    fieldName: string;
}

class ObjectTypeImplementation extends ObjectType {
    
    constructor(private ctor: Ctor, private ts: AnnotationBasedTypeSystem) {
        super();
    }
    
    private attributes: { [name: string]: Attribute2 };
    
    @Cached()
	public getAttributes(): Attribute2[] {
        const fields = (Reflect.getMetadata("tyml:fields", this.ctor.prototype) || []) as Field[];
        
        const result: { [name: string]: Attribute2 } = {};

        return fields.map(f => {
            const type = this.ts.getTypeByCtor(f.type);
            const canBeImplicit = f.options.canBeImplicit || false;
            const isOptional = f.options.isOptional || false;
            const name = f.name.substr(0, 1).toUpperCase() + f.name.substr(1);
            
            return { name: name, fieldName: f.name, type: type, canBeImplicit: canBeImplicit, isOptional: isOptional };
        });
    }

	public createInstance(attributeValues: { [name: string]: any }): any {
        
        const instance = new this.ctor();
        const attrInfos: { [name: string]: Attribute2 } = {};
        for (const attr of this.getAttributes())
            attrInfos[attr.name] = attr;
        
        for (var attr in attributeValues) {
            const value = attributeValues[attr];
            const attrInfo = attrInfos[attr];
            instance[attrInfo.fieldName] = value;
        }
        
        return instance;
    }
}
