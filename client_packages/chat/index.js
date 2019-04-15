require('./chat/commands')
const scaleform = require('./chat/Scaleform');
const chat = new scaleform('multiplayer_chat');
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

// To be addressed for next version..
const specialButtons = {
    0xDE: "'",
    0xDD: "]",
    0xDB: "[",
    0xDC: "\\",
    0xBF: "/",
    0xBC: ",",
    0xBA: ";",
    0xBE: "."
}

Object.keys(specialButtons).forEach(b => {
    mp.keys.bind(parseInt(b), true, () => mp.events.call("keydown", (b)));
});

chat.callFunction('RESET');
mp.gui.chat.show(false);
mp.gui.chat.disabledInput = false;
mp.gui.chat.enabled = false;
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
        if (msg.length > 0) msg.startsWith('/') ? mp.events.call('chatCommand', msg) : mp.events.callRemote('sendMessage', msg, scope);
        chat.callFunction('showFeed');
        msg = "";
        mp.gui.chat.enabled = !mp.gui.chat.enabled;
        triggerHideTimeout();
    }
});

function triggerHideTimeout() {
    if (!mp.gui.chat.enabled) {
        hideTimeout = setTimeout(_ => {
            chat.callFunction('SET_FOCUS', 0);
        }, 5000);
    }
}

function deleteText() {
    if (mp.gui.chat.enabled && msg.length > 0) {
        msg = msg.slice(0, -1);
        chat.callFunction('DELETE_TEXT');
    }
}

function enableInput(scope) {
    if (!chatHidden && !mp.gui.chat.enabled && !mp.gui.chat.disabledInput) {
        if (hideTimeout) clearInterval(hideTimeout);
        mp.gui.chat.enabled = !mp.gui.chat.enabled;
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
    if (mp.keys.isDown(16)) shiftEnabled = true
    else shiftEnabled = false;
}, 50);

mp.events.add({
    'showChat': (state) => {
        chatHidden = state;
        if (state) chat.callFunction('SET_FOCUS', 0);
        else {
            chat.callFunction('SET_FOCUS', 1);
            triggerHideTimeout();
        }
    },
    'keydown': (i) => { // Credits to stuyk/Gorge
        if (mp.gui.chat.enabled) {
            if (shiftEnabled) {
                specialChars[i] ? addText(specialChars[i]) : capsEnabled ? addText(String.fromCharCode(i).toLowerCase()) : addText(String.fromCharCode(i));
            } else {
                specialButtons[i] ? addText(specialButtons[i]) : capsEnabled ? addText(String.fromCharCode(i)) : addText(String.fromCharCode(i).toLowerCase());
            }
        }
    },
    'render': () => {
        if (mp.gui.chat.enabled) mp.game.controls.disableAllControlActions(0);
        chat.renderFullscreen();
    },

    'addMessage': (playerName, msg, scope, playerColor) => {
        if (hideTimeout) clearTimeout(hideTimeout);
        chat.callFunction('SET_FOCUS', 1);
        chat.callFunction('ADD_MESSAGE', playerName ? playerName : " ", msg, scope ? scope : "", false, playerColor ? playerColor : 0);
        triggerHideTimeout();
    },

    'clearChat': () => {
        chat.callFunction('RESET');
    }
});

/*
mp.game.streaming.requestIpl("xs_arena_interior_mod");
mp.game.streaming.requestIpl("xs_arena_interior_mod_2");
mp.game.streaming.requestIpl("xs_arena_interior_vip");

const localPlayer = mp.players.local;
const interiorID = mp.game.interior.getInteriorAtCoords(205.000, 5180.000, -90.000);
const interiorID2 = mp.game.interior.getInteriorAtCoords(170.000, 5190.000, 10.000);
// new mp.Vector3(205.000 5180.000 -91.000);
const interiorProps2 = [
    "Set_Int_MOD2_B1",
    "Set_Int_MOD2_B_TINT",
    "Set_Mod2_Style_02"
];

const interiorProps = [
    "Set_Int_MOD_SHELL_DEF",
    "Set_Mod1_Style_02",
    "Set_Int_MOD_BOOTH_BEN",
    "SET_OFFICE_HITECH",
    "set_arena_peds",
    "SET_XMAS_DECORATIONS",
    "Set_Int_MOD_TROPHY_CAREER",
    "Set_Int_MOD_TROPHY_SCORE",
    "Set_Int_MOD_TROPHY_WAGEWORKER",
    "Set_Int_MOD_TROPHY_TIME_SERVED",
    "Set_Int_MOD_TROPHY_GOT_ONE",
    "Set_Int_MOD_TROPHY_OUTTA_HERE",
    "Set_Int_MOD_TROPHY_SHUNT",
    "Set_Int_MOD_TROPHY_BOBBY",
    "Set_Int_MOD_TROPHY_KILLED",
    "Set_Int_MOD_TROPHY_CROWD",
    "Set_Int_MOD_TROPHY_DUCK",
    "Set_Int_MOD_TROPHY_BANDITO",
    "Set_Int_MOD_TROPHY_SPINNER",
    "Set_Int_MOD_TROPHY_LENS",
    "Set_Int_MOD_TROPHY_WAR",
    "Set_Int_MOD_TROPHY_UNSTOPPABLE",
    "Set_Int_MOD_TROPHY_CONTACT",
    "Set_Int_MOD_TROPHY_TOWER",
    "Set_Int_MOD_TROPHY_STEP",
    "Set_Int_MOD_TROPHY_PEGASUS",
    "SET_BANDITO_RC",
    "SET_OFFICE_TRINKET_03",
];

    interiorProps2.forEach(prop => {
        mp.game.interior.enableInteriorProp(interiorID2, prop);
        mp.game.interior.refreshInterior(interiorID2);
    });

setTimeout(_ => {
        interiorProps.forEach(prop => {
            mp.game.interior.enableInteriorProp(interiorID, prop);
            mp.game.interior.refreshInterior(interiorID);
        });
        localPlayer.setCoordsNoOffset(205.000, 5180.000, -90.000, false, false, false);
}, 5000);
*/