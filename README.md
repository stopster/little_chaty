Chat app
==============

Simple back end app for chat. Provides REST-like API and chat functionality via WebSockets.

## Summary
+ [API overview](#api-overview)
+ [API objects](#api-objects)
+ [API methods](#api-methods)
+ [Chat API methods](#chat-methods)
+ [Installation](#installation)  

## API overview
It consists of two parts:
+ REST-like API for users functionality (login, logout, authorize, get user(s))
+ Web sockets API for chat functionality.  

Consider this API as a set of objects and methods to work with this objects.

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
### basicUserObject

    {
        name: "someName",
        sex: ["male"/"female"]
    }

### loginUserDataObject

    {
        name: "someName", (required)
        sex: ["male"/"female"],
        image: "data:image/png;base64,asdqwasdf23f..."
    }  

### userObject

    {
        name: "someName"
        sex: ["male"/"female"]
        imageUrl: relativePath (e.g. */uploads/image-140002342562.png*) or `null`
    }

### secureUserObject

    {
        id: "23fasdbas323rfsadf32fawe32f2" (hash)
        name: "someName"
        sex: ["male"/"female"]
        imageUrl: relativePath (e.g. */uploads/image-140002342562.png*) or `null`
    }

### userIDObject

    {
        id: "23fasdbas323rfsadf32fawe32f2" (hash)
    }

### messageObject

    {
        user: userObject,
        message: "Some message text",
        [isYourMessage: true] - if you posted this message
    }

### imageObject

    {
        imageUrl: relativePath (e.g. */uploads/image-140002342562.png*) or `null`
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
Login user. Could be done in two ways.  
######First: contentType is set to `application/json` or `application/x-www-form-urlencoded` (default for forms)  
**Input**: `loginUserDataObject`.  
**Output**: `secureUserObject`.  

**Example**:
    
    var loginUser = function(name, sex, image){
        $.ajax({
            url: apiUrl + "/users/login",
            data: JSON.stringify({name: name, sex: sex, image: image}),
            contentType: "application/json",
            success: function(){...}
        });
    }
    $(".login").click(function(){
        var name = "st",
            sex = "male",
            image = null,
            fr = new FileReader();
        fr.onload = function(event){
            image = event.target.result;
            loginUser(name, sex, image);
        };

        fr.readAsDataURL($("input[image]").get(0).files[0]);
    });

######Second: contentType is set to `multipart/form-data`  
**Input**: [HTML FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) with fields, that has proper names.  

*Names accepted*:
`name`* - stands for user name, required,  
`sex` - stands for user sex (male/female),  
`image` - [File](https://developer.mozilla.org/en-US/docs/Web/API/File).  
**Output**: `secureUserObject`

**Example**:

    <form method="POST" enctype="multipart/form-data" class="login-form">
      <input name="name" type="text"/>
      <input name="sex" type="radio" value="male"/>
      <input name="sex" type="radio" value="female"/>
      <input name="image" type="file"/>
      <input name="login" type="submit" value="Log in"/>
    </form>

    $(".login-form").submit(function(event){
        event.preventDefault();
        var thisForm = this;
        $.ajax({
            url: apiUrl + "/users/login",
            data: new FormData(thisForm),
            contentType: "multipart/form-data",
            processData: false,
            success: funtion(){...}
        });
    });

### [POST] /users/logout
Logout user.  
**Input**: `userIDObject` or `secureUserObject`.  
**Output**: `successObject`.  

### [POST] /users/authorize
Try to get already loggedin user. Uses cookies, so does NOT work for LOCALHOST.  
**Input**:  
**Output**: `secureUserObject` 

### [POST] /users/upload
Uploads image for particular user. User should have Cookie `chatId` with his id, received during login.
Method accepts binary image up to 2Mb with proper contentType header set (one of the following: `"image/png", "image/jpeg", "image/gif"`).  
**Input**: binary file content in [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
**Output**: `imageObject`  

## Chat methods
Chat functionality implemented with [socket.io](http://socket.io/).
So, it's recommended to use it on client side, unless you are using native WebSocket API or another lib. In this case, you have to mimic socket.io [protocol](https://github.com/LearnBoost/socket.io-spec).
### [client event] enterChat
Join your socket to chat room.  
**Input**: `userIDObject`.  
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

# Installation
1. Install [node.js](http://nodejs.org).
2. Clone project (git clone https://github.com/stopster/little_chaty.git) or just grab a .zip (right sidebar)
3. Go to your project root directory and run `npm install` from command line. It will install all required modules.
4. Run `node index.js` from command line. Project will start on localhost:5000.

## Good luck!
If something went wrong (server is down, bugs (I'm sure, they are there), or this doc sucks) email me!    
Feel free to send pull requests with new features and bugfixes.
