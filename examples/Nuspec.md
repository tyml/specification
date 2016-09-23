Example "Nuspec"
================

Taken from [docs.nuget.org](http://docs.nuget.org/ndocs/schema/nuspec#examples-of-.nuspec-files).

```tyml
{!tyml 0.9 !ns:<nuget.org/nuspec>}
{Package 
    Metadata:{$
        Id:         <PackageWithGacReferences>
        Version:    <1.0>
        Authors:    <Author here>
        RequireLicenseAcceptance: false

        Description:    <<A package that has framework assemblyReferences depending \\
            on the target framework.>>
        
        FrameworkAssemblies:    [
            {$ <System.Web> TargetFramework:<net40>}
            {$ <System.Web> TargetFramework:[<net40-client> <net40>]}
            {$ <System.Web> TargetFramework:<sl4-wp>}
            {$ <System.Web> TargetFramework:<sl3>}
        ]
    }
}
```

```xml
<?xml version="1.0"?>
<package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd">
  <metadata>
    <id>PackageWithGacReferences</id>
    <version>1.0</version>
    <authors>Author here</authors>
    <requireLicenseAcceptance>false</requireLicenseAcceptance>
    <description>
        A package that has framework assemblyReferences depending 
        on the target framework.
    </description>
    <frameworkAssemblies>
      <frameworkAssembly assemblyName="System.Web" targetFramework="net40" />
      <frameworkAssembly assemblyName="System.Net" targetFramework="net40-client, net40" />
      <frameworkAssembly assemblyName="Microsoft.Devices.Sensors" targetFramework="sl4-wp" />
      <frameworkAssembly assemblyName="System.Json" targetFramework="sl3" />
    </frameworkAssemblies>
  </metadata>
</package>
```