Chat app
==============

Simple back end app for chat.
Provides API to login/logout and chating.

CLIENT LIB NEEDED: [socket.io](https://raw.githubusercontent.com/stopster/little_chaty/master/public/js/socket.io.min.js)  

## API overview
API available on **`http://chaty.st.lviv.ua/api`**.
For chat functionality with websockets, use **`http://chaty.st.lviv.ua`** address.

General flow of using API:

0. (Optional) Checking, if choosen name is available. [API]
1. Loging user (with name, sex, etc.)                 [API]
2. Open WebSocket for chat                            [WS]
3. Send initial message ([`enterChat`](#client-event-enterchat)) [WS]
4. Send and receive chat messages and user statuses   [WS]
5. Close socket and/or logout user.                   [API/WS]

*API - use via XMLHttpRequest, WS - WebSocket  

## API objects
All objects should be send and will be received in JSON.
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

### messageObject

    {
        user: "someUserName",
        message: "Some message text",
        [isYourMessage: true] - if you posted this message
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
### [GET] /users/isLoggedIn/:userName
Check, if user is online.  
**Output**: `successObject`.  

### [GET] /users/[:userName]
Get particular user object, if userName provided or array of users, which is online.  
**Output**: `userObject/[userObject]`.  

### [POST] /users/login
Login user.  
**Input**: `userObject`.  
**Output**: `secureUserObject`.  

### [POST] /users/logout
Logout user.  
**Input**: `userIDObject` or `secureUserObject`.   
**Output**: `successObject`.  

## Chat 
Chat functionality implemented with [socket.io](http://socket.io/).
So, it's recommended to use it on client side, unless you are using native WebSocket API or another lib. In this case, you have to mimic socket.io [protocol](https://github.com/LearnBoost/socket.io-spec).
### [client event] enterChat
Join your socket to chat room.  
**Input**: `userObject`.  
Also, it triggers server event [`chatEntered`](#server-event-chatentered) event for you, and `userOnline` for all users online.  Example:
    
    var socket = io.connect(chatUrl);

    socket.on("connect", function(){
        socket.emit("enterChat", user);
        socket.on("chatEntered", function(){
            // some code to notify user, that chat is available: blink button, popup, alert :)
        });
    });

### [client event] postMessage
Post your message in the chat.  
**Input**: `messageObject`  

### [server event] chatEntered
Triggers after you entered the chat. Only YOU will be notified.  
**Output** nothing :)  

### [server event] message
Notify ALL about new message in the chat.  
**Output**: `messageObject`.  

### [server event] userOnline
Notify ALL about new user in chat.  
**Output**: `userObject`.  

### [server event] userOffline
Notify ALL about some user has left the chat.  
**Output**: `userObject`.  

### [server event] error
If something is wrong, server will emit error event.  
**Output**: `errorObject`.  

Just to be make sure, that difference between client event and server one is crystal clear:  
*Send data to the server by emiting (`.emit()`) client events (enterChat, postMessage, ...).*  
*Receive data from the server by listening (`.on()`) server events (userOnline, message...)*  

## Good luck!
If something went wrong (server is down, bugs (I'm sure, they are there), or this doc sucks) email me!    
