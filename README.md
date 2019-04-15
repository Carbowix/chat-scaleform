# chat-scaleform
chat scaleform functionality for RAGE:MP

## Controls 

- **T** (GLOBAL chat)
- **Y** (TEAM chat)
- **U** (LOCAL chat)
- **PAGE_UP** (Scroll history up) works only when input is opened
- **PAGE_DOWN** (Scroll history down)  works only when input is opened

## Known Issues

- Message colors for player's message isn't supported due to scaleform.
- Other languages than ENGLISH isn't supported (Might be supported in future)

# API

## Client-side

```js
// Property getter/setter Boolean (Disables/Enables chat input)
mp.gui.chat.disabledInput = true;
mp.gui.chat.disabledInput

// Property getter Boolean (Check if chat is open)
mp.gui.chat.enabled;

// Function to clear localPlayer's chat feed
mp.gui.chat.clear();
// Trigger chat's visibility (visible: Boolean);
mp.gui.chat.visible(visible);
/*
* msg: string
* scope: string (message's scope (Author [scope] msg))
* author: string
* authorColor: int hudColorID (https://wiki.rage.mp/index.php?title=Fonts_and_Colors) (Default: white)
*/
mp.gui.chat.sendMessage(msg, scope, author, authorColor);

/*
* Registers command locally for client.
* name: string (command name)
* arg1: command's arguement
*/

mp.gui.chat.addCommand(name, function (arg1, arg2) {
	// do whatever...
});

/*
* Removes command locally for client.
* name: string (command name)
*/

mp.gui.chat.removeCommand(name);
```

## Server-side

```js
/*
* Sends message to all players in server
* msg: string
* scope: string (message's scope (Author [scope] msg))
* author: string (Default: [SERVER])
* authorColor: int hudColorID (https://wiki.rage.mp/index.php?title=Fonts_and_Colors) (Default: white)
*/

mp.players.announce(msg, scope, author, authorColor);

/*
* Sends messaage to all players in specified dimension
* dimension: int
* msg: string
* scope: string (message's scope (Author [scope] msg))
* author: string
* authorColor: int hudColorID (https://wiki.rage.mp/index.php?title=Fonts_and_Colors) (Default: white)
*/

mp.players.announceInDimension(dimension, msg, scope, author, authorColor);

/*
* Sends messaage to all players in specified dimension
* position: Vector3
* range: int
* msg: string
* scope: string (message's scope (Author [scope] msg))
* author: string
* authorColor: int hudColorID (https://wiki.rage.mp/index.php?title=Fonts_and_Colors) (Default: white)
*/
mp.players.announceInRange(position, range, msg, scope, author, authorColor);

/*
* Registers commands in chat
* name: string (command name)
* player: command executer
* arg1: Arguement after command
*/

mp.events.addChatCommand(name, function (player, arg1, arg2) {
	// Do what you want...
});

/*
* Removes command from server
* name: string (command name)
*/
mp.events.removeChatCommand(name);

/*
* Sends message to all players in server
* msg: string
* scope: string (message's scope (Author [scope] msg))
* author: string
* authorColor: int hudColorID (https://wiki.rage.mp/index.php?title=Fonts_and_Colors) (Default: white)
*/

player.sendChatMessage(msg, scope, author, authorColor);

// Clears player's chat
player.clearChat();
```

- **NOTE**: This resource supports [teams resource](https://rage.mp/files/file/85-simple-teams/)
