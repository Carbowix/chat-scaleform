let commands = {};

mp.events.add({
    'sendMessage': (player, msg, scope, playerColor) => {
        switch (scope) {
            case 'team': {
                mp.players.call(mp.players.toArray().filter((_player) => _player.getVariable('currentTeam') === player.getVariable('currentTeam')), 'addMessage', [player.name, msg, scope, playerColor ? playerColor : playerColor]);
                break;
            }

            case 'all': {
                mp.players.call('addMessage', [player.name, msg, scope, playerColor ? playerColor : playerColor]);
                break;    
            }

            case 'local': {
                mp.players.forEachInRange(player.position, 200, (p) => {
                    p.call('addMessage', [player.name, msg, scope, playerColor ? playerColor : playerColor])
                });
                break;
            }
        }
    },

    'chatCommand': (player, command, args) => {
        let cmdArgs = [player];
        args = Array.from(JSON.parse(args));
        args.forEach(arg => {
            cmdArgs.push(arg);            
        });
        commands[command] ? commands[command].apply(this, cmdArgs) : player.sendChatMessage("Unknown command entered.", "COMMAND");
    }
});

mp.players.announce = function (msg, customScope, author, authorColor) {
    mp.players.forEach(player => {
        player.call('addMessage', [author, msg, customScope ? customScope : "all", authorColor]);
    });
};

mp.players.announceInDimension = function (dimension, msg, customScope, author, authorColor) {
    mp.players.forEachInDimension(dimension, (player) => {
        player.call('addMessage', [author, msg, customScope ? customScope : "local", authorColor ]);
    });
}

mp.players.announceInRange = function (position, range, msg, customScope, author, authorColor) {
    mp.players.forEachInRange(position, range, (player) => {
        player.call('addMessage', [author, msg, customScope ? customScope : "local", authorColor]);
    });
}


mp.Player.prototype.sendChatMessage = function (msg, customScope, author, authorColor) {
    this.call('addMessage', [author, msg, customScope ? customScope : "local", authorColor]);
};

mp.Player.prototype.clearChat = function () {
    this.call('clearChat');
};

mp.events.addChatCommand = function (name, execute) {
    return commands[name] ? false : commands[name] = execute;
};

mp.events.removeChatCommand = function (name) {
    return commands[name] ? delete commands[name] : new TypeError("Command not found");
}
