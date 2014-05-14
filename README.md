Chat app
==============

Simple back end app for chat.
Provides API to login/logout and chating.

## API overview
API available on 198.211.123.35:5000/api.
For chat functionality with websockets, use 198.211.123.35:5000 address.

General flow of using API:

0. (Optional) Checking, if choosen name is available.
1. Loging user (with name, sex, etc.)
2. Open WebSocket for chat
3. Send initial message (enter chat)
4. Send messages to the chat
5. Close socket and/or logout user.

## API objects
All objects are in JSON.
### userObject

    {
        name: "someName"
        sex: ["male"/"female"]
        image: STILL IN PROGRESS! (sorry for that :))
    }

### secureUserObject

    {
        id: "23fasdbas323rfsadf32fawe32f2" (hash)
        name: "someName"
        sex: ["male"/"female"]
        image: STILL IN PROGRESS! (sorry for that :))
    }

### userIDObject

    {
        id: "23fasdbas323rfsadf32fawe32f2" (hash)
    }

### successObject

    {
        success: true/false
    }

### errorObject

    {
        message: "Some error message. Also HTTP status code will be available."
    }

##API methods
### [GET] /user/isLoggedIn/:userName
Check, if user is online.

**Output** JSON: `successObject`.

### [GET] /user/[:userName]
Get particular user object, if userName provided or array of users, which is online.

**Output** JSON: `userObject/[userObject]`.

### [POST] /user/login
Login user.

**Input** JSON: `userObject`.

**Output** JSON: `secureUserObject`.

### [POST] /user/logout
Logout user.

**Input** JSON: `userIDObject`.

**Output** JSON: `successObject`.

## Chat 
Chat functionality implemented with (socket.io)[http://socket.io/].
So, it's recommended to use it on client side, unless you are using native WebSocket API or another lib. In this case, you have to mimic socket.io handshaking and messaging (not the funnies activity, actually)


