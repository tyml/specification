var Tyml;
(function (Tyml) {
    var ArgumentExceptionHelper = (function () {
        function ArgumentExceptionHelper() {
        }
        ArgumentExceptionHelper.ensureUndefinedOrTypeOf = function (obj, type, name) {
            if (typeof obj === "undefined")
                return;
            ArgumentExceptionHelper.ensureTypeOf(obj, type, name);
        };
        ArgumentExceptionHelper.ensureNullOrTypeOf = function (obj, type, name) {
            if (obj === null)
                return;
            ArgumentExceptionHelper.ensureTypeOf(obj, type, name);
        };
        ArgumentExceptionHelper.ensureTypeOf = function (obj, type, name) {
            if (type === "string") {
                if (typeof (obj) !== "string") {
                    throw new Error("Argument '" + name + "' must be of type string.");
                }
            }
            else {
                if (obj === null) {
                    throw new Error("Argument '" + name + "' is null, must be of type " + type.toString() + ".");
                }
                if (!(obj instanceof type)) {
                    var funcNameRegex = /function (.{1,})\(/;
                    var results = funcNameRegex.exec(type.toString());
                    var typeName = (results && results.length > 1) ? results[1] : "";
                    throw new Error("Argument '" + name + "' must be of type " + typeName + ", but was " + obj + ".");
                }
            }
        };
        ArgumentExceptionHelper.ensureArrayTypeOf = function (object, elementType, name) {
            for (var i = 0; i < object.length; i++) {
                this.ensureTypeOf(object[i], elementType, name + "[" + i + "]");
            }
        };
        return ArgumentExceptionHelper;
    })();
    Tyml.ArgumentExceptionHelper = ArgumentExceptionHelper;
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var TextPoint = (function () {
        function TextPoint(line, column) {
            this.line = line;
            this.column = column;
        }
        TextPoint.prototype.getLine = function () {
            return this.line;
        };
        TextPoint.prototype.getColumn = function () {
            return this.column;
        };
        return TextPoint;
    })();
    Tyml.TextPoint = TextPoint;
    var TextRegion = (function () {
        function TextRegion(startLine, startColumn, endLine, endColumn) {
            this.startLine = startLine;
            this.startColumn = startColumn;
            this.endLine = endLine;
            this.endColumn = endColumn;
        }
        TextRegion.hasRegion = function (node) {
            return typeof node.getTextRegion === "function";
        };
        TextRegion.getRegionOf = function (node) {
            if (!TextRegion.hasRegion(node))
                throw new Error("node has no text region!");
            return node.getTextRegion();
        };
        TextRegion.prototype.getStartLine = function () {
            return this.startLine;
        };
        TextRegion.prototype.getStartColumn = function () {
            return this.startColumn;
        };
        TextRegion.prototype.getEndLine = function () {
            return this.endLine;
        };
        TextRegion.prototype.getEndColumn = function () {
            return this.endColumn;
        };
        TextRegion.prototype.toString = function () {
            return this.getStartLine() + ": " + this.getStartColumn() +
                " - " + this.getEndLine() + ": " + this.getEndColumn();
        };
        TextRegion.prototype.toJson = function () {
            return {
                startLine: this.startLine,
                startColumn: this.startColumn,
                endLine: this.endLine,
                endColumn: this.endColumn
            };
        };
        TextRegion.prototype.contains = function (p) {
            if (this.startLine == p.getLine() && this.startColumn > p.getColumn())
                return false;
            if (this.endLine == p.getLine() && this.endColumn < p.getColumn())
                return false;
            return (this.startLine <= p.getLine()) && (p.getLine() <= this.endLine);
        };
        return TextRegion;
    })();
    Tyml.TextRegion = TextRegion;
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Ast;
    (function (Ast) {
        var TymlNodeType = (function () {
            function TymlNodeType(name) {
                this.name = name;
            }
            TymlNodeType.prototype.isType = function (nodeType) {
                var result = this.name.indexOf(nodeType.name) === 0;
                return result;
            };
            TymlNodeType.getType = function (name) {
                var result = TymlNodeType.types[name];
                if (result == null) {
                    result = new TymlNodeType(name);
                    TymlNodeType.types[name] = result;
                }
                return result;
            };
            TymlNodeType.prototype.isDocument = function () {
                return this.isType(TymlNodeType.getDocumentType());
            };
            TymlNodeType.prototype.isDocumentHeader = function () {
                return this.isType(TymlNodeType.getDocumentHeaderType());
            };
            TymlNodeType.prototype.isElement = function () {
                return this.isType(TymlNodeType.getElementType());
            };
            TymlNodeType.prototype.isArray = function () {
                return this.isType(TymlNodeType.getArrayType());
            };
            TymlNodeType.prototype.isExplicitArray = function () {
                return this.isType(TymlNodeType.getExplicitArrayType());
            };
            TymlNodeType.prototype.isMarkupArray = function () {
                return this.isType(TymlNodeType.getMarkupArrayType());
            };
            TymlNodeType.prototype.isString = function () {
                return this.isType(TymlNodeType.getStringType());
            };
            TymlNodeType.prototype.isNormalString = function () {
                return this.isType(TymlNodeType.getNormalStringType());
            };
            TymlNodeType.prototype.isImplicitString = function () {
                return this.isType(TymlNodeType.getImplicitStringType());
            };
            TymlNodeType.prototype.isEscapedString = function () {
                return this.isType(TymlNodeType.getEscapedStringType());
            };
            TymlNodeType.prototype.isEscapedStringBeginIdentifier = function () {
                return this.isType(TymlNodeType.getEscapedStringBeginIdentifierType());
            };
            TymlNodeType.prototype.isEscapedStringEndIdentifier = function () {
                return this.isType(TymlNodeType.getEscapedStringEndIdentifierType());
            };
            TymlNodeType.prototype.isPrimitive = function () {
                return this.isType(TymlNodeType.getPrimitiveType());
            };
            TymlNodeType.prototype.isObject = function () {
                return this.isType(TymlNodeType.getObjectType());
            };
            TymlNodeType.prototype.isTypeIdentifier = function () {
                return this.isType(TymlNodeType.getTypeIdentifierType());
            };
            TymlNodeType.prototype.isAttritubeIdentifier = function () {
                return this.isType(TymlNodeType.getAttributeIdentifierType());
            };
            TymlNodeType.prototype.isAttribute = function () {
                return this.isType(TymlNodeType.getAttributeType());
            };
            TymlNodeType.prototype.isNsAttribute = function () {
                return this.isType(TymlNodeType.getNsAttributeType());
            };
            TymlNodeType.getNodeType = function () {
                return TymlNodeType.getType("$Node");
            };
            TymlNodeType.getDocumentType = function () {
                return TymlNodeType.getType("$Node/Document");
            };
            TymlNodeType.getDocumentHeaderType = function () {
                return TymlNodeType.getType("$Node/DocumentHeader");
            };
            TymlNodeType.getElementType = function () {
                return TymlNodeType.getType("$Node/Element");
            };
            TymlNodeType.getArrayType = function () {
                return TymlNodeType.getType("$Node/Element/Array");
            };
            TymlNodeType.getExplicitArrayType = function () {
                return TymlNodeType.getType("$Node/Element/Array/Explicit");
            };
            TymlNodeType.getMarkupArrayType = function () {
                return TymlNodeType.getType("$Node/Element/Array/Markup");
            };
            TymlNodeType.getStringType = function () {
                return TymlNodeType.getType("$Node/Element/String");
            };
            TymlNodeType.getNormalStringType = function () {
                return TymlNodeType.getType("$Node/Element/String/Normal");
            };
            TymlNodeType.getImplicitStringType = function () {
                return TymlNodeType.getType("$Node/Element/String/Implicit");
            };
            TymlNodeType.getEscapedStringType = function () {
                return TymlNodeType.getType("$Node/Element/String/Escaped");
            };
            TymlNodeType.getEscapedStringBeginIdentifierType = function () {
                return TymlNodeType.getType("$Node/EscapedStringBeginIdentifier");
            };
            TymlNodeType.getEscapedStringEndIdentifierType = function () {
                return TymlNodeType.getType("$Node/EscapedStringEndIdentifier");
            };
            TymlNodeType.getPrimitiveType = function () {
                return TymlNodeType.getType("$Node/Element/Primitive");
            };
            TymlNodeType.getObjectType = function () {
                return TymlNodeType.getType("$Node/Element/Object");
            };
            TymlNodeType.getAttributeIdentifierType = function () {
                return TymlNodeType.getType("$Node/AttributeIdentifier");
            };
            TymlNodeType.getTypeIdentifierType = function () {
                return TymlNodeType.getType("$Node/TypeIdentifier");
            };
            TymlNodeType.getAttributeType = function () {
                return TymlNodeType.getType("$Node/Attribute");
            };
            TymlNodeType.getNsAttributeType = function () {
                return TymlNodeType.getType("$Node/NsAttribute");
            };
            TymlNodeType.types = {};
            return TymlNodeType;
        })();
        Ast.TymlNodeType = TymlNodeType;
    })(Ast = Tyml.Ast || (Tyml.Ast = {}));
})(Tyml || (Tyml = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Tyml;
(function (Tyml) {
    var Ast;
    (function (Ast) {
        var Implementation;
        (function (Implementation) {
            var Args = Tyml.ArgumentExceptionHelper;
            /**
             * Is abstract. Do not construct.
             */
            var TymlNode = (function () {
                function TymlNode(textRegion) {
                    this.parent = null;
                    this.cachedPrefixes = {};
                    Args.ensureUndefinedOrTypeOf(textRegion, Tyml.TextRegion, "region");
                    this.textRegion = typeof textRegion === "undefined" ? null : textRegion;
                    if (this._getIsAbstract())
                        throw new Error("This class is abstract.");
                }
                /**
                 * Internal method. Is used to prohibit creation of abstract classes.
                 */
                TymlNode.prototype._getIsAbstract = function () { return true; };
                /**
                 * Gets the text region. Can be null.
                 */
                TymlNode.prototype.getTextRegion = function () {
                    return this.textRegion;
                };
                /**
                 * Gets the node at the given point.
                 *
                 * @return {TymlNode} the deepest node at point.
                 */
                TymlNode.prototype.getNodeAt = function (point) {
                    Args.ensureTypeOf(point, Tyml.TextPoint, "point");
                    if (this.getTextRegion().contains(point))
                        return this;
                    return null;
                };
                /**
                 * Converts this node to text.
                 */
                TymlNode.prototype.toString = function () {
                    throw new Error("not implemented");
                };
                /**
                 * Gets the type of the node.
                 *
                 * @return {TymlNodeType} the type of the node.
                 */
                TymlNode.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getNodeType();
                };
                /**
                 * Internal method. Will be called on construction of the parent node.
                 */
                TymlNode.prototype._setParent = function (parent) {
                    Args.ensureTypeOf(parent, TymlNode, "parent");
                    if (this.parent === null)
                        this.parent = parent;
                    else
                        throw new Error("_setParent was already called.");
                };
                /**
                 * Resolves a prefix to its associated uri.
                 *
                 * @param {String} prefix the prefix to resolve. Can be empty to resolve the current namespace. Cannot be null.
                 * @return {String} the url associated to the prefix or the null string if the prefix does not exist.
                 */
                TymlNode.prototype.resolvePrefix = function (prefix) {
                    Args.ensureTypeOf(prefix, "string", "prefix");
                    if (this.cachedPrefixes[prefix] !== undefined)
                        return this.cachedPrefixes[prefix];
                    if (this.parent === null) {
                        if (prefix === "")
                            return "";
                        return null;
                    }
                    var result = this.parent.resolvePrefix(prefix);
                    this.cachedPrefixes[prefix] = result;
                    return result;
                };
                /**
                 * Throws an exception if a referenced prefix cannot be resolved.
                 * Will be called automatically by TymlDocument.
                 */
                TymlNode.prototype.validatePrefixes = function () {
                };
                return TymlNode;
            })();
            Implementation.TymlNode = TymlNode;
            var TymlDocument = (function (_super) {
                __extends(TymlDocument, _super);
                function TymlDocument(header, root, textRegion) {
                    _super.call(this, textRegion);
                    this.header = header;
                    this.root = root;
                    Args.ensureTypeOf(header, TymlDocumentHeader, "header");
                    Args.ensureTypeOf(root, TymlObject, "root");
                    root._setParent(this);
                    root.validatePrefixes();
                }
                TymlDocument.prototype.getNodeAt = function (point) {
                    Args.ensureTypeOf(point, Tyml.TextPoint, "point");
                    if (this.header.getTextRegion().contains(point))
                        return this.header.getNodeAt(point);
                    if (this.root.getTextRegion().contains(point))
                        return this.root.getNodeAt(point);
                    return _super.prototype.getNodeAt.call(this, point);
                };
                TymlDocument.prototype._getIsAbstract = function () { return false; };
                TymlDocument.prototype.toString = function () {
                    return this.root.toString();
                };
                TymlDocument.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getDocumentType();
                };
                TymlDocument.prototype.getHeader = function () {
                    return this.header;
                };
                TymlDocument.prototype.getRootNode = function () {
                    return this.root;
                };
                return TymlDocument;
            })(TymlNode);
            Implementation.TymlDocument = TymlDocument;
            var TymlDocumentHeader = (function (_super) {
                __extends(TymlDocumentHeader, _super);
                function TymlDocumentHeader(versionElement, encoding, validator, textRegion) {
                    if (versionElement === void 0) { versionElement = null; }
                    if (encoding === void 0) { encoding = null; }
                    if (validator === void 0) { validator = null; }
                    _super.call(this, textRegion);
                    this.versionElement = versionElement;
                    this.encoding = encoding;
                    this.validator = validator;
                    Args.ensureNullOrTypeOf(versionElement, TymlPrimitive, "versionElement");
                    Args.ensureNullOrTypeOf(encoding, TymlString, "encoding");
                    Args.ensureNullOrTypeOf(validator, TymlString, "validator");
                }
                TymlDocumentHeader.prototype._getIsAbstract = function () { return false; };
                TymlDocumentHeader.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getDocumentHeaderType();
                };
                TymlDocumentHeader.prototype.toString = function () {
                    var versionString = "";
                    if (this.versionElement !== null)
                        versionString = " " + this.versionElement.toString();
                    var encodingString = "";
                    if (this.encoding !== null)
                        encodingString = " " + this.encoding.toString();
                    var validatorString = "";
                    if (this.validator !== null)
                        validatorString = " " + this.validator.toString();
                    return "{!tyml" + versionString + encodingString + validatorString + "}";
                };
                TymlDocumentHeader.prototype.getVersionElement = function () {
                    return this.versionElement;
                };
                TymlDocumentHeader.prototype.getEncoding = function () {
                    return this.encoding;
                };
                TymlDocumentHeader.prototype.getValidator = function () {
                    return this.validator;
                };
                return TymlDocumentHeader;
            })(TymlNode);
            Implementation.TymlDocumentHeader = TymlDocumentHeader;
            /**
             * Is abstract. Do not construct.
             */
            var TymlElement = (function (_super) {
                __extends(TymlElement, _super);
                function TymlElement() {
                    _super.apply(this, arguments);
                }
                TymlElement.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getElementType();
                };
                return TymlElement;
            })(TymlNode);
            Implementation.TymlElement = TymlElement;
            /**
             * Is abstract. Do not construct.
             */
            var TymlArray = (function (_super) {
                __extends(TymlArray, _super);
                function TymlArray(items, textRegion) {
                    var _this = this;
                    _super.call(this, textRegion);
                    Args.ensureArrayTypeOf(items, TymlElement, "items");
                    this.items = items;
                    items.forEach(function (i) { return i._setParent(_this); });
                }
                TymlArray.prototype.getNodeAt = function (point) {
                    Args.ensureTypeOf(point, Tyml.TextPoint, "point");
                    var result = null;
                    this.items.forEach(function (i) {
                        if (i.getTextRegion().contains(point)) {
                            result = i;
                        }
                    });
                    if (result !== null)
                        return result.getNodeAt(point);
                    return _super.prototype.getNodeAt.call(this, point);
                };
                TymlArray.prototype.getItems = function () {
                    return this.items;
                };
                TymlArray.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getArrayType();
                };
                TymlArray.prototype.validatePrefixes = function () {
                    _super.prototype.validatePrefixes.call(this);
                    this.items.forEach(function (i) {
                        i.validatePrefixes();
                    });
                };
                return TymlArray;
            })(TymlElement);
            Implementation.TymlArray = TymlArray;
            var TymlExplicitArray = (function (_super) {
                __extends(TymlExplicitArray, _super);
                function TymlExplicitArray() {
                    _super.apply(this, arguments);
                }
                TymlExplicitArray.prototype._getIsAbstract = function () { return false; };
                TymlExplicitArray.prototype.toString = function () {
                    return "[" + this.getItems().map(function (item) { return item.toString(); }).join(" ") + "]";
                };
                TymlExplicitArray.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getExplicitArrayType();
                };
                return TymlExplicitArray;
            })(TymlArray);
            Implementation.TymlExplicitArray = TymlExplicitArray;
            var TymlMarkupArray = (function (_super) {
                __extends(TymlMarkupArray, _super);
                function TymlMarkupArray() {
                    _super.apply(this, arguments);
                }
                TymlMarkupArray.prototype._getIsAbstract = function () { return false; };
                TymlMarkupArray.prototype.toString = function () {
                    return "![" + this.getItems().map(function (item) { return item.toString(); }).join(" ") + "]";
                };
                TymlMarkupArray.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getMarkupArrayType();
                };
                return TymlMarkupArray;
            })(TymlArray);
            Implementation.TymlMarkupArray = TymlMarkupArray;
            /**
             * Is abstract. Do not construct.
             */
            var TymlString = (function (_super) {
                __extends(TymlString, _super);
                function TymlString(value, textRegion) {
                    _super.call(this, textRegion);
                    Args.ensureTypeOf(value, "string", "value");
                    this.value = value;
                }
                TymlString.prototype.getValue = function () {
                    return this.value;
                };
                TymlString.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getStringType();
                };
                return TymlString;
            })(TymlElement);
            Implementation.TymlString = TymlString;
            var TymlImplicitString = (function (_super) {
                __extends(TymlImplicitString, _super);
                function TymlImplicitString() {
                    _super.apply(this, arguments);
                }
                TymlImplicitString.prototype._getIsAbstract = function () { return false; };
                TymlImplicitString.prototype.toString = function () {
                    return this.getValue();
                };
                TymlImplicitString.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getImplicitStringType();
                };
                return TymlImplicitString;
            })(TymlString);
            Implementation.TymlImplicitString = TymlImplicitString;
            var TymlNormalString = (function (_super) {
                __extends(TymlNormalString, _super);
                function TymlNormalString() {
                    _super.apply(this, arguments);
                }
                TymlNormalString.prototype._getIsAbstract = function () { return false; };
                TymlNormalString.prototype.toString = function () {
                    return "<" + this.getValue() + ">";
                };
                TymlNormalString.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getNormalStringType();
                };
                return TymlNormalString;
            })(TymlString);
            Implementation.TymlNormalString = TymlNormalString;
            var TymlEscapedString = (function (_super) {
                __extends(TymlEscapedString, _super);
                function TymlEscapedString(value, beginIdentifier, endIdentifier, textRegion) {
                    _super.call(this, value, textRegion);
                    this.beginIdentifier = beginIdentifier;
                    this.endIdentifier = endIdentifier;
                    Args.ensureTypeOf(beginIdentifier, TymlEscapedStringBeginIdentifier, "beginIdentifier");
                    Args.ensureTypeOf(endIdentifier, TymlEscapedStringEndIdentifier, "endIdentifier");
                    if (beginIdentifier.getIdentifier() !== endIdentifier.getIdentifier())
                        throw new Error("Begin and end identifier must match!");
                    beginIdentifier._setParent(this);
                    endIdentifier._setParent(this);
                }
                TymlEscapedString.prototype._getIsAbstract = function () { return false; };
                TymlEscapedString.prototype.getIdentifier = function () {
                    return this.beginIdentifier.getIdentifier();
                };
                TymlEscapedString.prototype.getBeginIdentifier = function () {
                    return this.beginIdentifier;
                };
                TymlEscapedString.prototype.getEndIdentifier = function () {
                    return this.endIdentifier;
                };
                TymlEscapedString.prototype.toString = function () {
                    return "<" + this.getIdentifier() + "<" + this.getValue() + ">" + this.getIdentifier() + ">";
                };
                TymlEscapedString.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getEscapedStringType();
                };
                return TymlEscapedString;
            })(TymlString);
            Implementation.TymlEscapedString = TymlEscapedString;
            var TymlEscapedStringIdentifier = (function (_super) {
                __extends(TymlEscapedStringIdentifier, _super);
                function TymlEscapedStringIdentifier(identifier, textRegion) {
                    _super.call(this, textRegion);
                    this.identifier = identifier;
                    Args.ensureTypeOf(identifier, "string", "identifier");
                }
                TymlEscapedStringIdentifier.prototype._getIsAbstract = function () { return true; };
                TymlEscapedStringIdentifier.prototype.getIdentifier = function () {
                    return this.identifier;
                };
                TymlEscapedStringIdentifier.prototype.toString = function () {
                    return this.getIdentifier();
                };
                return TymlEscapedStringIdentifier;
            })(TymlNode);
            Implementation.TymlEscapedStringIdentifier = TymlEscapedStringIdentifier;
            var TymlEscapedStringBeginIdentifier = (function (_super) {
                __extends(TymlEscapedStringBeginIdentifier, _super);
                function TymlEscapedStringBeginIdentifier() {
                    _super.apply(this, arguments);
                }
                TymlEscapedStringBeginIdentifier.prototype._getIsAbstract = function () { return false; };
                TymlEscapedStringBeginIdentifier.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getEscapedStringBeginIdentifierType();
                };
                return TymlEscapedStringBeginIdentifier;
            })(TymlEscapedStringIdentifier);
            Implementation.TymlEscapedStringBeginIdentifier = TymlEscapedStringBeginIdentifier;
            var TymlEscapedStringEndIdentifier = (function (_super) {
                __extends(TymlEscapedStringEndIdentifier, _super);
                function TymlEscapedStringEndIdentifier() {
                    _super.apply(this, arguments);
                }
                TymlEscapedStringEndIdentifier.prototype._getIsAbstract = function () { return false; };
                TymlEscapedStringEndIdentifier.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getEscapedStringEndIdentifierType();
                };
                return TymlEscapedStringEndIdentifier;
            })(TymlEscapedStringIdentifier);
            Implementation.TymlEscapedStringEndIdentifier = TymlEscapedStringEndIdentifier;
            var TymlPrimitive = (function (_super) {
                __extends(TymlPrimitive, _super);
                function TymlPrimitive(value, textRegion) {
                    _super.call(this, textRegion);
                    Args.ensureTypeOf(value, "string", "value");
                    this.value = value;
                }
                TymlPrimitive.prototype._getIsAbstract = function () { return false; };
                TymlPrimitive.prototype.toString = function () {
                    return this.value;
                };
                TymlPrimitive.prototype.getValue = function () {
                    return this.value;
                };
                TymlPrimitive.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getPrimitiveType();
                };
                return TymlPrimitive;
            })(TymlElement);
            Implementation.TymlPrimitive = TymlPrimitive;
            var TymlObject = (function (_super) {
                __extends(TymlObject, _super);
                function TymlObject(typeIdentifier, attributes, implicitAttributes, namespacePrefixDefinitions, textRegion) {
                    var _this = this;
                    _super.call(this, textRegion);
                    Args.ensureTypeOf(typeIdentifier, TymlTypeIdentifier, "type");
                    Args.ensureArrayTypeOf(attributes, TymlAttribute, "attributes");
                    Args.ensureArrayTypeOf(implicitAttributes, TymlElement, "implicitAttributes");
                    Args.ensureArrayTypeOf(namespacePrefixDefinitions, TymlNsAttribute, "namespacePrefixDefinitions");
                    this.typeIdentifier = typeIdentifier;
                    this.attributes = attributes;
                    this.implicitAttributes = implicitAttributes;
                    this.namespacePrefixDefinitions = namespacePrefixDefinitions;
                    typeIdentifier._setParent(this);
                    attributes.forEach(function (i) { return i._setParent(_this); });
                    implicitAttributes.forEach(function (i) { return i._setParent(_this); });
                    namespacePrefixDefinitions.forEach(function (i) { return i._setParent(_this); });
                }
                TymlObject.prototype._getIsAbstract = function () { return false; };
                TymlObject.prototype.toString = function () {
                    var att = this.attributes.map(function (a) { return a.toString(); }).join(" ");
                    if (att !== "")
                        att = " " + att;
                    var imp = this.implicitAttributes.map(function (a) { return a.toString(); }).join(" ");
                    if (imp !== "")
                        imp = " " + imp;
                    return "{" + this.typeIdentifier.toString() + att + imp + "}";
                };
                TymlObject.prototype.getNodeAt = function (point) {
                    Args.ensureTypeOf(point, Tyml.TextPoint, "point");
                    if (this.typeIdentifier.getTextRegion().contains(point)) {
                        return this.typeIdentifier.getNodeAt(point);
                    }
                    var result = null;
                    this.implicitAttributes.forEach(function (i) {
                        if (i.getTextRegion().contains(point))
                            result = i;
                    });
                    if (result === null) {
                        this.attributes.forEach(function (i) {
                            if (i.getTextRegion().contains(point))
                                result = i;
                        });
                    }
                    if (result === null) {
                        this.namespacePrefixDefinitions.forEach(function (i) {
                            if (i.getTextRegion().contains(point))
                                result = i;
                        });
                    }
                    if (result !== null)
                        return result.getNodeAt(point);
                    return _super.prototype.getNodeAt.call(this, point);
                };
                TymlObject.prototype.getTypeIdentifier = function () {
                    return this.typeIdentifier;
                };
                TymlObject.prototype.getAttributes = function () {
                    return this.attributes;
                };
                TymlObject.prototype.getImplicitAttributes = function () {
                    return this.implicitAttributes;
                };
                TymlObject.prototype.getNamespacePrefixDefinitions = function () {
                    return this.namespacePrefixDefinitions;
                };
                TymlObject.prototype.resolvePrefix = function (prefix) {
                    Args.ensureTypeOf(prefix, "string", "prefix");
                    for (var i in this.namespacePrefixDefinitions) {
                        var p = this.namespacePrefixDefinitions[i];
                        if (p.getPrefix() === prefix)
                            return p.getNamespace().getValue();
                    }
                    return _super.prototype.resolvePrefix.call(this, prefix);
                };
                TymlObject.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getObjectType();
                };
                TymlObject.prototype.validatePrefixes = function () {
                    _super.prototype.validatePrefixes.call(this);
                    this.typeIdentifier.validatePrefixes();
                    this.attributes.forEach(function (a) { return a.validatePrefixes(); });
                    this.implicitAttributes.forEach(function (a) { return a.validatePrefixes(); });
                };
                return TymlObject;
            })(TymlElement);
            Implementation.TymlObject = TymlObject;
            /**
             * Is abstract. Do not construct.
             */
            var TymlIdentifier = (function (_super) {
                __extends(TymlIdentifier, _super);
                function TymlIdentifier(prefix, name, textRegion) {
                    _super.call(this, textRegion);
                    Args.ensureTypeOf(prefix, "string", "prefix");
                    Args.ensureTypeOf(name, "string", "name");
                    this.name = name;
                    this.prefix = prefix;
                }
                TymlIdentifier.prototype.toString = function () {
                    if (this.getPrefix() === "")
                        return this.getName();
                    return this.getPrefix() + "/" + this.getName();
                };
                TymlIdentifier.prototype.getPrefix = function () {
                    return this.prefix;
                };
                TymlIdentifier.prototype.getName = function () {
                    return this.name;
                };
                /**
                 * Returns the namespace. Will not be null.
                 */
                TymlIdentifier.prototype.getNamespace = function () {
                    var result = this.resolvePrefix(this.prefix);
                    if (result == null)
                        throw new Error("Prefix '" + this.prefix + "' is not defined.");
                    return result;
                };
                TymlIdentifier.prototype.getFullQualifiedName = function () {
                    var ns = this.getNamespace();
                    if (ns === "")
                        return this.getName();
                    else
                        return ns + "#" + this.getName();
                };
                TymlIdentifier.prototype.validatePrefixes = function () {
                    _super.prototype.validatePrefixes.call(this);
                    this.getNamespace();
                };
                return TymlIdentifier;
            })(TymlNode);
            Implementation.TymlIdentifier = TymlIdentifier;
            var TymlTypeIdentifier = (function (_super) {
                __extends(TymlTypeIdentifier, _super);
                function TymlTypeIdentifier() {
                    _super.apply(this, arguments);
                }
                TymlTypeIdentifier.prototype._getIsAbstract = function () { return false; };
                TymlTypeIdentifier.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getTypeIdentifierType();
                };
                return TymlTypeIdentifier;
            })(TymlIdentifier);
            Implementation.TymlTypeIdentifier = TymlTypeIdentifier;
            var TymlAttributeIdentifier = (function (_super) {
                __extends(TymlAttributeIdentifier, _super);
                function TymlAttributeIdentifier() {
                    _super.apply(this, arguments);
                }
                TymlAttributeIdentifier.prototype._getIsAbstract = function () { return false; };
                TymlAttributeIdentifier.prototype.getNamespace = function () {
                    if (this.getPrefix() === "")
                        return "";
                    return _super.prototype.getNamespace.call(this);
                };
                TymlAttributeIdentifier.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getAttributeIdentifierType();
                };
                return TymlAttributeIdentifier;
            })(TymlIdentifier);
            Implementation.TymlAttributeIdentifier = TymlAttributeIdentifier;
            var TymlAttribute = (function (_super) {
                __extends(TymlAttribute, _super);
                function TymlAttribute(identifier, value, textRegion) {
                    _super.call(this, textRegion);
                    Args.ensureTypeOf(identifier, TymlAttributeIdentifier, "identifier");
                    Args.ensureTypeOf(value, TymlElement, "value");
                    this.identifier = identifier;
                    this.value = value;
                    identifier._setParent(this);
                    value._setParent(this);
                }
                TymlAttribute.prototype._getIsAbstract = function () { return false; };
                TymlAttribute.prototype.getNodeAt = function (point) {
                    Args.ensureTypeOf(point, Tyml.TextPoint, "point");
                    if (this.identifier.getTextRegion().contains(point))
                        return this.identifier.getNodeAt(point);
                    if (this.value.getTextRegion().contains(point))
                        return this.value.getNodeAt(point);
                    return _super.prototype.getNodeAt.call(this, point);
                };
                TymlAttribute.prototype.getIdentifier = function () {
                    return this.identifier;
                };
                TymlAttribute.prototype.getValue = function () {
                    return this.value;
                };
                TymlAttribute.prototype.toString = function () {
                    return this.identifier.toString() + ": " + this.value.toString();
                };
                TymlAttribute.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getAttributeType();
                };
                TymlAttribute.prototype.validatePrefixes = function () {
                    _super.prototype.validatePrefixes.call(this);
                    this.identifier.validatePrefixes();
                    this.value.validatePrefixes();
                };
                return TymlAttribute;
            })(TymlNode);
            Implementation.TymlAttribute = TymlAttribute;
            var TymlNsAttribute = (function (_super) {
                __extends(TymlNsAttribute, _super);
                function TymlNsAttribute(prefix, namespace, textRegion) {
                    _super.call(this, textRegion);
                    Args.ensureTypeOf(prefix, "string", "prefix");
                    Args.ensureTypeOf(namespace, TymlString, "namespace");
                    this.prefix = prefix;
                    this.namespace = namespace;
                    namespace._setParent(this);
                }
                TymlNsAttribute.prototype._getIsAbstract = function () { return false; };
                TymlNsAttribute.prototype.getPrefix = function () {
                    return this.prefix;
                };
                TymlNsAttribute.prototype.getNamespace = function () {
                    return this.namespace;
                };
                TymlNsAttribute.prototype.toString = function () {
                    return this.prefix + ": " + this.namespace.toString();
                };
                TymlNsAttribute.prototype.getNodeType = function () {
                    return Ast.TymlNodeType.getNsAttributeType();
                };
                return TymlNsAttribute;
            })(TymlNode);
            Implementation.TymlNsAttribute = TymlNsAttribute;
        })(Implementation = Ast.Implementation || (Ast.Implementation = {}));
    })(Ast = Tyml.Ast || (Tyml.Ast = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Parser;
    (function (Parser) {
        (function (MessageType) {
            MessageType[MessageType["FATAL"] = 0] = "FATAL";
            MessageType[MessageType["ERROR"] = 1] = "ERROR";
            MessageType[MessageType["WARNING"] = 2] = "WARNING";
            MessageType[MessageType["INFO"] = 3] = "INFO";
        })(Parser.MessageType || (Parser.MessageType = {}));
        var MessageType = Parser.MessageType;
        var Message = (function () {
            function Message(type, messageId, messageArguments, message, textRegion) {
                this.type = type;
                this.messageArguments = messageArguments;
                this.message = message;
                this.messageId = messageId;
                this.textRegion = textRegion;
            }
            Message.prototype.getType = function () {
                return this.type;
            };
            Message.prototype.getArguments = function () {
                return this.messageArguments;
            };
            Message.prototype.getMessage = function () {
                return this.message;
            };
            /**
             * The id of this message type. The set of message ids ever returned by the parser must be finite.
             */
            Message.prototype.getMessageId = function () {
                return this.messageId;
            };
            /**
             * The text region. Can be null to indicate a message which does not belong to a text block.
             */
            Message.prototype.getTextRegion = function () {
                return this.textRegion;
            };
            return Message;
        })();
        Parser.Message = Message;
        var ParseResult = (function () {
            function ParseResult(doc, messages) {
                this.doc = doc;
                this.messages = messages;
            }
            ParseResult.prototype.getDocument = function () {
                return this.doc;
            };
            ParseResult.prototype.getMessages = function () {
                return this.messages;
            };
            return ParseResult;
        })();
        Parser.ParseResult = ParseResult;
    })(Parser = Tyml.Parser || (Tyml.Parser = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Parser;
    (function (Parser) {
        var Tokenizer = (function () {
            function Tokenizer(text) {
                this.currentPosition = 0;
                this.currentLine = 0;
                this.currentColumn = 0;
                this.text = text;
            }
            /**
             * Tries to read text. If successful, true will be returned.
             * If not successful, the position will be resetted to the state
             * before the method call and false will be returned
             */
            Tokenizer.prototype.tryRead = function (expectedText, consume) {
                if (consume === void 0) { consume = true; }
                var pos = this.getPosition();
                for (var i = 0; i < expectedText.length; i++) {
                    if (this.read() !== expectedText.charAt(i)) {
                        this.gotoPosition(pos);
                        return false;
                    }
                }
                if (!consume)
                    this.gotoPosition(pos);
                return true;
            };
            /**
             * Returns the next character.
             * An empty string will be returned if there is no next character.
             */
            Tokenizer.prototype.peek = function () {
                if (this.currentPosition >= this.text.length)
                    return "";
                return this.text.charAt(this.currentPosition);
            };
            Tokenizer.prototype.read = function () {
                if (this.currentPosition >= this.text.length)
                    return "";
                var result = this.text.charAt(this.currentPosition);
                this.currentPosition++;
                if (result === "\n") {
                    this.currentLine++;
                    this.currentColumn = 0;
                }
                else {
                    this.currentColumn++;
                }
                return result;
            };
            Tokenizer.prototype.getPosition = function () {
                return { position: this.currentPosition, column: this.currentColumn, line: this.currentLine };
            };
            Tokenizer.prototype.gotoPosition = function (position) {
                this.currentPosition = position.position;
                this.currentColumn = position.column;
                this.currentLine = position.line;
            };
            Tokenizer.prototype.readWhile = function (condition) {
                var chars = "";
                while (true) {
                    var nextChar = this.peek();
                    if (nextChar === "" || !condition(nextChar))
                        break;
                    this.read();
                    chars += nextChar;
                }
                return chars;
            };
            Tokenizer.prototype.getRegion = function (startPos) {
                return new Tyml.TextRegion(startPos.line, startPos.column, this.currentLine, this.currentColumn);
            };
            return Tokenizer;
        })();
        Parser.Tokenizer = Tokenizer;
    })(Parser = Tyml.Parser || (Tyml.Parser = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Parser;
    (function (Parser) {
        var MessageDictionary = (function () {
            function MessageDictionary() {
            }
            MessageDictionary.prototype.getUnexpectedCharactersBeforeDocumentMessage = function (unexpectedChars) {
                return "Unexpected characters";
            };
            MessageDictionary.prototype.getNoDocumentHeaderMessage = function () {
                return "No document header found";
            };
            MessageDictionary.prototype.getEndOfDocumentExpectedMessage = function () {
                return "End of document expected";
            };
            MessageDictionary.prototype.getExpectedStringNotFoundMessage = function (expected) {
                return "Expected '" + expected + "'";
            };
            MessageDictionary.prototype.getUnexpectedColonOrMissingAttributeNameMessage = function () {
                return "Unexpected ':' or missing attribute name";
            };
            MessageDictionary.prototype.getExpectedWhitespaceNotFoundMessage = function (lastElementType, currentElementType) {
                if (lastElementType === currentElementType)
                    return "Whitespace expected between two " + currentElementType + "s";
                else
                    return "Whitespace expected between " + lastElementType + " and " + currentElementType;
            };
            MessageDictionary.prototype.getNamespacePrefixDefinitionsMustBeFirstMessage = function (prefix) {
                return "Namespace prefix definition of '" + prefix + "' must be directly after the type identifier";
            };
            MessageDictionary.prototype.getNamespacePrefixAlreadyDefined = function (prefix) {
                return "Namespace prefix '" + prefix + "' was already defined";
            };
            MessageDictionary.prototype.getNamespacePrefixAlreadyDefinedInTheSameObject = function (prefix) {
                return "Namespace prefix '" + prefix + "' was already defined in the same object";
            };
            MessageDictionary.prototype.getPrefixNotDefinedMessage = function (prefix) {
                return "Prefix '" + prefix + "' is not defined";
            };
            MessageDictionary.prototype.getTypeIdentifierCannotBeEmptyMessage = function () {
                return "Type identifier cannot be empty";
            };
            MessageDictionary.prototype.getTypeIdentifierCannotStartWithMessage = function (cannotStartWith) {
                return "Type identifier cannot start with '" + cannotStartWith + "'";
            };
            MessageDictionary.prototype.getOnlyOnePrefixIsAllowedInTypeIdentifierMessage = function () {
                return "Only one prefix is allowed in type identifier";
            };
            MessageDictionary.prototype.getUnexpectedCharacterInPrimitiveMessage = function (character) {
                return "Unexpected character '" + character + "' in primitive";
            };
            MessageDictionary.prototype.getUnexpectedCharacterInMarkupArrayMessage = function (character) {
                return "Unexpected character '" + character + "' in markup array";
            };
            MessageDictionary.prototype.getUnclosedObjectMessage = function () {
                return "Object not closed, no matching '}'";
            };
            MessageDictionary.prototype.getUnclosedMarkupArrayMessage = function () {
                return "Markup array not closed, no matching ']'";
            };
            MessageDictionary.prototype.getUnclosedArrayMessage = function () {
                return "Array not closed, no matching ']'";
            };
            MessageDictionary.prototype.getExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFoundMessage = function (gotActual) {
                return "Expected hexadecimal digit, but got '" + gotActual + "'";
            };
            MessageDictionary.prototype.getUnrecognizedEscapeSequenceMessage = function (escapeSequence) {
                return "Unrecognized escape sequence: '" + escapeSequence + "'";
            };
            MessageDictionary.prototype.getInvalidEscapedStringIdentifierMessage = function (unexpectedCharacter) {
                return "Invalid escaped string identifier, unexpected character '" + unexpectedCharacter + "'";
            };
            return MessageDictionary;
        })();
        Parser.MessageDictionary = MessageDictionary;
    })(Parser = Tyml.Parser || (Tyml.Parser = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Parser;
    (function (Parser) {
        var GermanMessageDictionary = (function (_super) {
            __extends(GermanMessageDictionary, _super);
            function GermanMessageDictionary() {
                _super.apply(this, arguments);
            }
            GermanMessageDictionary.prototype.getUnexpectedCharactersBeforeDocumentMessage = function (unexpectedChars) {
                return "Unerwartete Zeichen";
            };
            GermanMessageDictionary.prototype.getNoDocumentHeaderMessage = function () {
                return "Kein Dokument-Header gefunden";
            };
            GermanMessageDictionary.prototype.getEndOfDocumentExpectedMessage = function () {
                return "Dokument-Ende erwartet";
            };
            GermanMessageDictionary.prototype.getExpectedStringNotFoundMessage = function (expected) {
                return "'" + expected + "' erwartet";
            };
            GermanMessageDictionary.prototype.getUnexpectedColonOrMissingAttributeNameMessage = function () {
                return "Unerwartetes Zeichen ':' oder fehlender Attribut-Name";
            };
            GermanMessageDictionary.prototype.getExpectedWhitespaceNotFoundMessage = function (lastElementType, currentElementType) {
                if (lastElementType === currentElementType)
                    return "Leerzeichen zwischen zwei " + currentElementType + "s wird erwartet";
                else
                    return "Leerzeichen zwischen " + lastElementType + " und " + currentElementType + " wird erwartet";
            };
            GermanMessageDictionary.prototype.getTypeIdentifierCannotBeEmptyMessage = function () {
                return "Typ-Bezeichner kann nicht leer sein";
            };
            GermanMessageDictionary.prototype.getTypeIdentifierCannotStartWithMessage = function (cannotStartWith) {
                return "Typ-Bezeichner kann nicht mit '" + cannotStartWith + "' anfangen";
            };
            GermanMessageDictionary.prototype.getOnlyOnePrefixIsAllowedInTypeIdentifierMessage = function () {
                return "Höchstens ein Prefix ist in einem Typ-Bezeichner erlaubt";
            };
            GermanMessageDictionary.prototype.getUnexpectedCharacterInPrimitiveMessage = function (character) {
                return "Unerwartetes Zeichen '" + character + "' in einem Primitiv";
            };
            GermanMessageDictionary.prototype.getUnexpectedCharacterInMarkupArrayMessage = function (character) {
                return "Unerwartetes Zeichen '" + character + "' in einem Markup-Array";
            };
            GermanMessageDictionary.prototype.getUnclosedObjectMessage = function () {
                return "Objekt wurde nicht geschlossen, kein passendes '}' wurde gefunden";
            };
            GermanMessageDictionary.prototype.getUnclosedMarkupArrayMessage = function () {
                return "Markup-Array wurde nicht geschlossen, kein passendes '}' wurde gefunden";
            };
            GermanMessageDictionary.prototype.getUnclosedArrayMessage = function () {
                return "Array wurde nicht geschlossen, kein passendes '}' wurde gefunden";
            };
            GermanMessageDictionary.prototype.getExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFoundMessage = function (gotActual) {
                return "Hexadezimale Ziffer wurde erwartet, aber '" + gotActual + "' wurde gefunden";
            };
            GermanMessageDictionary.prototype.getUnrecognizedEscapeSequenceMessage = function (escapeSequence) {
                return "Escapesequenz '" + escapeSequence + "' wurde nicht erkannt";
            };
            GermanMessageDictionary.prototype.getInvalidEscapedStringIdentifierMessage = function (unexpectedCharacter) {
                return "Ungültiger Maskierungsbezeichner, das Zeichen '" + unexpectedCharacter + "' ist nicht erlaubt";
            };
            return GermanMessageDictionary;
        })(Parser.MessageDictionary);
        Parser.GermanMessageDictionary = GermanMessageDictionary;
    })(Parser = Tyml.Parser || (Tyml.Parser = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Parser;
    (function (Parser_1) {
        var Logger = (function () {
            function Logger(messageDictionary) {
                this.messageDictionary = messageDictionary;
                this.messages = [];
            }
            Logger.prototype.getMessages = function () {
                return this.messages;
            };
            Logger.prototype.logError = function (code, message, region) {
                if (typeof region === "undefined")
                    region = null;
                this.messages.push(new Parser_1.Message(Parser_1.MessageType.ERROR, "TymlError" + code, {}, message + ".", region));
            };
            Logger.prototype.logExpectedTokensNotFound = function (expected, region) {
                this.logError(100, this.messageDictionary.getExpectedStringNotFoundMessage(expected), region);
            };
            Logger.prototype.logUnexpectedCharactersBeforeDocument = function (unexpectedChars, region) {
                this.logError(210, this.messageDictionary.getUnexpectedCharactersBeforeDocumentMessage(unexpectedChars), region);
            };
            Logger.prototype.logNoDocumentHeader = function () {
                this.logError(220, this.messageDictionary.getNoDocumentHeaderMessage());
            };
            Logger.prototype.logEndOfDocumentExpected = function (region) {
                this.logError(230, this.messageDictionary.getEndOfDocumentExpectedMessage(), region);
            };
            Logger.prototype.logUnexpectedCharacterInPrimitive = function (character, region) {
                this.logError(300, this.messageDictionary.getUnexpectedCharacterInPrimitiveMessage(character), region);
            };
            Logger.prototype.logUnrecognizedEscapeSequence = function (escapeSequence, region) {
                this.logError(410, this.messageDictionary.getUnrecognizedEscapeSequenceMessage(escapeSequence), region);
            };
            Logger.prototype.logExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFound = function (gotActual, region) {
                this.logError(420, this.messageDictionary.getExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFoundMessage(gotActual), region);
            };
            Logger.prototype.logInvalidEscapedStringIdentifier = function (unexpectedCharacter, region) {
                this.logError(500, this.messageDictionary.getInvalidEscapedStringIdentifierMessage(unexpectedCharacter), region);
            };
            Logger.prototype.logTypeIdentifierCannotBeEmpty = function (region) {
                this.logError(611, this.messageDictionary.getTypeIdentifierCannotBeEmptyMessage(), region);
            };
            Logger.prototype.logTypeIdentifierCannotStartWith = function (cannotStartWith, region) {
                this.logError(612, this.messageDictionary.getTypeIdentifierCannotStartWithMessage(cannotStartWith), region);
            };
            Logger.prototype.logOnlyOnePrefixIsAllowedInTypeIdentifier = function (region) {
                this.logError(615, this.messageDictionary.getOnlyOnePrefixIsAllowedInTypeIdentifierMessage(), region);
            };
            Logger.prototype.logUnexpectedColonOrMissingAttributeName = function (region) {
                this.logError(620, this.messageDictionary.getUnexpectedColonOrMissingAttributeNameMessage(), region);
            };
            Logger.prototype.logExpectedWhitespaceNotFoundInObject = function (lastElementType, currentElementType, whitespaceErrorRegion) {
                this.logError(630, this.messageDictionary.getExpectedWhitespaceNotFoundMessage(lastElementType, currentElementType), whitespaceErrorRegion);
            };
            Logger.prototype.logUnclosedObject = function (region) {
                this.logError(640, this.messageDictionary.getUnclosedObjectMessage(), region);
            };
            Logger.prototype.logNamespacePrefixDefinitionsMustBeFirst = function (prefix, region) {
                this.logError(650, this.messageDictionary.getNamespacePrefixDefinitionsMustBeFirstMessage(prefix), region);
            };
            Logger.prototype.logNamespacePrefixAlreadyDefined = function (prefix, region) {
                this.logError(655, this.messageDictionary.getNamespacePrefixAlreadyDefined(prefix), region);
            };
            Logger.prototype.logNamespacePrefixAlreadyDefinedInTheSameObject = function (prefix, region) {
                this.logError(656, this.messageDictionary.getNamespacePrefixAlreadyDefinedInTheSameObject(prefix), region);
            };
            Logger.prototype.logPrefixNotDefined = function (prefix, region) {
                this.logError(670, this.messageDictionary.getPrefixNotDefinedMessage(prefix), region);
            };
            Logger.prototype.logUnclosedArray = function (region) {
                this.logError(700, this.messageDictionary.getUnclosedArrayMessage(), region);
            };
            Logger.prototype.logUnexpectedCharacterInMarkupArray = function (character, region) {
                this.logError(810, this.messageDictionary.getUnexpectedCharacterInMarkupArrayMessage(character), region);
            };
            Logger.prototype.logUnclosedMarkupArray = function (region) {
                this.logError(820, this.messageDictionary.getUnclosedMarkupArrayMessage(), region);
            };
            return Logger;
        })();
        var State = (function () {
            function State(parent, prefixes) {
                if (parent === void 0) { parent = null; }
                if (prefixes === void 0) { prefixes = {}; }
                this.parent = parent;
                this.prefixes = prefixes;
            }
            State.prototype.isPrefixDefined = function (prefix) {
                if (this.prefixes[prefix] === true)
                    return true;
                if (this.parent !== null)
                    return this.parent.isPrefixDefined(prefix);
                return false;
            };
            return State;
        })();
        var Parser = (function () {
            /**
             * Creates a new parser.
             *
             * @param {MessageDictionary} messageDictionary the text used for messages.
             */
            function Parser(messageDictionary) {
                this.messageDictionary = messageDictionary;
                this.letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                this.numbers = "0123456789";
                this.isValidIdentifierFirstLetter = this.getInStringMatcher(this.letters + "_");
                this.isValidIdentifierOtherLetter = this.getInStringMatcher(this.letters + this.numbers + "._-");
                this.isValidPrimitiveLetter = this.getInStringMatcher(this.letters + this.numbers + "_-+*=|~!?.,;/\"'()^&@%$#");
                this.isWhitespaceChar = this.getInStringMatcher(" \n\r\t");
                Tyml.ArgumentExceptionHelper.ensureUndefinedOrTypeOf(messageDictionary, Parser_1.MessageDictionary, "messageDictionary");
                if (typeof messageDictionary === "undefined")
                    this.messageDictionary = new Parser_1.MessageDictionary();
            }
            Parser.prototype.getInStringMatcher = function (str) {
                return function (c) {
                    if (c.length !== 1)
                        return false;
                    return str.indexOf(c) !== -1;
                };
            };
            /**
             * Parses the given text and returns a parse result.
             *
             * @param {string} text the text to parse. Cannot be null.
             * @return {ParseResult} the parsed result.
             */
            Parser.prototype.parse = function (text) {
                Tyml.ArgumentExceptionHelper.ensureTypeOf(text, "string", "text");
                var t = new Parser_1.Tokenizer(text);
                var logger = new Logger(this.messageDictionary);
                var doc = this.parseDocument(t, logger, new State());
                return new Parser_1.ParseResult(doc, logger.getMessages());
            };
            Parser.prototype.parseDocument = function (t, logger, s) {
                var startPos = t.getPosition();
                var invalidChars = t.readWhile(function (c) { return c != "{"; });
                if (invalidChars !== "") {
                    logger.logUnexpectedCharactersBeforeDocument(invalidChars, t.getRegion(startPos));
                }
                var header = this.tryReadDocumentHeader(t, logger, s);
                if (header === null) {
                    logger.logNoDocumentHeader();
                }
                this.parseWhitespace(t, logger, s);
                var obj = this.parseObject(t, logger, s);
                this.parseWhitespace(t, logger, s);
                var pos = t.getPosition();
                invalidChars = t.readWhile(function (c) { return true; });
                if (invalidChars !== "") {
                    logger.logEndOfDocumentExpected(t.getRegion(pos));
                }
                return new Tyml.Ast.Implementation.TymlDocument(header, obj, t.getRegion(startPos));
            };
            Parser.prototype.tryReadDocumentHeader = function (t, logger, s) {
                var startPos = t.getPosition();
                if (!t.tryRead("{!tyml"))
                    return null;
                var versionElement = null;
                var encodingElement = null;
                var validatorElement = null;
                if (t.tryRead(" 1.0", false)) {
                    t.read(); // " "
                    versionElement = this.parsePrimitive(t, logger, s);
                }
                if (t.tryRead(" encoding")) {
                    this.expect(t, logger, ":");
                    encodingElement = this.parseString(t, logger, s);
                }
                if (t.tryRead(" validator")) {
                    this.expect(t, logger, ":");
                    validatorElement = this.parseString(t, logger, s);
                }
                this.expect(t, logger, "}");
                return new Tyml.Ast.Implementation.TymlDocumentHeader(versionElement, encodingElement, validatorElement, t.getRegion(startPos));
            };
            Parser.prototype.tryReadComment = function (t, logger, s) {
                if (t.tryRead("{--")) {
                    t.readWhile(function (c) { return c == " "; });
                    if (t.peek() === "<") {
                        this.parseString(t, logger, s);
                        t.readWhile(function (c) { return c == " "; });
                        this.expect(t, logger, "--}");
                    }
                    else
                        t.readWhile(function (c) { return !t.tryRead("--}"); });
                    return true;
                }
                return null;
            };
            /**
             * Parses whitespaces and comments. Null will be returned,
             * if no whitespace or comment could be parsed.
             */
            Parser.prototype.parseWhitespace = function (t, logger, s) {
                var whitespace = "";
                while (true) {
                    var nextChar = t.peek();
                    if (nextChar === "{" && this.tryReadComment(t, logger, s)) {
                        whitespace += " ";
                        continue;
                    }
                    if (!this.isWhitespaceChar(nextChar))
                        break;
                    t.read();
                    whitespace += nextChar;
                }
                if (whitespace === "")
                    return null;
                return true;
            };
            Parser.prototype.expect = function (t, logger, expected) {
                if (!t.tryRead(expected)) {
                    var pos = t.getPosition();
                    logger.logExpectedTokensNotFound(expected, t.getRegion(pos));
                    return false;
                }
                return true;
            };
            Parser.prototype.parseObject = function (t, logger, s) {
                var startPos = t.getPosition();
                this.expect(t, logger, "{");
                var openingBracket = t.getRegion(startPos);
                var identifier = this.parseTypeIdentifier(t, logger, s);
                var implicitAttributes = [];
                var attributes = [];
                var namespacePrefixDefinitions = [];
                this.parseInnerObject(t, logger, s, implicitAttributes, attributes, namespacePrefixDefinitions);
                if (!t.tryRead("}")) {
                    logger.logUnclosedObject(openingBracket);
                }
                return new Tyml.Ast.Implementation.TymlObject(identifier, attributes, implicitAttributes, namespacePrefixDefinitions, t.getRegion(startPos));
            };
            Parser.prototype.parseInnerObject = function (t, logger, s, implicitAttributes, attributes, namespacePrefixDefinitions) {
                var newState = s;
                var lastElementType = "type";
                var newPrefixes = {};
                while (true) {
                    var whitespace = this.parseWhitespace(t, logger, newState);
                    var nextChar = t.peek();
                    if (nextChar === "}" || nextChar === "")
                        break;
                    if (nextChar === ":") {
                        var p = t.getPosition();
                        t.read();
                        logger.logUnexpectedColonOrMissingAttributeName(t.getRegion(p));
                        continue;
                    }
                    var logWhitespaceError = false;
                    var whitespaceErrorRegion = null;
                    if (whitespace === null) {
                        logWhitespaceError = true;
                        whitespaceErrorRegion = t.getRegion(t.getPosition());
                    }
                    var nsAttr = this.tryParseNamespacePrefixDefinition(t, logger, newState);
                    if (nsAttr !== null) {
                        var prefix = nsAttr.getPrefix();
                        if (newPrefixes == null)
                            logger.logNamespacePrefixDefinitionsMustBeFirst(prefix, nsAttr.getTextRegion());
                        else if (newState.isPrefixDefined(prefix))
                            logger.logNamespacePrefixAlreadyDefined(prefix, nsAttr.getTextRegion());
                        else if (newPrefixes[prefix] === true)
                            logger.logNamespacePrefixAlreadyDefinedInTheSameObject(prefix, nsAttr.getTextRegion());
                        else {
                            if (prefix !== "")
                                newPrefixes[prefix] = true;
                            namespacePrefixDefinitions.push(nsAttr);
                        }
                        continue;
                    }
                    if (newPrefixes !== null) {
                        newState = new State(newState, newPrefixes);
                        newPrefixes = null;
                    }
                    var attrStartPos = t.getPosition();
                    var attrIdentifier = this.tryParseAttributeIdentifier(t, logger, newState);
                    if (attrIdentifier !== null) {
                        t.read(); // read ":"
                        this.parseWhitespace(t, logger, newState);
                    }
                    var element = this.parseElement(t, logger, newState);
                    var currentElementType;
                    if (attrIdentifier === null) {
                        implicitAttributes.push(element);
                        currentElementType = "element";
                    }
                    else {
                        var attribute = new Tyml.Ast.Implementation.TymlAttribute(attrIdentifier, element, t.getRegion(attrStartPos));
                        attributes.push(attribute);
                        currentElementType = "attribute";
                    }
                    if (logWhitespaceError) {
                        logger.logExpectedWhitespaceNotFoundInObject(lastElementType, currentElementType, whitespaceErrorRegion);
                    }
                    lastElementType = currentElementType;
                }
                this.parseWhitespace(t, logger, newState);
            };
            Parser.prototype.parseTypeIdentifier = function (t, logger, s) {
                var startPos = t.getPosition();
                if (t.peek() === "?") {
                    t.read();
                    return new Tyml.Ast.Implementation.TymlTypeIdentifier("", "?", t.getRegion(startPos));
                }
                var identifier = "";
                var prefix = null;
                while (true) {
                    var c = t.peek();
                    if (identifier === "" && !this.isValidIdentifierFirstLetter(c)) {
                        if (this.isWhitespaceChar(c))
                            logger.logTypeIdentifierCannotBeEmpty(t.getRegion(startPos));
                        else
                            logger.logTypeIdentifierCannotStartWith(c, t.getRegion(startPos));
                        return new Tyml.Ast.Implementation.TymlTypeIdentifier("", "?", t.getRegion(startPos));
                    }
                    if (c === "/") {
                        if (prefix !== null) {
                            var p = t.getPosition();
                            t.read();
                            logger.logOnlyOnePrefixIsAllowedInTypeIdentifier(t.getRegion(p));
                            continue;
                        }
                        else {
                            prefix = identifier;
                            identifier = "";
                        }
                        t.read();
                    }
                    else if (!this.isValidIdentifierOtherLetter(c)) {
                        break;
                    }
                    else
                        identifier += t.read();
                }
                if (prefix === null)
                    prefix = "";
                else if (!s.isPrefixDefined(prefix)) {
                    logger.logPrefixNotDefined(prefix, t.getRegion(startPos));
                    prefix = "";
                }
                return new Tyml.Ast.Implementation.TymlTypeIdentifier(prefix, identifier, t.getRegion(startPos));
            };
            /**
             * Tries to parse an attribute identifier.
             * An attribute identifier has to end with ":", however, ":" will not be read.
             * If it fails, the reader will be resettet to the state before this method call.
             * If it succeeds, a TymlAttributeIdentifier will be returned.
             */
            Parser.prototype.tryParseAttributeIdentifier = function (t, logger, s) {
                var startPos = t.getPosition();
                var identifierStr = "";
                var prefix = null;
                while (true) {
                    var c = t.peek();
                    if (identifierStr === "" && !this.isValidIdentifierFirstLetter(c)) {
                        t.gotoPosition(startPos);
                        return null;
                    }
                    if (c === "/") {
                        if (prefix !== null) {
                            t.gotoPosition(startPos);
                            return null;
                        }
                        else {
                            prefix = identifierStr;
                            identifierStr = "";
                        }
                        t.read();
                    }
                    else if (!this.isValidIdentifierOtherLetter(c)) {
                        break;
                    }
                    else
                        identifierStr += t.read();
                }
                if (identifierStr === "" || t.peek() !== ":") {
                    t.gotoPosition(startPos);
                    return null;
                }
                if (prefix === null)
                    prefix = "";
                else if (!s.isPrefixDefined(prefix)) {
                    logger.logPrefixNotDefined(prefix, t.getRegion(startPos));
                    prefix = "";
                }
                return new Tyml.Ast.Implementation.TymlAttributeIdentifier(prefix, identifierStr, t.getRegion(startPos));
            };
            Parser.prototype.tryParseNamespacePrefixDefinition = function (t, logger, s) {
                var startPos = t.getPosition();
                if (!t.tryRead("!ns"))
                    return null;
                var identifier = "";
                if (t.peek() === "/") {
                    t.read();
                    while (true) {
                        var c = t.peek();
                        if (identifier === "" && !this.isValidIdentifierFirstLetter(c)) {
                            t.gotoPosition(startPos);
                            return null;
                        }
                        if (!this.isValidIdentifierOtherLetter(c)) {
                            break;
                        }
                        identifier += t.read();
                    }
                }
                if (!t.tryRead(":")) {
                    t.gotoPosition(startPos);
                    return null;
                }
                this.parseWhitespace(t, logger, s);
                var ns = this.parseString(t, logger, s);
                return new Tyml.Ast.Implementation.TymlNsAttribute(identifier, ns, t.getRegion(startPos));
            };
            Parser.prototype.parseElement = function (t, logger, s) {
                var nextChar = t.peek();
                if (t.tryRead("![", false))
                    return this.parseMarkupArray(t, logger, s);
                else if (nextChar === "<")
                    return this.parseString(t, logger, s);
                else if (nextChar === "[")
                    return this.parseArray(t, logger, s);
                else if (nextChar === "{")
                    return this.parseObject(t, logger, s);
                else
                    return this.parsePrimitive(t, logger, s);
            };
            Parser.prototype.parsePrimitive = function (t, logger, s) {
                var startPos = t.getPosition();
                var value = "";
                while (this.isValidPrimitiveLetter(t.peek())) {
                    var nextChar = t.read();
                    value += nextChar;
                }
                if (value === "") {
                    var c = t.read();
                    logger.logUnexpectedCharacterInPrimitive(c, t.getRegion(startPos));
                }
                return new Tyml.Ast.Implementation.TymlPrimitive(value, t.getRegion(startPos));
            };
            Parser.prototype.parseMarkupArray = function (t, logger, s) {
                var startPos = t.getPosition();
                this.expect(t, logger, "![");
                var openingBracket = t.getRegion(startPos);
                var elements = [];
                var str = "";
                var lastPos = t.getPosition();
                while (true) {
                    var nextChar = t.peek();
                    if (nextChar === "\\") {
                        str += this.readEscapeSequence(t, logger, s);
                        continue;
                    }
                    if (nextChar === "{" && this.tryReadComment(t, logger, s))
                        continue;
                    if (nextChar === "{" || nextChar === "<" || nextChar === "]" || nextChar === "") {
                        if (str !== "") {
                            elements.push(new Tyml.Ast.Implementation.TymlImplicitString(str, t.getRegion(lastPos)));
                            str = "";
                        }
                        if (nextChar === "]" || nextChar === "")
                            break;
                        elements.push(this.parseElement(t, logger, s));
                        lastPos = t.getPosition();
                    }
                    else {
                        var pos = t.getPosition();
                        t.read(); //read nextChar
                        if (nextChar === "}" || nextChar === "[") {
                            logger.logUnexpectedCharacterInMarkupArray(nextChar, t.getRegion(pos));
                        }
                        str += nextChar;
                    }
                }
                if (!this.expect(t, logger, "]")) {
                    logger.logUnclosedMarkupArray(openingBracket);
                }
                return new Tyml.Ast.Implementation.TymlMarkupArray(elements, t.getRegion(startPos));
            };
            Parser.prototype.parseArray = function (t, logger, s) {
                var startPos = t.getPosition();
                this.expect(t, logger, "[");
                var openingBracket = t.getRegion(startPos);
                var elements = [];
                while (true) {
                    this.parseWhitespace(t, logger, s);
                    var next = t.peek();
                    if (next === "]" || next === "")
                        break;
                    var element = this.parseElement(t, logger, s);
                    elements.push(element);
                }
                if (!this.expect(t, logger, "]")) {
                    logger.logUnclosedArray(openingBracket);
                }
                return new Tyml.Ast.Implementation.TymlExplicitArray(elements, t.getRegion(startPos));
            };
            Parser.prototype.readEscapeSequence = function (t, logger, s) {
                this.expect(t, logger, "\\");
                var startPos = t.getPosition();
                var next = t.read();
                if (next === "n")
                    return "\n";
                else if (next === "\\")
                    return "\\";
                else if (next === "t")
                    return "\t";
                else if ("<>[]{}".indexOf(next) !== -1 && next !== "")
                    return next;
                else if (next === "u") {
                    var str = "";
                    for (var i = 0; i < 4; i++) {
                        var p = t.getPosition();
                        var c = t.read();
                        if (!/[0-9A-F]/.test(c)) {
                            logger.logExpectedHexadecimalDigitInUnicodeEscapeSequenceNotFound(c, t.getRegion(p));
                            break;
                        }
                        str += c;
                    }
                    return String.fromCharCode(parseInt(str, 16));
                }
                logger.logUnrecognizedEscapeSequence("\\" + next, t.getRegion(startPos));
                return "\\" + next;
            };
            /**
             * Parses a normal or escaped string.
             */
            Parser.prototype.parseString = function (t, logger, s) {
                var startPos = t.getPosition();
                this.expect(t, logger, "<");
                var str = "";
                var isValidIdentifier = true;
                var invalidChar = "";
                var startIdentifierStartPos = t.getPosition();
                while (true) {
                    var c = t.peek();
                    if (c === "<" || c === ">" || c === "" || c === "\n" || c == "\r")
                        break;
                    if (isValidIdentifier &&
                        (str === "" ? !this.isValidIdentifierFirstLetter(c) : !this.isValidIdentifierOtherLetter(c))) {
                        isValidIdentifier = false;
                        invalidChar = c;
                    }
                    if (c === "\\") {
                        c = this.readEscapeSequence(t, logger, s);
                    }
                    else {
                        t.read();
                    }
                    str += c;
                }
                if (t.peek() === "<") {
                    var startIdentifierRegion = t.getRegion(startIdentifierStartPos);
                    t.read();
                    var identifierStr;
                    if (!isValidIdentifier) {
                        logger.logInvalidEscapedStringIdentifier(invalidChar, startIdentifierRegion);
                        identifierStr = "";
                    }
                    else
                        identifierStr = str;
                    str = "";
                    var endIdentifierRegion = null;
                    while (t.peek() !== "") {
                        var endIdentifierPos = t.getPosition();
                        var subStr = t.readWhile(function (c) { return c !== ">"; });
                        this.expect(t, logger, ">");
                        if (str !== "") {
                            if (subStr === identifierStr) {
                                endIdentifierRegion = t.getRegion(endIdentifierPos);
                                break;
                            }
                            else
                                str += ">";
                        }
                        str += subStr;
                    }
                    if (endIdentifierRegion === null)
                        endIdentifierRegion = t.getRegion(t.getPosition());
                    return new Tyml.Ast.Implementation.TymlEscapedString(str, new Tyml.Ast.Implementation.TymlEscapedStringBeginIdentifier(identifierStr, startIdentifierRegion), new Tyml.Ast.Implementation.TymlEscapedStringEndIdentifier(identifierStr, endIdentifierRegion), t.getRegion(startPos));
                }
                this.expect(t, logger, ">");
                return new Tyml.Ast.Implementation.TymlNormalString(str, t.getRegion(startPos));
            };
            return Parser;
        })();
        Parser_1.Parser = Parser;
    })(Parser = Tyml.Parser || (Tyml.Parser = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Transformer;
    (function (Transformer) {
        var AstVisitor = (function () {
            function AstVisitor() {
            }
            AstVisitor.prototype.accept = function (node) {
                var nodeType = node.getNodeType();
                if (nodeType.isPrimitive()) {
                    return this.visitPrimitive(node);
                }
                else if (nodeType.isObject()) {
                    return this.visitObject(node);
                }
                else if (nodeType.isMarkupArray()) {
                    return this.visitMarkupArray(node);
                }
                else if (nodeType.isExplicitArray()) {
                    return this.visitExplicitArray(node);
                }
                else if (nodeType.isNormalString()) {
                    return this.visitNormalString(node);
                }
                else if (nodeType.isEscapedString()) {
                    return this.visitEscapedString(node);
                }
                else if (nodeType.isImplicitString()) {
                    return this.visitImplicitString(node);
                }
                else if (nodeType.isDocument()) {
                    return this.visitDocument(node);
                }
                throw new Error("Element type is not supported!");
                //todo support attributes etc.
            };
            AstVisitor.prototype.visitNode = function (node) {
                throw new Error("Not implemented");
            };
            AstVisitor.prototype.visitDocument = function (node) {
                return this.visitNode(node);
            };
            AstVisitor.prototype.visitElement = function (node) {
                return this.visitNode(node);
            };
            AstVisitor.prototype.visitObject = function (node) {
                return this.visitElement(node);
            };
            AstVisitor.prototype.visitPrimitive = function (node) {
                return this.visitElement(node);
            };
            AstVisitor.prototype.visitArray = function (node) {
                return this.visitElement(node);
            };
            AstVisitor.prototype.visitExplicitArray = function (node) {
                return this.visitArray(node);
            };
            AstVisitor.prototype.visitMarkupArray = function (node) {
                return this.visitArray(node);
            };
            AstVisitor.prototype.visitString = function (node) {
                return this.visitElement(node);
            };
            AstVisitor.prototype.visitNormalString = function (node) {
                return this.visitString(node);
            };
            AstVisitor.prototype.visitImplicitString = function (node) {
                return this.visitString(node);
            };
            AstVisitor.prototype.visitEscapedString = function (node) {
                return this.visitString(node);
            };
            return AstVisitor;
        })();
        Transformer.AstVisitor = AstVisitor;
    })(Transformer = Tyml.Transformer || (Tyml.Transformer = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Transformer;
    (function (Transformer) {
        var XmlTransformerVisitor = (function (_super) {
            __extends(XmlTransformerVisitor, _super);
            function XmlTransformerVisitor() {
                _super.call(this);
                this.doc = document.implementation.createDocument(XmlTransformerVisitor.tymlNS, "std:tyml", null);
                this.doc.documentElement.setAttribute("version", "1.0");
            }
            XmlTransformerVisitor.prototype.visitDocument = function (node) {
                var obj = node.getRootNode();
                this.doc.documentElement.appendChild(this.accept(obj));
                return this.doc;
            };
            XmlTransformerVisitor.prototype.visitString = function (node) {
                var xmlNode = this.doc.createTextNode(node.getValue());
                return xmlNode;
            };
            XmlTransformerVisitor.prototype.visitPrimitive = function (node) {
                return this.doc.createTextNode(node.getValue());
            };
            XmlTransformerVisitor.prototype.visitObject = function (obj) {
                var _this = this;
                var type = obj.getTypeIdentifier();
                if (type.getName() === "?")
                    var xmlNode = this.doc.createElementNS(XmlTransformerVisitor.tymlNS, "std:unknown");
                else
                    var xmlNode = this.doc.createElementNS(type.getNamespace(), type.getName());
                obj.getAttributes().forEach(function (n) {
                    var ele = _this.accept(n.getValue());
                    if (ele instanceof Text && ele.wholeText.indexOf('\n') < 0) {
                        xmlNode.setAttributeNS(n.getIdentifier().getNamespace(), n.getIdentifier().getName(), ele.wholeText);
                    }
                    else {
                        var att = _this.doc.createElementNS(n.getIdentifier().getNamespace(), n.getIdentifier().getName());
                        att.appendChild(ele);
                        xmlNode.appendChild(att);
                    }
                });
                obj.getImplicitAttributes().forEach(function (n) {
                    var ele = _this.accept(n);
                    xmlNode.appendChild(ele);
                });
                return xmlNode;
            };
            XmlTransformerVisitor.prototype.visitArray = function (node) {
                var _this = this;
                var isMarkup = node.getNodeType().isMarkupArray();
                var xmlNode = this.doc.createElementNS(XmlTransformerVisitor.tymlNS, "std:" + (isMarkup ? "markuparray" : "array"));
                node.getItems().forEach(function (n) {
                    var ele = _this.accept(n);
                    if (!isMarkup && ele instanceof Text) {
                        var wrap = xmlNode.appendChild(_this.doc.createElementNS(XmlTransformerVisitor.tymlNS, "std:entry"));
                        wrap.appendChild(ele);
                    }
                    else
                        xmlNode.appendChild(ele);
                });
                return xmlNode;
            };
            XmlTransformerVisitor.tymlNS = "http://tyml.org/std";
            return XmlTransformerVisitor;
        })(Transformer.AstVisitor);
        var XmlTransformer = (function () {
            function XmlTransformer() {
            }
            XmlTransformer.prototype.transform = function (node) {
                var visitor = new XmlTransformerVisitor();
                return visitor.visitDocument(node);
            };
            XmlTransformer.prototype.reverseTransform = function (doc) {
                var reverseVisitor = new XmlReverseVisitor();
                return reverseVisitor.visitDocument(doc);
            };
            return XmlTransformer;
        })();
        Transformer.XmlTransformer = XmlTransformer;
        var XmlReverseVisitor = (function () {
            function XmlReverseVisitor() {
            }
            XmlReverseVisitor.prototype.visitDocument = function (doc) {
                return new Tyml.Ast.Implementation.TymlDocument(new Tyml.Ast.Implementation.TymlDocumentHeader(new Tyml.Ast.Implementation.TymlPrimitive("1.0")), this.visitObject(doc.documentElement));
            };
            XmlReverseVisitor.prototype.visitObject = function (ele) {
                var implicit = [];
                var explicit = [];
                var attributes = ele.attributes;
                for (var i = 0; i < attributes.length; i++) {
                    var att = attributes.item(i);
                    var val = this.visitString(att.value);
                    explicit.push(new Tyml.Ast.Implementation.TymlAttribute(new Tyml.Ast.Implementation.TymlIdentifier(att.namespaceURI || "", att.localName), val));
                }
                var children = ele.childNodes;
                for (var i = 0; i < children.length; i++) {
                    var node = children.item(i);
                    if (node.childNodes.length == 1) {
                        var a = this.visitAttribute(children.item(i));
                        if (a !== null)
                            explicit.push(a);
                    }
                    else {
                        var e = this.visitElement(children.item(i));
                        if (e !== null)
                            implicit.push(e);
                    }
                }
                return new Tyml.Ast.Implementation.TymlObject(new Tyml.Ast.Implementation.TymlIdentifier(ele.namespaceURI || "", ele.localName), explicit, implicit, []);
            };
            XmlReverseVisitor.prototype.visitString = function (s) {
                if (s.match(/[^\r\n\t ]/) === null) {
                    return null;
                }
                else if (s.indexOf('\n') < 0) {
                    if (s.match(/[a-zA-Z]/) === null)
                        return new Tyml.Ast.Implementation.TymlPrimitive(s);
                    else
                        return new Tyml.Ast.Implementation.TymlNormalString(s);
                }
                else
                    return new Tyml.Ast.Implementation.TymlEscapedString(s, new Tyml.Ast.Implementation.TymlEscapedStringBeginIdentifier("txt"), new Tyml.Ast.Implementation.TymlEscapedStringEndIdentifier("txt"));
            };
            XmlReverseVisitor.prototype.visitElement = function (ele) {
                if (ele instanceof Text) {
                    return this.visitString(ele.textContent);
                }
                else if (ele instanceof Element) {
                    return this.visitObject(ele);
                }
            };
            XmlReverseVisitor.prototype.visitAttribute = function (n) {
                if (n instanceof Element) {
                    var ele = n;
                    return new Tyml.Ast.Implementation.TymlAttribute(new Tyml.Ast.Implementation.TymlIdentifier(ele.namespaceURI || "", ele.localName), this.visitElement(ele.firstChild));
                }
                else {
                    throw new Error("not an element:" + n.textContent);
                }
            };
            return XmlReverseVisitor;
        })();
    })(Transformer = Tyml.Transformer || (Tyml.Transformer = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Transformer;
    (function (Transformer) {
        var JsonTransformerVisitor = (function (_super) {
            __extends(JsonTransformerVisitor, _super);
            function JsonTransformerVisitor() {
                _super.apply(this, arguments);
            }
            JsonTransformerVisitor.prototype.accept = function (node) {
                var result = _super.prototype.accept.call(this, node);
                if (Tyml.TextRegion.hasRegion(node))
                    result["!region"] = Tyml.TextRegion.getRegionOf(node).toJson();
                return result;
            };
            JsonTransformerVisitor.prototype.visitDocument = function (node) {
                return this.accept(node.getRootNode());
            };
            JsonTransformerVisitor.prototype.visitImplicitString = function (node) {
                return { ImplicitString: node.getValue() };
            };
            JsonTransformerVisitor.prototype.visitNormalString = function (node) {
                return node.getValue();
            };
            JsonTransformerVisitor.prototype.visitEscapedString = function (node) {
                return { EscapedString: node.getValue(), Identifier: node.getIdentifier() };
            };
            JsonTransformerVisitor.prototype.visitPrimitive = function (node) {
                return { Primitive: node.getValue() };
            };
            JsonTransformerVisitor.prototype.visitObject = function (node) {
                var _this = this;
                var result = {};
                result["!type"] = node.getTypeIdentifier().getFullQualifiedName();
                var nsDefinitions = [];
                node.getNamespacePrefixDefinitions().forEach(function (n) {
                    return nsDefinitions.push(n.getPrefix() + ":" + n.getNamespace().getValue());
                });
                result["!nsDefinitions"] = nsDefinitions;
                var implicitAttributes = [];
                node.getImplicitAttributes().forEach(function (n) {
                    return implicitAttributes.push(_this.accept(n));
                });
                result["!implicitAttributes"] = implicitAttributes;
                node.getAttributes().forEach(function (n) {
                    return result[n.getIdentifier().getFullQualifiedName()] = _this.accept(n.getValue());
                });
                return result;
            };
            JsonTransformerVisitor.prototype.visitArray = function (node) {
                var _this = this;
                var result = [];
                node.getItems().forEach(function (n) { return result.push(_this.accept(n)); });
                return result;
            };
            return JsonTransformerVisitor;
        })(Transformer.AstVisitor);
        var JsonTransformer = (function () {
            function JsonTransformer() {
            }
            JsonTransformer.prototype.transform = function (node) {
                var visitor = new JsonTransformerVisitor();
                return visitor.accept(node);
            };
            JsonTransformer.prototype.reverseTransform = function (doc) {
                var reverseVisitor = new JsonReverseVisitor();
                return reverseVisitor.visitDocument(doc);
            };
            return JsonTransformer;
        })();
        Transformer.JsonTransformer = JsonTransformer;
        var JsonReverseVisitor = (function () {
            function JsonReverseVisitor() {
            }
            JsonReverseVisitor.prototype.visitDocument = function (doc) {
                return new Tyml.Ast.Implementation.TymlDocument(new Tyml.Ast.Implementation.TymlDocumentHeader(new Tyml.Ast.Implementation.TymlPrimitive("1.0")), this.visitObject(doc));
            };
            JsonReverseVisitor.prototype.visitObject = function (obj) {
                var implicit = [];
                var explicit = [];
                for (var att in obj) {
                    var val = this.visitElement(obj[att]);
                    explicit.push(new Tyml.Ast.Implementation.TymlAttribute(new Tyml.Ast.Implementation.TymlAttributeIdentifier("", att), val));
                }
                return new Tyml.Ast.Implementation.TymlObject(new Tyml.Ast.Implementation.TymlTypeIdentifier("", obj.constructor && obj.constructor.name || "?"), explicit, implicit, []);
            };
            JsonReverseVisitor.prototype.visitString = function (s) {
                if (s.match(/[^\r\n\t ]/) === null) {
                    return new Tyml.Ast.Implementation.TymlPrimitive("");
                }
                else if (s.indexOf('\n') < 0) {
                    if (s.match(/[a-zA-Z]/) === null)
                        return new Tyml.Ast.Implementation.TymlPrimitive(s);
                    else
                        return new Tyml.Ast.Implementation.TymlNormalString(s);
                }
                else
                    return new Tyml.Ast.Implementation.TymlEscapedString(s, new Tyml.Ast.Implementation.TymlEscapedStringBeginIdentifier("txt"), new Tyml.Ast.Implementation.TymlEscapedStringEndIdentifier("txt"));
            };
            JsonReverseVisitor.prototype.visitElement = function (ele) {
                if (ele instanceof Array) {
                    return this.visitArray(ele);
                }
                else if (typeof ele === "string") {
                    return this.visitString(ele);
                }
                else if (typeof ele === "function") {
                    throw new Error("Cannot save functions to tyml");
                }
                else if (typeof ele === "object") {
                    return this.visitObject(ele);
                }
                else if (typeof ele === "number") {
                    return new Tyml.Ast.Implementation.TymlPrimitive("" + ele);
                }
                else
                    throw new Error("unknown type " + typeof ele);
            };
            JsonReverseVisitor.prototype.visitArray = function (ele) {
                var arr = [];
                for (var i = 0; i < ele.length; i++) {
                    arr.push(this.visitElement(ele[i]));
                }
                return new Tyml.Ast.Implementation.TymlExplicitArray(arr);
            };
            return JsonReverseVisitor;
        })();
    })(Transformer = Tyml.Transformer || (Tyml.Transformer = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Transformer;
    (function (Transformer) {
        var PrettyprintTransformerVisitor = (function (_super) {
            __extends(PrettyprintTransformerVisitor, _super);
            function PrettyprintTransformerVisitor(indentString) {
                _super.call(this);
                this.indentString = indentString;
                this.indent = 0;
            }
            /** change the offset by offset and return it as a string*/
            PrettyprintTransformerVisitor.prototype.getIndent = function (offset) {
                this.indent += offset || 0;
                var str = "\n";
                for (var i = 0; i < this.indent; i++)
                    str += this.indentString;
                return str;
            };
            PrettyprintTransformerVisitor.prototype.visitDocument = function (node) {
                return "{!tyml 1.0}\n" + this.accept(node.getRootNode());
            };
            PrettyprintTransformerVisitor.prototype.visitString = function (node) {
                return "<" + node.getValue() + ">";
            };
            PrettyprintTransformerVisitor.prototype.visitImplicitString = function (node) {
                return node.getValue();
            };
            PrettyprintTransformerVisitor.prototype.visitEscapedString = function (node) {
                return "<" + node.getIdentifier() + "<" + node.getValue() + ">" + node.getIdentifier() + ">";
            };
            PrettyprintTransformerVisitor.prototype.visitPrimitive = function (node) {
                return node.getValue();
            };
            PrettyprintTransformerVisitor.prototype.visitObject = function (node) {
                var _this = this;
                var hasImplicit = node.getImplicitAttributes().length > 0;
                var hasExplicit = node.getAttributes().length > 0;
                var hasNamespaces = node.getNamespacePrefixDefinitions().length > 0;
                var hasSomething = hasImplicit || hasExplicit || hasNamespaces;
                var prefix;
                return "{"
                    + node.getTypeIdentifier().toString()
                    + (hasSomething ? this.getIndent(1) : "")
                    + node.getNamespacePrefixDefinitions().map(function (n) { return "!ns" + ((prefix = n.getPrefix().toString()) != "" ? "/" + prefix : "") + ": " + _this.accept(n.getNamespace()); }).join(this.getIndent())
                    + (hasImplicit && hasNamespaces ? this.getIndent() : "")
                    + node.getImplicitAttributes().map(function (n) { return _this.accept(n); }).join(this.getIndent())
                    + (((hasImplicit && hasExplicit) || (hasNamespaces && hasExplicit)) ? this.getIndent() : "")
                    + node.getAttributes().map(function (n) { return n.getIdentifier().toString() + ": " + _this.accept(n.getValue()); }).join(this.getIndent())
                    + (hasSomething ? this.getIndent(-1) : "")
                    + "}";
            };
            PrettyprintTransformerVisitor.prototype.visitArray = function (node) {
                var _this = this;
                return "["
                    + this.getIndent(1)
                    + node.getItems().map(function (n) { return _this.accept(n); }).join(this.getIndent())
                    + this.getIndent(-1)
                    + "]";
            };
            PrettyprintTransformerVisitor.prototype.visitMarkupArray = function (node) {
                var _this = this;
                return "[!" + node.getItems().map(function (n) { return _this.accept(n); }).join("") + "]";
            };
            return PrettyprintTransformerVisitor;
        })(Transformer.AstVisitor);
        var PrettyprintTransformer = (function () {
            function PrettyprintTransformer() {
            }
            PrettyprintTransformer.prototype.transform = function (node) {
                var visitor = new PrettyprintTransformerVisitor("\t");
                return visitor.accept(node);
            };
            return PrettyprintTransformer;
        })();
        Transformer.PrettyprintTransformer = PrettyprintTransformer;
    })(Transformer = Tyml.Transformer || (Tyml.Transformer = {}));
})(Tyml || (Tyml = {}));
var Tyml;
(function (Tyml) {
    var Transformer;
    (function (Transformer) {
        var TexTransformerVisitor = (function (_super) {
            __extends(TexTransformerVisitor, _super);
            function TexTransformerVisitor(indentString) {
                var _this = this;
                _super.call(this);
                this.indentString = indentString;
                this.indent = 0;
                this.specialObjects = {
                    "itemize": function (node) {
                        var items = node.getImplicitAttributes()[0];
                        return "\\begin{itemize}"
                            + _this.getIndent(1)
                            + items.getItems().map(function (i) {
                                if (i.getNodeType().isObject()
                                    && ["itemize", "item"].indexOf(i.getTypeIdentifier().toString()) >= 0)
                                    return _this.accept(i);
                                else
                                    return "\\item " + _this.accept(i);
                            }).join(_this.getIndent())
                            + _this.getIndent(-1)
                            + "\\end{itemize}";
                    },
                    "verb": function (node) {
                        var val = node.getImplicitAttributes()[0];
                        return "\\verb|" + val.getValue() + "|";
                    }
                };
            }
            /** change the offset by offset and return it as a string*/
            TexTransformerVisitor.prototype.getIndent = function (offset) {
                this.indent += offset || 0;
                var str = "\n";
                for (var i = 0; i < this.indent; i++)
                    str += this.indentString;
                return str;
            };
            TexTransformerVisitor.prototype.visitDocument = function (node) {
                var root = node.getRootNode();
                if (root.getTypeIdentifier().toString() !== "tex")
                    return "Error: Must begin with {tex} object";
                var atts = root.getImplicitAttributes();
                if (atts.length != 1 || !atts[0].getNodeType().isMarkupArray())
                    return "invalid document";
                this.indent = -1;
                return this.accept(atts[0]).substr(1);
            };
            TexTransformerVisitor.prototype.visitNormalString = function (node) {
                return node.getValue();
            };
            TexTransformerVisitor.prototype.visitImplicitString = function (node) {
                return node.getValue();
            };
            TexTransformerVisitor.prototype.visitEscapedString = function (node) {
                return node.getValue();
            };
            TexTransformerVisitor.prototype.visitPrimitive = function (node) {
                return node.getValue();
            };
            TexTransformerVisitor.prototype.visitObject = function (node) {
                var _this = this;
                // handle weird latex \begin[wat]{wat}{wat} brackets stuff
                var content = "", braces = [], brackets = "";
                var last = "";
                var type = node.getTypeIdentifier().toString();
                if (this.specialObjects.hasOwnProperty(type)) {
                    return this.specialObjects[type](node);
                }
                var out = "";
                if (node.getAttributes().length > 0)
                    return "can't parse named attributes";
                node.getImplicitAttributes().forEach(function (e, i) {
                    if (!e.getNodeType().isMarkupArray()) {
                        braces.push("{" + _this.accept(e) + "}");
                        last = _this.accept(e);
                    }
                    else {
                        content += _this.accept(e);
                    }
                });
                if (braces.length >= 2) {
                    braces.pop();
                    brackets = last;
                }
                var params = (brackets ? "[" + brackets + "]" : "") + braces.join("");
                if (content)
                    out = "\\begin{" + type + "}" + params + content + "\\end{" + type + "}";
                else
                    out = "\\" + type + params;
                return out;
            };
            TexTransformerVisitor.prototype.visitArray = function (node) {
                var _this = this;
                return "["
                    + this.getIndent(1)
                    + node.getItems().map(function (n) { return _this.accept(n); }).join(this.getIndent())
                    + this.getIndent(-1)
                    + "]";
            };
            TexTransformerVisitor.prototype.visitMarkupArray = function (node) {
                var _this = this;
                return this.getIndent(1) + node.getItems()
                    .filter(function (n) {
                    if (n.getNodeType().isImplicitString() && n.getValue().match(/^\s*$/))
                        return false;
                    return true;
                }).map(function (n) { return _this.accept(n); }).join(this.getIndent()) + this.getIndent(-1);
            };
            return TexTransformerVisitor;
        })(Transformer.AstVisitor);
        var TexTransformer = (function () {
            function TexTransformer() {
            }
            TexTransformer.prototype.transform = function (node) {
                var visitor = new TexTransformerVisitor("\t");
                return visitor.accept(node);
            };
            return TexTransformer;
        })();
        Transformer.TexTransformer = TexTransformer;
    })(Transformer = Tyml.Transformer || (Tyml.Transformer = {}));
})(Tyml || (Tyml = {}));
///<reference path="ArgumentExceptionHelper.ts"/>
///<reference path="TextRegion.ts"/>
///<reference path="Ast/AstNodeTypes.ts"/>
///<reference path="Ast/AstInterface.ts"/>
///<reference path="Ast/AstNodes.ts"/>
///<reference path="Parser/ParserInterface.ts"/>
///<reference path="Parser/Tokenizer.ts"/>
///<reference path="Parser/MessageDictionary.ts"/>
///<reference path="Parser/GermanMessageDictionary.ts"/>
///<reference path="Parser/Parser.ts"/>
///<reference path="Transformer/AstVisitor.ts"/>
///<reference path="Transformer/XmlTransformer.ts"/>
///<reference path="Transformer/JsonTransformer.ts"/>
///<reference path="Transformer/PrettyprintTransformer.ts"/>
///<reference path="Transformer/TexTransformer.ts"/>
//# sourceMappingURL=tyml.js.map

module.exports = Tyml;