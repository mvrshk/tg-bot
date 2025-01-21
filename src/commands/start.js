const { InlineKeyboard } = require("grammy");

const startCommand = (ctx) => {
    const keyboard = new InlineKeyboard()
        .text('Орел Решка', 'var1')
        .text('Камень-бумага', 'var2')
        .text('Угадай число', 'var3')
        .row()
        .text('помогите', 'help');
    ctx.reply('Привет! Напиши /help, чтобы узнать, как использовать бота. Нажми на кнопки, чтобы играть!', { reply_markup: keyboard });
};

module.exports = startCommand;
