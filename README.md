Chat app
==============

Simple back end app for chat.
Provides API to login/logout and chating.

## API
API available on 198.211.123.35:5000/api.
For chat functionality with websockets, use 198.211.123.35:5000 address.

General flow of using API:
0. (Optional) Checking, if choosen name is available.
1. Loging user (with name, sex, etc.)
2. Open WebSocket for chat
3. Send initial message (enter chat)
4. Send messages to the chat
5. Close socket and/or logout user.

API method description:
### /api/user/isLoggedIn/:userName [GET]
Check, if username is available.
Returns JSON: `true/false`.

### /api/user/[:userName] [GET]
Get particular user object, if userName provided or array of users, which is online.
*Returns* JSON: `userObject/[userObject]`.


