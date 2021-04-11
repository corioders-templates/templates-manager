# Notes:

## Not really cli, more a tool:

This shouldn't be called "cli" because the main goal of this is to manage projects the `templates` think is just a feature of it all.

## How to create project:

[TODO](https://corioders.atlassian.net/browse/CLI-11)

# Abstract:

America wasn't build in one day, and so should be every project, slowly in small parts. `corioders` should be build with this in mind

# Concepts:

## Project creation:

## General:

### project:

description: this is a thing that stores all metadata for all `parts`.

### part:

description: this is a thing that stores all files and folders related to one logical section that is `part` of a `project`. Usually this would be a folder on a disk.

### component:

description: the smallest unit of "customization".
This will be implemented in the "webpack way", we will have a global state object that is going to be altered by "plugins", in this state we have for example an interface that provides remote-git-platform etc.  
If using this approach `components` will be uniform we have no distinct `components types` whatsoever.

# Commands:

## Project management:

### create:

description: creates new `meta project`, like creating new project on google cloud
order of execution:

- name of the `meta project`
- create folder with this `meta project` configuration at ~/.corioders/projects/$(meta project name)
- ask component-remote-git-platform to create repo with name $(meta project name)

### add:

description: add specific `project` to `meta project` created by `create`. This `project` can be for example:
backend  
backend-microservice  
frontend  
not sure about that one: frontend-route (really really small stuff)

### clone:

description: when `project` is present in `meta project` configuration repo and we want to edit it directly this command downloads the remote repo

### ??? tree:

description: prints layout of the project `meta project`

## Components management:

### components tap:

description: taps into new components registry

### components untap:

description: untaps from components registry

<br><br><br><br><br>

# OLD:

# Concepts:

## component:

description: the smallest unit of "customization".  
components are of types (this list can be extended in the future):

- remote-git-platform
- application-template

### remote-git-platform:

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
