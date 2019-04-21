# MultiUser OAuth Description 
## Endpoints 

authenticationProvider.tld/login -
  - User page to register / login to an account that they own.
  - They can see the list of existing accounts they're logged into.
  - Click on an existing account to switch on it, or click a 'manage' button.

authenticationProvider.tld/logout
  - Logs the current user out of the specified user account.

authenticationProvider.tld/api/auth?id=&lt;id&gt;?redirect=&lt;redirect\_URL&gt; 
  - Returns a user from a token, e.g. User { email: ..., name: ... }

## Diagram 
redis &lt;-&gt; token service &lt;-&gt; consumer
  ^
provider <-> consumer

## Parts List
- User
- Consumer (lib-authentication-consumer + web-authentication-consumer)
- Provider (web-authentication-provider)
- Token Service (web-authentication-token-service)


