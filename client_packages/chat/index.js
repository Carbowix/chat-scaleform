require('./chat/commands')
const scaleform = require('./chat/Scaleform');
const chat = new scaleform('multiplayer_chat');
// Chat mapping support only one extra language for now.
//const MAPPING = null; - disable mapping if not required
const MAPPING = require('./chat/mapping/ru.js');


const specialChars = {
    0x30: ")",
    0x31: "!",
    0x32: "@",
    0x33: "#",
    0x34: "$",
    0x35: "%",
    0x36: "^",
    0x37: "&",
    0x38: "*",
    0x39: "(",
    0xBA: ":",
    0xDE: '\"',
    0xBF: "?",
    0xBC: "<",
    0xBE: ">",
    0xDC: "|"
};

let scope = null,
    msg = "",
    hideTimeout, chatHidden, shiftEnabled, capsEnabled;

// tmp variables to change language with default keybind
let langChanged = null, canChangeLang = true;

// To be addressed for next version..
const specialButtons = {
    0xDE: "'",
    0xDD: "]",
    0xDB: "[",
    0xDC: "\\",
    0xBF: "/",
    0xBC: ",",
    0xBA: ";",
    0xBE: ".",
    0xBD: "-", // chat now support "minus"
    0xBB: "+", // and plus
    0xC0: "`", // and this quote
}
const CODE_ESC = 0x1B;

Object.keys(specialButtons).forEach(b => {
    mp.keys.bind(parseInt(b), true, () => mp.events.call("keydown", (b)));
});

chat.callFunction('RESET');

mp.gui.chat.show(false);
mp.gui.chat.disabledInput = false;
mp.gui.chat.enabled = false;
mp.gui.chat.input_active = false; // input form hides if new message appears while typing into chat, a fix is needed

mp.gui.chat.clear = function () {
    mp.events.call('clearChat');
}
mp.gui.chat.sendMessage = function (msg, scope, author, authorColor) {
    mp.events.call('addMessage', author, msg, scope, authorColor);
}
mp.gui.chat.visible = function (state) {
    mp.events.call('showChat', state);
}

mp.keys.bind(0x20, true, () => mp.events.call("keydown", 0x20));
for (let i = 0x30; i <= 0x5A; i++) { // Credits to stuyk
    mp.keys.bind(i, true, () => mp.events.call("keydown", i));
}


mp.keys.bind(0x54, true, function () { // Global chat trigger
    scope = 'all';
    enableInput(scope);
});

mp.keys.bind(0x59, true, function () { // Team chat trigger
    scope = 'team';
    enableInput(scope);
});

mp.keys.bind(0x55, true, function () { // Local chat trigger
    scope = 'local';
    enableInput(scope);
});

mp.keys.bind(0x14, true, function () { // Capslock check
    capsEnabled = !capsEnabled;
});

mp.keys.bind(0x0D, true, function () { // Enter
    if (mp.gui.chat.enabled) {
        mp.gui.chat.input_active = false;
        if (msg.length > 0) msg.startsWith('/') ? mp.events.call('chatCommand', msg) : mp.events.callRemote('sendMessage', msg, scope);
        chat.callFunction('showFeed');
        msg = "";
        mp.gui.chat.enabled = !mp.gui.chat.enabled;
        triggerHideTimeout();
    }
});

// cancel chat on ESC key
mp.keys.bind(CODE_ESC, true, function () {
    if (mp.gui.chat.enabled) {
        mp.game.controls.disableAllControlActions(0);
        if (msg.length > 0) {
            deleteText(true);
        }
        chat.callFunction('SET_FOCUS', 0);
        chat.callFunction('showFeed');
        mp.gui.chat.enabled = !mp.gui.chat.enabled;
        mp.gui.chat.input_active = false;
    }
});

function triggerHideTimeout() {
    if (!mp.gui.chat.enabled) {
        hideTimeout = setTimeout(_ => {
            chat.callFunction('SET_FOCUS', 0);
        }, 5000);
    }
}

