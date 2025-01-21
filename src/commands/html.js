const htmlCommand = (ctx) => {
    ctx.reply('Вот пример <b>жирного текста</b> и <i>курсива</i>.', { parse_mode: 'HTML' });
};

module.exports = htmlCommand;