Tyml - The Typed Markup Language
================================

Tyml is a text based and typed markup and data description language that is meant to
be an alternative to XML, JSON and YAML. Tyml is the abbreviation of Typed markup language.

Because Tyml is typed, thus every object must specify a global type for that it describes an instance,
Tyml documents can be validated and processed easily by using associated type information.
This allows tools that can provide domain specific assistance like autocompletion or graphical
user interfaces for editing Tyml documents.  
The concept of namespaces that is inspired by xml prevents type and attribute naming collisions,
so that each tyml object can be extended by custom attributes in a custom namespace without
neccessary influencing the processing of the document. Thus, each tyml document can be extended at will.

Tyml supports the description of objects, lists, strings and primitives, 
whereby primitives are strings that have a user defined meaning like numbers or booleans.
Moreover, tyml supports embedding both objects and arbitrary unmasked text into a markup string.

This makes tyml suitable to describe complex configurations and extensive markup documents,
while still being appropriate to store and transmit simple data due to its compact notation.

Example - Contact book
----------------------

The following document provides an insight into the syntax of Tyml and
demonstrates how tyml could be used to describe a simple contact book by using all essential language features:

```tyml
{!tyml 0.9 
	!ns/:<tyml.org/examples/contact-book>
	!alias/#Kywrd:</Keyword>
} 
{-- Tyml documents are UTF-8 encoded --}
{ContactBook !ns/ext:<tyml.org/examples/contact-book-ext>
	{-- The whitespace after "\" and the backslash itself will be removed --}
	Name:<Initiators and developers of tyml, \
			the Typed Markup Language>
	SomeValues:[
		10 {-- Tyml primitives are unified, 10, true and high are not treated differently --}
		true
		{=ext/Importance {-- high is casted as "Importance". This is required if the type cannot be inferred. --}
			high
		}
	]
	Description:![
		{-- This is a markup array (introduced by "!["), text can be mixed with objects --}
		This {#Kywrd <contact book>} lists the initiators of tyml.
	]
	Contacts:[
		{-- This is an array of elements --}
		{Contact <Henning> {-- This is an implicit attribute --}
			Mail:	<henning@tyml.org>
			{-- The html text attribute is not defined in 'Contact', but externally --}
			ext/HtmlText: <delimiter123<<b>Hello</b> World!>delimiter123>
			{-delimiter456- 
				Tyml supports delimited strings and comments,
				so that comments can contain comments: {-- --} 
			-delimiter456-}
		}
		{~ {-- Contact type is inferred --}
			<Robin>
			Mail:         <robin@tyml.org>
			ext/HtmlText: <txt<<b>Hello</b> World!>txt>
		}
	]
}
```

Further examples and their XML, JSON and YAML equivalent can be found in the
[examples](examples) directory.

Specification
-------------
See [SPEC.tyml](SPEC.tyml) for the specification of Tyml 0.9.
