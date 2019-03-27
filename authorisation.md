MultiUser OAuth

/login -
  user page to register / login to an account that they own.
  they can see the list of existing accounts they're logged into.
  click on an existing account to switch on it, or click a 'manage' button.

/api/v1/verify?token=<token>
  gets the current user, as well as all other users this person is logged in as.

/api/v1/logout?user=user
  logs the current user out of the specified user account.

/token?token=<token> 
  returns a user from a token, e.g. User { email: ..., name: ... }

== Diagram ==
redis <-> token service <-> consumer
  ^
provider <-> consumer

== PART LIST ==
user
consumer
provider
token service

== TODO LIST ==
- token service that translates from token to session
- update provider to write session data to Redis
- add consumer service that calls token service and updates request object