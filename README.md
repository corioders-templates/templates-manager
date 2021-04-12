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

### part template

description: the code template for a part.

### component:

description: the smallest unit of "customization".
This will be implemented in the "webpack way", we will have a global state object that is going to be altered by "plugins", in this state we have for example an interface that provides remote-git-platform etc.  
If using this approach `components` will be uniform we have no distinct `components types` whatsoever.
