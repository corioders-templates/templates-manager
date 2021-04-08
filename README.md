# Abstract:

America wasn't build in one day, and so should be every project, slowly in small parts `corioders create` should be build with this in mind

# Concepts:

## component:

description: the smallest unit of "customization".  
components are of types (this list can be extended in the future):

- remote-source-version-control
- application-template

## meta project:

description: this is a thing that stores all metadata for all `projects`
issue: where to store this `meta project` thing...

## project:

description: this is a thing that stores all files and folders related to one logical `project` that is part of `meta project`  
usually this would be a folder on a disk

# Commands:

## Project management:

### create:

description: creates new `meta project`, like creating new project on google cloud

### add:

description: add specific `project` to `meta project` created by `create`. This `project` can be for example:
backend  
backend-microservice  
frontend  
not sure about that one: frontend-route (really really small stuff)

### tree:

description: prints layout of the project `meta project`

## Components management:

### tap:

description: taps into new components registry

### untap:

description: untaps from components registry

<br><br><br><br><br>

# OLD:

# Concepts:

## component:

description: the smallest unit of "customization".  
components are of types (this list can be extended in the future):

- remote-source-version-control
- application-template

### remote-source-version-control:

description: this component will determine what source control remote solution will be used (eg. github, gitlab, bitbucket etc.).  
user can select only one of them.

features required:

- if requested, translate issue_template and pull_request_template from standard form into platform-specific format.
- provide function NewRemoteSourceControl(name string, path string) which will create new repo in specified path

### application-template:

description: this component will create

# Commands:

## corioders create:

description: creates new project
execution order:

- update components registry (git pull in components-meta repo)
-

- project name
