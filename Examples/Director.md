Example "Director"
==================

```tyml
{!tyml 1.0 !ns:<http://movies.mov/xml-schema/1.0>}
{-- Spielberg was born in 1946 --}
{Director <Spielberg> Movies: [
    {Movie <Jaws> Year:1975}
    {Movie <E.T.> Year:1982}
]}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- Spielberg was born in 1946 -->
<Director name="Spielberg" xmlns="http://movies.mov/xml-schema/1.0">
    <Movies>
        <Movie title="Jaws" year="1975"/>
        <Movie title="E.T." year="1982"/>
    </Movies>
</Director>
```

```yaml
# yaml (Yaml has no header like xml or tyml)
#Spielberg was born in 1946
Director:
    name: Spielberg
    Movies:
      - Movie: {title: E.T., year: 1975}
      - Movie: {title: Jaws, year: 1982}
```

```json
{
    "Director": {
        "name": "Spielberg",
        "Movies": [
            { "Movie": { "title": "Jaws", "year": 1975 } },
            { "Movie": { "title": "E.T.", "year": 1982 } }
        ]
    }
}
```