function deleteText(all) {
    if (mp.gui.chat.enabled && msg.length > 0) {
        if (all) {
            while(msg.length > 0) {
                msg = msg.slice(0, -1);
                chat.callFunction('DELETE_TEXT');
            }
        } else {
            msg = msg.slice(0, -1);
            chat.callFunction('DELETE_TEXT');
        }
    }
}

function enableInput(scope) {
    if (!chatHidden && !mp.gui.chat.enabled && !mp.gui.chat.disabledInput) {
        if (hideTimeout) clearInterval(hideTimeout);
        mp.gui.chat.enabled = !mp.gui.chat.enabled;
        mp.gui.chat.last_scope = scope;
        mp.gui.chat.input_active = true;
        chat.callFunction('SET_FOCUS', 2, "", scope);
    }
}

function addText(letter) {
    chat.callFunction('ADD_TEXT', letter);
    msg += letter;
}

function scroll(state) {
    switch (state) {
        case 'up':
            {
                chat.callFunction('PAGE_UP');
                break;
            }
        case 'down':
            {
                chat.callFunction('PAGE_DOWN');
                break;
            }
    }
}

setInterval(_ => { // Checking backspace    
    if (mp.keys.isDown(8) && mp.gui.chat.enabled) deleteText();
    if (mp.keys.isDown(33) && mp.gui.chat.enabled) scroll('up') // Page up
    if (mp.keys.isDown(34) && mp.gui.chat.enabled) scroll('down'); // Page down
    if (mp.keys.isDown(16) && mp.keys.isDown(18)) { // alt + shift (Changes the chat's language typing)
        langChanged = !langChanged;
        canChangeLang = false;
    } else {
        canChangeLang = true;
    }
    if (mp.keys.isDown(16)) shiftEnabled = true
    else shiftEnabled = false;
}, 50);

function langMap(code, uppercase) {

    // this could differ for other languages as I guess..
    if (code == 0xBD || code == 0xBB || code == 0xDC) return specialButtons[code].charCodeAt(0);
    if (code == 0xBF) return 46;

    if (uppercase) return (MAPPING.upperCase[code]) ? MAPPING.upperCase[code] : code;
    return (MAPPING.lowerCase[code]) ? MAPPING.lowerCase[code] : code;

}

mp.events.add({
    'showChat': (state) => {
        chatHidden = state;
        if (state) chat.callFunction('SET_FOCUS', 0);
        else {
            chat.callFunction('SET_FOCUS', 1);
            triggerHideTimeout();
        }
    },
    'keydown': (i) => {
        if (mp.gui.chat.enabled) {
            if (MAPPING && langChanged) {

                // 0-9, shift + number support tbd
                if (i >= 48 && i <= 57) {
                    return addText(String.fromCharCode(i));
                }
                addText(String.fromCharCode(langMap(i, (shiftEnabled || capsEnabled))))
            } else {
                if (shiftEnabled) {
                    specialChars[i] ? addText(specialChars[i]) : capsEnabled ? addText(String.fromCharCode(i).toLowerCase()) : addText(String.fromCharCode(i));
                } else {
                    specialButtons[i] ? addText(specialButtons[i]) : capsEnabled ? addText(String.fromCharCode(i)) : addText(String.fromCharCode(i).toLowerCase());
                }
            }
        }
    },
    'render': () => {
        if (mp.gui.chat.enabled) mp.game.controls.disableAllControlActions(0);
        chat.renderFullscreen();
    },

    'addMessage': (playerName, _msg, scope, playerColor) => {
        if (hideTimeout) clearTimeout(hideTimeout);
        chat.callFunction('SET_FOCUS', 1);
        chat.callFunction('ADD_MESSAGE', playerName ? playerName : " ", _msg, scope ? scope : "", false, playerColor ? playerColor : 0);
        // prevent current input disappear
        if (!mp.gui.chat.disabledInput && mp.gui.chat.input_active && msg.length) {
            chat.callFunction('SET_FOCUS', 2, "", scope);
            for(let i =0; i < msg.length; i++) {
                chat.callFunction('ADD_TEXT', msg[i]);
            }
        }
        triggerHideTimeout();
    },

    'clearChat': () => {
        chat.callFunction('RESET');
    }
});