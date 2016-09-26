export declare module Tyml {
    class ArgumentExceptionHelper {
        static ensureUndefinedOrTypeOf(obj: any, type: any, name: string): void;
        static ensureNullOrTypeOf(obj: any, type: any, name: string): void;
        static ensureTypeOf(obj: any, type: any, name: string): void;
        static ensureArrayTypeOf(object: any[], elementType: any, name: string): void;
    }
}
export declare module Tyml {
    class TextPoint {
        private line;
        private column;
        constructor(line: number, column: number);
        getLine(): number;
        getColumn(): number;
    }
    class TextRegion {
        private startLine;
        private startColumn;
        private endLine;
        private endColumn;
        static hasRegion(node: any): boolean;
        static getRegionOf(node: any): TextRegion;
        constructor(startLine: number, startColumn: number, endLine: number, endColumn: number);
        getStartLine(): number;
        getStartColumn(): number;
        getEndLine(): number;
        getEndColumn(): number;
        toString(): string;
        toJson(): {
            startLine: number;
            startColumn: number;
            endLine: number;
            endColumn: number;
        };
        contains(p: TextPoint): boolean;
    }
}
export declare module Tyml.Ast {
    class TymlNodeType {
        private name;
        constructor(name: string);
        isType(nodeType: TymlNodeType): boolean;
        private static types;
        private static getType(name);
        isDocument(): boolean;
        isDocumentHeader(): boolean;
        isElement(): boolean;
        isArray(): boolean;
        isExplicitArray(): boolean;
        isMarkupArray(): boolean;
        isString(): boolean;
        isNormalString(): boolean;
        isImplicitString(): boolean;
        isEscapedString(): boolean;
        isEscapedStringBeginIdentifier(): boolean;
        isEscapedStringEndIdentifier(): boolean;
        isPrimitive(): boolean;
        isObject(): boolean;
        isTypeIdentifier(): boolean;
        isAttritubeIdentifier(): boolean;
        isAttribute(): boolean;
        isNsAttribute(): boolean;
        static getNodeType(): TymlNodeType;
        static getDocumentType(): TymlNodeType;
        static getDocumentHeaderType(): TymlNodeType;
        static getElementType(): TymlNodeType;
        static getArrayType(): TymlNodeType;
        static getExplicitArrayType(): TymlNodeType;
        static getMarkupArrayType(): TymlNodeType;
        static getStringType(): TymlNodeType;
        static getNormalStringType(): TymlNodeType;
        static getImplicitStringType(): TymlNodeType;
        static getEscapedStringType(): TymlNodeType;
        static getEscapedStringBeginIdentifierType(): TymlNodeType;
        static getEscapedStringEndIdentifierType(): TymlNodeType;
        static getPrimitiveType(): TymlNodeType;
        static getObjectType(): TymlNodeType;
        static getAttributeIdentifierType(): TymlNodeType;
        static getTypeIdentifierType(): TymlNodeType;
        static getAttributeType(): any;
        static getNsAttributeType(): any;
    }
}
export declare module Tyml.Ast {
    interface TymlTextRegionNode extends TymlNode {
        getTextRegion(): TextRegion;
        getNodeAt(point: TextPoint): TymlTextRegionNode;
    }
    interface TymlNode {
        /**
         * Gets the string representation of this node.
         *
         * @return {string} the string representation.
         */
        toString(): string;
        /**
         * Resolves a prefix to its associated url.
         *
         * @param {String} prefix the prefix to resolve. Can be empty to resolve the current namespace. Cannot be null.
         * @return {String} the url associated to the prefix or the null string if the prefix does not exist.
         */
        resolvePrefix(prefix: string): any;
        /**
         * Gets the type of the node.
         *
         * @return the type of the node.
         */
        getNodeType(): TymlNodeType;
    }
    interface TymlDocument extends TymlNode {
        getHeader(): TymlDocumentHeader;
        getRootNode(): TymlObject;
    }
    interface TymlDocumentHeader extends TymlNode {
        getVersionElement(): TymlPrimitive;
        getEncoding(): TymlString;
    }
    interface TymlElement extends TymlNode {
    }
    interface TymlArray extends TymlElement {
        getItems(): TymlElement[];
    }
    interface TymlExplicitArray extends TymlArray {
    }
    interface TymlMarkupArray extends TymlArray {
    }
    interface TymlString extends TymlElement {
        getValue(): string;
    }
    interface TymlImplicitString extends TymlString {
    }
    interface TymlNormalString extends TymlString {
    }
    interface TymlEscapedString extends TymlString {
        getIdentifier(): string;
        getBeginIdentifier(): TymlEscapedStringBeginIdentifier;
        getEndIdentifier(): TymlEscapedStringEndIdentifier;
    }
    interface TymlEscapedStringBeginIdentifier extends TymlNode {
        getIdentifier(): string;
    }
    interface TymlEscapedStringEndIdentifier extends TymlNode {
        getIdentifier(): string;
    }
    interface TymlPrimitive extends TymlElement {
        getValue(): string;
    }
    interface TymlObject extends TymlElement {
        getTypeIdentifier(): TymlTypeIdentifier;
        getAttributes(): TymlAttribute[];
        getImplicitAttributes(): TymlElement[];
        getNamespacePrefixDefinitions(): TymlNsAttribute[];
    }
    interface TymlTypeIdentifier extends TymlNode {
        getNamespace(): string;
        getPrefix(): string;
        getName(): string;
        getFullQualifiedName(): any;
    }
    interface TymlAttribute extends TymlNode {
        getIdentifier(): TymlAttributeIdentifier;
        getValue(): TymlElement;
    }
    interface TymlAttributeIdentifier extends TymlNode {
        getNamespace(): string;
        getPrefix(): string;
        getName(): string;
        getFullQualifiedName(): any;
    }
    interface TymlNsAttributeIdentifier extends TymlNode {
        getPrefix(): string;
    }
    interface TymlNsAttribute extends TymlNode {
        getPrefix(): string;
        getNamespace(): TymlNormalString;
    }
}
export declare module Tyml.Ast.Implementation {
    /**
     * Is abstract. Do not construct.
     */
    class TymlNode implements Ast.TymlNode, TymlTextRegionNode {
        private textRegion;
        private parent;
        private cachedPrefixes;
        constructor(textRegion?: TextRegion);
        /**
         * Internal method. Is used to prohibit creation of abstract classes.
         */
        _getIsAbstract(): boolean;
        /**
         * Gets the text region. Can be null.
         */
        getTextRegion(): TextRegion;
        /**
         * Gets the node at the given point.
         *
         * @return {TymlNode} the deepest node at point.
         */
        getNodeAt(point: TextPoint): TymlNode;
        /**
         * Converts this node to text.
         */
        toString(): string;
        /**
         * Gets the type of the node.
         *
         * @return {TymlNodeType} the type of the node.
         */
        getNodeType(): TymlNodeType;
        /**
         * Internal method. Will be called on construction of the parent node.
         */
        _setParent(parent: TymlNode): void;
        /**
         * Resolves a prefix to its associated uri.
         *
         * @param {String} prefix the prefix to resolve. Can be empty to resolve the current namespace. Cannot be null.
         * @return {String} the url associated to the prefix or the null string if the prefix does not exist.
         */
        resolvePrefix(prefix: string): string;
        /**
         * Throws an exception if a referenced prefix cannot be resolved.
         * Will be called automatically by TymlDocument.
         */
        validatePrefixes(): void;
    }
    class TymlDocument extends TymlNode implements Ast.TymlDocument {
        private header;
        private root;
        constructor(header: TymlDocumentHeader, root: TymlObject, textRegion?: TextRegion);
        getNodeAt(point: TextPoint): TymlNode;
        _getIsAbstract(): boolean;
        toString(): string;
        getNodeType(): TymlNodeType;
        getHeader(): TymlDocumentHeader;
        getRootNode(): TymlObject;
    }
    class TymlDocumentHeader extends TymlNode implements Ast.TymlDocumentHeader {
        private versionElement;
        private encoding;
        private validator;
        constructor(versionElement?: TymlPrimitive, encoding?: TymlString, validator?: TymlString, textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        getNodeType(): TymlNodeType;
        toString(): string;
        getVersionElement(): TymlPrimitive;
        getEncoding(): TymlString;
        getValidator(): TymlString;
    }
    /**
     * Is abstract. Do not construct.
     */
    class TymlElement extends TymlNode implements Ast.TymlElement {
        getNodeType(): TymlNodeType;
    }
    /**
     * Is abstract. Do not construct.
     */
    class TymlArray extends TymlElement implements Ast.TymlArray {
        private items;
        constructor(items: TymlElement[], textRegion?: TextRegion);
        getNodeAt(point: TextPoint): TymlNode;
        getItems(): TymlElement[];
        getNodeType(): TymlNodeType;
        validatePrefixes(): void;
    }
    class TymlExplicitArray extends TymlArray implements Ast.TymlExplicitArray {
        _getIsAbstract(): boolean;
        toString(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlMarkupArray extends TymlArray implements Ast.TymlMarkupArray {
        _getIsAbstract(): boolean;
        toString(): string;
        getNodeType(): TymlNodeType;
    }
    /**
     * Is abstract. Do not construct.
     */
    class TymlString extends TymlElement implements Ast.TymlString {
        private value;
        constructor(value: string, textRegion?: TextRegion);
        getValue(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlImplicitString extends TymlString implements Ast.TymlNormalString {
        _getIsAbstract(): boolean;
        toString(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlNormalString extends TymlString implements Ast.TymlNormalString {
        _getIsAbstract(): boolean;
        toString(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlEscapedString extends TymlString implements Ast.TymlEscapedString {
        private beginIdentifier;
        private endIdentifier;
        constructor(value: string, beginIdentifier: TymlEscapedStringBeginIdentifier, endIdentifier: TymlEscapedStringEndIdentifier, textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        getIdentifier(): string;
        getBeginIdentifier(): TymlEscapedStringBeginIdentifier;
        getEndIdentifier(): TymlEscapedStringEndIdentifier;
        toString(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlEscapedStringIdentifier extends TymlNode {
        private identifier;
        constructor(identifier: string, textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        getIdentifier(): string;
        toString(): string;
    }
    class TymlEscapedStringBeginIdentifier extends TymlEscapedStringIdentifier implements Ast.TymlEscapedStringBeginIdentifier {
        _getIsAbstract(): boolean;
        getNodeType(): TymlNodeType;
    }
    class TymlEscapedStringEndIdentifier extends TymlEscapedStringIdentifier implements Ast.TymlEscapedStringEndIdentifier {
        _getIsAbstract(): boolean;
        getNodeType(): TymlNodeType;
    }
    class TymlPrimitive extends TymlElement implements Ast.TymlPrimitive {
        private value;
        constructor(value: string, textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        toString(): string;
        getValue(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlObject extends TymlElement implements Ast.TymlObject {
        private typeIdentifier;
        private attributes;
        private implicitAttributes;
        private namespacePrefixDefinitions;
        constructor(typeIdentifier: TymlTypeIdentifier, attributes: TymlAttribute[], implicitAttributes: TymlElement[], namespacePrefixDefinitions: TymlNsAttribute[], textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        toString(): string;
        getNodeAt(point: TextPoint): TymlNode;
        getTypeIdentifier(): TymlTypeIdentifier;
        getAttributes(): TymlAttribute[];
        getImplicitAttributes(): TymlElement[];
        getNamespacePrefixDefinitions(): TymlNsAttribute[];
        resolvePrefix(prefix: string): string;
        getNodeType(): TymlNodeType;
        validatePrefixes(): void;
    }
    /**
     * Is abstract. Do not construct.
     */
    class TymlIdentifier extends TymlNode {
        private name;
        private prefix;
        constructor(prefix: string, name: string, textRegion?: TextRegion);
        toString(): string;
        getPrefix(): string;
        getName(): string;
        /**
         * Returns the namespace. Will not be null.
         */
        getNamespace(): string;
        getFullQualifiedName(): string;
        validatePrefixes(): void;
    }
    class TymlTypeIdentifier extends TymlIdentifier implements Ast.TymlTypeIdentifier {
        _getIsAbstract(): boolean;
        getNodeType(): TymlNodeType;
    }
    class TymlAttributeIdentifier extends TymlIdentifier implements Ast.TymlAttributeIdentifier {
        _getIsAbstract(): boolean;
        getNamespace(): string;
        getNodeType(): TymlNodeType;
    }
    class TymlAttribute extends TymlNode implements Ast.TymlAttribute {
        private identifier;
        private value;
        constructor(identifier: TymlAttributeIdentifier, value: TymlElement, textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        getNodeAt(point: TextPoint): TymlNode;
        getIdentifier(): TymlAttributeIdentifier;
        getValue(): TymlElement;
        toString(): string;
        getNodeType(): TymlNodeType;
        validatePrefixes(): void;
    }
    class TymlNsAttribute extends TymlNode implements Ast.TymlNsAttribute {
        private prefix;
        private namespace;
        constructor(prefix: string, namespace: TymlString, textRegion?: TextRegion);
        _getIsAbstract(): boolean;
        getPrefix(): string;
        getNamespace(): TymlString;
        toString(): string;
        getNodeType(): TymlNodeType;
    }
}
export declare module Tyml.Parser {
    enum MessageType {
        FATAL = 0,
        ERROR = 1,
        WARNING = 2,
        INFO = 3,
    }
    class Message {
        private type;
        private messageArguments;
        private message;
        private textRegion;
        private messageId;
        constructor(type: MessageType, messageId: string, messageArguments: any, message: string, textRegion: TextRegion);
        getType(): MessageType;
        getArguments(): any;
        getMessage(): string;
        /**
         * The id of this message type. The set of message ids ever returned by the parser must be finite.
         */
        getMessageId(): string;
        /**
         * The text region. Can be null to indicate a message which does not belong to a text block.
         */
        getTextRegion(): TextRegion;
    }
    class ParseResult {
        private doc;
        private messages;
        constructor(doc: Tyml.Ast.TymlDocument, messages: Message[]);
        getDocument(): Tyml.Ast.TymlDocument;
        getMessages(): Message[];
    }
    interface ParserInterface {
        /**
         * Parses text synchronously. Asynchronous behaviour can be added later through overloading.
         */
        parse(text: string): ParseResult;
    }
}
export declare module Tyml.Parser {
    class Tokenizer {
        private text;
        private currentPosition;
        private currentLine;
        private currentColumn;
        constructor(text: string);
        /**
         * Tries to read text. If successful, true will be returned.
         * If not successful, the position will be resetted to the state
         * before the method call and false will be returned
         */
        tryRead(expectedText: string, consume?: boolean): boolean;
        /**
         * Returns the next character.
         * An empty string will be returned if there is no next character.
         */
        peek(): string;
        read(): string;
        getPosition(): any;
        gotoPosition(position: any): void;
        readWhile(condition: (c: string) => boolean): string;
        getRegion(startPos: any): TextRegion;
    }
}
export declare module Tyml.Parser {
    class MessageDictionary {
        getUnexpectedCharactersBeforeDocumentMessage(unexpectedChars: string): string;
        getNoDocumentHeaderMessage(): string;
        getEndOfDocumentExpectedMessage(): string;
        getExpectedStringNotFoundMessage(expected: string): string;
        getUnexpectedColonOrMissingAttributeNameMessage(): string;
        getExpectedWhitespaceNotFoundMessage(lastElementType: string, currentElementType: string): string;
        getNamespacePrefixDefinitionsMustBeFirstMessage(prefix: string): string;
        getNamespacePrefixAlreadyDefined(prefix: string): string;
        getNamespacePrefixAlreadyDefinedInTheSameObject(prefix: string): string;
        getPrefixNotDefinedMessage(prefix: string): string;
        getTypeIdentifierCannotBeEmptyMessage(): string;
        getTypeIdentifierCannotStartWithMessage(cannotStartWith: string): string;
        getOnlyOnePrefixIsAllowedInTypeIdentifierMessage(): string;
        getUnexpectedCharacterInPrimitiveMessage(character: string): string;
        getUnexpectedCharacterInMarkupArrayMessage(character: string): string;
        getUnclosedObjectMessage(): string;
        getUnclosedMarkupArrayMessage(): string;
        getUnclosedArrayMessage(): string;
        getExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFoundMessage(gotActual: string): string;
        getUnrecognizedEscapeSequenceMessage(escapeSequence: string): string;
        getInvalidEscapedStringIdentifierMessage(unexpectedCharacter: string): string;
    }
}
export declare module Tyml.Parser {
    class GermanMessageDictionary extends MessageDictionary {
        getUnexpectedCharactersBeforeDocumentMessage(unexpectedChars: string): string;
        getNoDocumentHeaderMessage(): string;
        getEndOfDocumentExpectedMessage(): string;
        getExpectedStringNotFoundMessage(expected: string): string;
        getUnexpectedColonOrMissingAttributeNameMessage(): string;
        getExpectedWhitespaceNotFoundMessage(lastElementType: string, currentElementType: string): string;
        getTypeIdentifierCannotBeEmptyMessage(): string;
        getTypeIdentifierCannotStartWithMessage(cannotStartWith: string): string;
        getOnlyOnePrefixIsAllowedInTypeIdentifierMessage(): string;
        getUnexpectedCharacterInPrimitiveMessage(character: string): string;
        getUnexpectedCharacterInMarkupArrayMessage(character: string): string;
        getUnclosedObjectMessage(): string;
        getUnclosedMarkupArrayMessage(): string;
        getUnclosedArrayMessage(): string;
        getExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFoundMessage(gotActual: string): string;
        getUnrecognizedEscapeSequenceMessage(escapeSequence: string): string;
        getInvalidEscapedStringIdentifierMessage(unexpectedCharacter: string): string;
    }
}
export declare module Tyml.Parser {
    class Parser implements ParserInterface {
        private messageDictionary;
        private letters;
        private numbers;
        private getInStringMatcher(str);
        private isValidIdentifierFirstLetter;
        private isValidIdentifierOtherLetter;
        private isValidPrimitiveLetter;
        private isWhitespaceChar;
        /**
         * Creates a new parser.
         *
         * @param {MessageDictionary} messageDictionary the text used for messages.
         */
        constructor(messageDictionary?: MessageDictionary);
        /**
         * Parses the given text and returns a parse result.
         *
         * @param {string} text the text to parse. Cannot be null.
         * @return {ParseResult} the parsed result.
         */
        parse(text: string): ParseResult;
        private parseDocument(t, logger, s);
        private tryReadDocumentHeader(t, logger, s);
        private tryReadComment(t, logger, s);
        /**
         * Parses whitespaces and comments. Null will be returned,
         * if no whitespace or comment could be parsed.
         */
        private parseWhitespace(t, logger, s);
        private expect(t, logger, expected);
        private parseObject(t, logger, s);
        private parseInnerObject(t, logger, s, implicitAttributes, attributes, namespacePrefixDefinitions);
        private parseTypeIdentifier(t, logger, s);
        /**
         * Tries to parse an attribute identifier.
         * An attribute identifier has to end with ":", however, ":" will not be read.
         * If it fails, the reader will be resettet to the state before this method call.
         * If it succeeds, a TymlAttributeIdentifier will be returned.
         */
        private tryParseAttributeIdentifier(t, logger, s);
        private tryParseNamespacePrefixDefinition(t, logger, s);
        private parseElement(t, logger, s);
        private parsePrimitive(t, logger, s);
        private parseMarkupArray(t, logger, s);
        private parseArray(t, logger, s);
        private readEscapeSequence(t, logger, s);
        /**
         * Parses a normal or escaped string.
         */
        private parseString(t, logger, s);
    }
}
export declare module Tyml.Transformer {
    class AstVisitor<T> {
        accept(node: Ast.TymlNode): T;
        visitNode(node: Ast.TymlNode): T;
        visitDocument(node: Ast.TymlDocument): T;
        visitElement(node: Ast.TymlNode): T;
        visitObject(node: Ast.TymlObject): T;
        visitPrimitive(node: Ast.TymlPrimitive): T;
        visitArray(node: Ast.TymlArray): T;
        visitExplicitArray(node: Ast.TymlExplicitArray): T;
        visitMarkupArray(node: Ast.TymlMarkupArray): T;
        visitString(node: Ast.TymlString): T;
        visitNormalString(node: Ast.TymlNormalString): T;
        visitImplicitString(node: Ast.TymlImplicitString): T;
        visitEscapedString(node: Ast.TymlEscapedString): T;
    }
    interface ITymlTransformer<T> {
        transform(t: Ast.TymlDocument): T;
    }
}
export declare module Tyml.Transformer {
    class XmlTransformer implements ITymlTransformer<XMLDocument> {
        transform(node: Ast.TymlDocument): XMLDocument;
        reverseTransform(doc: XMLDocument): Ast.TymlDocument;
    }
}
export declare module Tyml.Transformer {
    class JsonTransformer implements ITymlTransformer<Object> {
        transform(node: Ast.TymlDocument): Object;
        reverseTransform(doc: Object): Ast.TymlDocument;
    }
}
export declare module Tyml.Transformer {
    class PrettyprintTransformer implements ITymlTransformer<String> {
        transform(node: Ast.TymlNode): String;
    }
}
export declare module Tyml.Transformer {
    class TexTransformer implements ITymlTransformer<string> {
        transform(node: Ast.TymlNode): string;
    }
}
