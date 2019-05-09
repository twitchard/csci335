## Cross site scripting

Similar in principle to SQL Injection.

SQL injection = SQL server executes user data that is supposed to be quoted

XSS = Browser executes user data that is supposed to be quoted

If your page is vulnerable to XSS, then I can access all the user's information and do anything the user is authorized to do.

* Famous one: Samy attack in 2005
* Tweetdeck had one more recently
* Example 
