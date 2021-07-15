# Template

Each template is wrote using typescript and build into out directory.  
Each template must contain index.ts file that exports default Template Function
Each template must contain template directory located in TEMPLATE_ROOT/template, this directory will contain all of template code that will be pre-processed by Template Function

## Template function

Template functions is functions that is exported by index.js in TEMPLATE_ROOT/out/index.js, it takes one parameter Template Function Object and can be async.  
This function uses cliApi and templatesApi for communication with outside world, all of this communication leads to part creation.

## Template Function Object

Template Function Object contains references to cliApi and templatesApi, in the future this list could be extended.
