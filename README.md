# chat-scaleform
chat scaleform functionality for RAGE:MP

## Controls 

- **T** (GLOBAL chat)
- **Y** (TEAM chat)
- **U** (LOCAL chat)
- **alt + shift** (Changes to the secondary language if supported)
- **PAGE_UP** (Scroll history up) works only when input is opened
- **PAGE_DOWN** (Scroll history down)  works only when input is opened

## Known Issues

- Message colors for player's message isn't supported due to scaleform.
- Chat supports only one extra language and needs to be mapped before being used.

# Language mapping

Special thanks to [chrysls](https://github.com/chrysls) for his awesome contribution in creating Multi-language support. Although it's currently limited into **English + secondary language**, but we're aiming for more than two languages support in the future. Currently the first supported language is **Russian** which is provided in `client_packages/chat/mapping/ru.js`. Feel free expand our language database by your awesome contribution.

## How to contribute to language mapping

If you're a developer and want to expand our language mapping. Create an **javascript** file in `client_packages/chat/mapping/` and copy the form from `_base.js` and replace each key with its own unicode decimal. For more information about the keys, please check [virtual key codes](https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes).
To produce the unicode decimal for each key, you're required to run this small code provided by [chrysls](https://github.com/chrysls) to log each letter key in upper/lower case.

```js
document.body.addEventListener('keyup', function(e){
  console.log('' + e.code.charCodeAt(e.code.length - 1) + ': ' + e.key.charCodeAt(0));
});
```

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
