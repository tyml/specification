Composer Package
================

```tyml
{!tyml 1.0 !ns:<http://composer.org/tyml-schema/1.0>}
{ComposerPackage <nunzion/php-expect>
    Type:           <library>
    Description:    <An expressive but lightweight library \
                     to validate preconditions and invariants.>
    Keywords:       [<expect> <assert> <assertion> <validation> 
                     <argument> <exception> <precondition> <invariant>]
    License:        <MIT>
    Authors: [
        {Developer <Henning Dieterichs> 
            Email:  <henning.dieterichs@hediet.de>
        }
    ]
    Support: {Support
        Email:  <phpexpect@hediet.de> 
        Source: <https://bitbucket.org/nunzion/php-expect>
    }
    Autoload: [
        {Psr0NamespaceMapping Namespace:<Nunzion> Directory:<src/>}
    ]
    Archive: {ArchiveConfig
        Exclude:    [</nbproject>]
    }
    Require: [
        {Dep <php> Version:<\>=5.3.0>
    ]
}
```

```json
{
    "name": "nunzion/php-expect",
    "type": "library",
    "description": "An expressive but lightweight library to validate preconditions and invariants.",
    "keywords": ["expect", "assert", "assertion", "validation", 
        "argument", "exception", "precondition", "invariant"],
    "license": "MIT",
    "authors": [
        {
            "name": "Henning Dieterichs",
            "email": "henning.dieterichs@hediet.de",
            "role": "Developer"
        }
    ],
    "support": {
        "email": "phpexpect@hediet.de",
        "source": "https://bitbucket.org/nunzion/php-expect"
    },
    "autoload": {
        "psr-0": { "Nunzion" : "src/"}
    },
    "archive": {
        "exclude": ["/nbproject"]
    },
    "require": {
        "php": ">=5.3.0"
    }
}
```