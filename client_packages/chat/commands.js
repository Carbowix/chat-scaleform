let commands = {};

mp.events.add('chatCommand', (command) => {
    mp.game.graphics.notify('Triggered')
    let args = command.split(/[ ]+/);
    let cmd = args.splice(0, 1)[0].replace("/", "");
    
    commands[cmd] ? commands[cmd].apply(this, args) : mp.events.callRemote('chatCommand', cmd, JSON.stringify(args));
});

mp.gui.chat.addCommand = function (name, execute) {
    return commands[name] ? false : commands[name] = execute;
};

mp.gui.chat.removeCommand = function (name) {
    return commands[name] ? delete commands[name] : false;
};
