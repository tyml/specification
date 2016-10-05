Example "Director"
==================

Inspired by [this answer](http://stackoverflow.com/questions/51492/what-usable-alternatives-to-xml-syntax-do-you-know#answer-2567924).

Tyml
----

Document:

```tyml
{!tyml 0.9 !ns/:<movies.mov/1.0>}
{-- Spielberg was born in 1946 --}
{Director <Spielberg> Filmography:[
	{Movie <Jaws> Year:1975}
	{Movie <E.T.> Year:1982}
	{Series <Under the Dome> Years:[2013 2014 2015]}
]}
```

Type Definitions:

```tyml
{!tyml 0.9 !ns/:<tyml.org/typedef/0.9> !ns/t:<tyml.org/types/0.9>}
{NamespaceDefinition !ns/tns:<movies.mov/1.0> <tns> Types:[
	{ObjectTypeDefinition <Director> Attributes:[
		{Attribute 'Type:<t/String> <Name> CanBeImplicit:true}
		{Attribute 'Type:{ArrayType <tns/Video>} <Filmography>}
	]}
	{ObjectTypeDefinition <Video> Kind:Abstract Attributes:[
		{Attribute 'Type:<t/String> <Title> CanBeImplicit:true}
	]}
	{ObjectTypeDefinition <Movie> Extends:<Video> Attributes:[
		{Attribute 'Type:<t/Year> <Year>}
	]}
	{ObjectTypeDefinition <Series> Extends:<Video> Attributes:[
		{Attribute 'Type:<t/Years> {ArrayType <Year>}}
	]}
]}
```

Xml
----

Document:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- Spielberg was born in 1946 -->
<Director name="Spielberg" xmlns="http://movies.mov/xml-schema/1.0">
	<Filmography>
		<Movie title="Jaws" year="1975"/>
		<Movie title="E.T." year="1982"/>
		<Series title="Under the Dome" years="2013 2014 2015" />
	</Filmography>
</Director>
```

Schema:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" 
			targetNamespace="http://movies.mov/xml-schema/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema">
	<xs:element name="Movie">
		<xs:complexType>
			<xs:attribute type="xs:string" name="title" />
			<xs:attribute type="xs:short" name="year" />
		</xs:complexType>
	</xs:element>
	<xs:element name="Series">
		<xs:complexType>
			<xs:attribute type="xs:string" name="title" />
			<xs:attribute name="years">
				<xs:simpleType> 
					<xs:list itemType="xs:short"/>
				</xs:simpleType> 
			</xs:attribute>
		</xs:complexType>
	</xs:element>
	<xs:element name="Director">
		<xs:complexType>
			<xs:sequence>
				<xs:element name="Filmography">
					<xs:complexType>
						<xs:sequence>
							<xs:choice>
								<xs:element ref="Movie" />
								<xs:element ref="Series" />
							</xs:choice>
						</xs:sequence>
					</xs:complexType>
				</xs:element>
			</xs:sequence>
			<xs:attribute type="xs:string" name="name"/>
		</xs:complexType>
	</xs:element>
</xs:schema>
```

Json
----

Document:

```json
{
	"$schema": "file://./schema.json",
	"Director": {
		"name": "Spielberg",
		"filmography": [
			{ "Movie": { "title": "Jaws", "year": 1975 } },
			{ "Movie": { "title": "E.T.", "year": 1982 } }
			{ "Series": { "title": "Under the Dome", "years": [2013, 2014, 2015] } }
		]
	}
}
```

Schema:

```json
{
	"$schema": "http://json-schema.org/draft-04/schema#",
	"type": "object",
	"properties": {
		"Director": {
			"type": "object",
			"properties": {
				"name": { "type": "string" },
				"filmography": {
					"type": "array",
					"items": {
						"type": "object",
						"oneOf": [
							{ "$ref": "#/definitions/Series" },
							{ "$ref": "#/definitions/Movie" },
						]
					}
				}
			},
			"required": [ "name", "Movies" ]
		}
	},
	"required": [ "Director" ],

	"definitions": {
		"Series": {
			"properties": {
				"Series": {
					"properties": {
						"title": { "type": "string" },
						"years": {
							"type": "array", 
							"items": { "type": "integer" }
						}
					},
					"required": [ "title", "years" ]
				}
			}
		},
		"Movie": {
			"properties": {
				"Movie": {
					"properties": {
						"title": { "type": "string" },
						"year": { "type": "integer" }
					},
					"required": [ "title", "year" ]
				}
			}
		}
	}
}
```

Yaml
----

Document:

```yaml
# yaml (Yaml has no header like xml or tyml)
#Spielberg was born in 1946
Director:
	name: Spielberg
	filmography:
		- Movie: {title: E.T., year: 1975}
		- Movie: {title: Jaws, year: 1982}
		- Series: {title: Under the Dome, years: [2013, 2014, 2015]}
```

Schema:

```yaml
---
"$schema": http://json-schema.org/draft-04/schema#
type: object
properties:
	Director:
		type: object
		properties:
			name:
				type: string
			filmography:
				type: array
				items:
					type: object
					oneOf:
					- "$ref": "#/definitions/Series"
					- "$ref": "#/definitions/Movie"
		required:
		- name
		- Movies
required:
- Director
definitions:
	Series:
		properties:
			Series:
				properties:
					title:
						type: string
					years:
						type: array
						items:
							type: integer
				required:
				- title
				- years
	Movie:
		properties:
			Movie:
				properties:
					title:
						type: string
					year:
						type: integer
				required:
				- title
				- year
```

