Dependency Injection Example
============================


Document:

```tyml
{!tyml 0.9 !ns/:<company.com/myproduct/1.0>}
{Services [
	{Service <MyLogger> {FileLogger <../file.txt>}}
	{Service <MyMailSender> {SmtpMailSender
		Port:		1234
		User:		<user>
		Password:	{Decrypt <UpIGhlcmUuLi4=>}
		Logger:		{ReferenceTo <MyLogger>}
	}}
]}
```

Type Definitions:

```tyml
{!tyml 0.9 !ns/:<tyml.org/typedef/0.9> !ns/t:<tyml.org/types/0.9>}
{NamespaceDefinition !ns/tns:<company.com/myproduct/1.0> <tns> Types:[

	{AliasTypeDefiniton <Dynamic> TypeAttributes:[{~ <Type>}]
		Type:($Type|tns/ValueProvider($Type))
		Type:[{TypeParameter <Type>} {Instantiate <tns/ValueProvider> [{TypeParameter <Type>}]}]
	}
	{InterfaceTypeDefinition <ValueProvider> TypeAttributes:[{~ <Type>}]}

	{ObjectTypeDefinition <Services> Attributes:[
		{Attribute 'Type:{Instantiate <tns/Dynamic> [{ArrayType <tns/Service>}]} <Services> CanBeImplicit:true}
	]}
	{ObjectTypeDefinition <Service> Attributes:[
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<t/String>]} <Id> CanBeImplicit:true}
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<ObjectDescription>]} <Instance> CanBeImplicit:true}
	]}
	{AliasDefinition <ObjectDescription> Type:<t/Any>}

	{InterfaceTypeDefinition <Logger>}
	{InterfaceTypeDefinition <MailSender>}

	{ObjectTypeDefinition <FileLogger> Implements:[<Logger>] Attributes:[
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<t/FilePath>]} <Path>}
	]}

	{ObjectTypeDefinition <SmtpMailSender> Implements:[<MailSender>] Attributes:[
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<t/Short>]} <Port>}
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<t/String>]} <User>}
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<t/String>]} <Password>}
		{Attribute 'Type:{Instantiate <tns/Dynamic> [<t/Logger>]} <Logger>}
	]}

	{ObjectTypeDefinition <Decrypt> Implements:[{Instantiate <tns/ValueProvider> [<t/String>]}] Attributes:[
		{Attribute 'Type:{Instantiate <Dynamic> [<t/String>]} <Code>}
	]}
	{ObjectTypeDefinition <ReferenceTo> Extends:<Video> Attributes:[
		{Attribute 'Type:{Instantiate <Dynamic> [<t/String>]} <Id>}
	]}
]}
```
