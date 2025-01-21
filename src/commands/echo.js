const echoCommand = (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(message || 'Напиши прикол, чтобы я повторил.');
}

module.exports = echoCommand;