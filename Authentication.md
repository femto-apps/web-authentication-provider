# MultiUser OAuth Description 
## Endpoints 

authenticationProvider.com/login -
  - User page to register / login to an account that they own.
  - They can see the list of existing accounts they're logged into.
  - Click on an existing account to switch on it, or click a 'manage' button.

authenticationProvider.com/api/verify?token=<token>
  - Gets the current user, as well as all other users this person is logged in as.

authenticationProvider.com/logout
  - Logs the current user out of the specified user account.

authenticationProvider.com/api/auth?token=<token> 
  - Returns a user from a token, e.g. User { email: ..., name: ... }

## Diagram 
redis <-> token service <-> consumer
  ^
provider <-> consumer

## Parts List
user
consumer (lib-consumer)
provider
token service


