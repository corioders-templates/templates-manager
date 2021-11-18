# Corioders templates manager:

# Concepts:

description: the code template for a part.

### template:

description: a code template that is transformed and then saved.

### plugin:

description: the smallest unit of "customization".
This will be implemented in the "webpack way", we will have a global state object that is going to be altered by "plugins", in this state we have for example an interface that provides remote-git-platform etc.  
If using this approach `plugins` will be uniform we have no distinct `plugins types` whatsoever.

# Development

### template:

To develop template locally use `local.<pathToTemplate>` in import path.  
If you want to infer current directory use `local.` in import path.
