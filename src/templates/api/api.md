# For now we would implement only strip blocks logic, as this would be enough to create even more complex templates.


## With template api user must be able to cleanly create part from template.

<br><br/>
## them == api users

## General ideas:
- should we preprocess all files for them, or let them play with this (strip-blocks)?


## Strip-blocks:
The issue with strip block is that different languages have different comment tokens, the solution to that is that when we encounter strip block start token we delete the whole line so that we will never miss the comment token


## About files:
I think we shouldn't let them touch on fs as this would introduce unnecessary complexity.  

