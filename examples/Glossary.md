Example "Glossary"
==================

Taken from [json.org/examples](http://json.org/example).

```tyml
{!tyml 1.0 !ns:<http://glossary.org/tyml-schema/1.0>}
{Glossary <example glossary>
    GlossDiv: {GlossDiv <S> [
        {GlossEntry 	<SGML>
            SortAs: 	<SGML>
            GlossTerm: 	<Standard Generalized Markup Language>
            Acronym: 	<SGML>
            Abbrev: 	<ISO 8879:1986>
            GlossDef: 	{GlossDef
                para:         <A meta-markup language, used to create markup languages such as DocBook.>
                GlossSeeAlso: [<GML> <XML>]
            }
            GlossSee:	<markup>
        }
    ]}
}
```

```xml
<!DOCTYPE glossary PUBLIC "-//OASIS//DTD DocBook V3.1//EN">
 <glossary><title>example glossary</title>
  <GlossDiv><title>S</title>
   <GlossList>
    <GlossEntry ID="SGML" SortAs="SGML">
     <GlossTerm>Standard Generalized Markup Language</GlossTerm>
     <Acronym>SGML</Acronym>
     <Abbrev>ISO 8879:1986</Abbrev>
     <GlossDef>
      <para>A meta-markup language, used to create markup languages such as DocBook.</para>
      <GlossSeeAlso OtherTerm="GML">
      <GlossSeeAlso OtherTerm="XML">
     </GlossDef>
     <GlossSee OtherTerm="markup">
    </GlossEntry>
   </GlossList>
  </GlossDiv>
 </glossary>
```

```json
{
    "glossary": {
        "title": "example glossary",
		"GlossDiv": {
            "title": "S",
			"GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
					"SortAs": "SGML",
					"GlossTerm": "Standard Generalized Markup Language",
					"Acronym": "SGML",
					"Abbrev": "ISO 8879:1986",
					"GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
						"GlossSeeAlso": ["GML", "XML"]
                    },
					"GlossSee": "markup"
                }
            }
        }
    }
}
```