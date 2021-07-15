## What is tap

Tap is a way to extend our local library of templates and/or plugins.  
Default CPM implementation provides a bunch of templates and plugins but user might want to develop and add their own.

## How one can create their own tapable repo

Creating tapable repo is done by adding templates.json and/or plugins.json file in the directory that we want to be tapable (in most cases this will be root folder in repo).

## templates.json

Templates.json is a configuration file that specifies where templates can be found, the general schema of this file is:

```json
[
	{
		"name": "NAME_OF_TEMPLATE",
		"where": "IMPORT_PATH_TO_THE_TEMPLATE"
	}
]
```

## plugins.json

Plugins.json is a configuration file that specifies where plugins can be found, the general schema of this file is:

```json
[
	{
		"name": "NAME_OF_PLUGIN",
		"where": "IMPORT_PATH_TO_THE_PLUGINS"
	}
]
```
