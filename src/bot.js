
const { Bot, InlineKeyboard } = require('grammy');
const helpCommand = require('./commands/help');
const startCommand = require('./commands/start');
const echoCommand = require('./commands/echo');
const jonkCommand = require('./commands/jonk');
// const markCommand = require('./commands/mark');
const htmlCommand = require('./commands/html');
const { playCoinTossGame } = require('./func/coinGame');
const { playKMNGame } = require('./func/KMNGame');
const { startGuessNumberGame } = require('./func/guessGame');
const {fetchData} = require('./services/apiService');
const config = require('./config/botConfig');


const port = process.env.PORT || 3000;
const debugMode = process.env.DEBUG === 'true'; 

console.log(`Сервер запущен на порту: ${port}`);
console.log(`Режим отладки: ${debugMode ? 'Включен' : 'Выключен'}`);

const bot = new Bot(config.TOKEN);

let currentGame = {}; 

bot.command('help', helpCommand);
bot.command('start', startCommand);
bot.command('echo', echoCommand);
bot.command('jonk', jonkCommand);
// bot.command('mark', markCommand);
bot.command('html', htmlCommand);

bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data === 'var1') {
        ctx.answerCallbackQuery('Тут 50/50...');

        const game1Keyboard = new InlineKeyboard()
            .text('Орел', 'earl')
            .text('Решка', 'reshka');

        ctx.reply('Выберите Орел или Решка', { reply_markup: game1Keyboard });
    } else if (data === 'earl' || data === 'reshka') {
        await playCoinTossGame(ctx, data);  
    } else if (data === 'var2') {
        ctx.answerCallbackQuery('Тут 33%...');

        const game2Keyboard = new InlineKeyboard()
            .text('Камен', 'petr')
            .text('Ножны', 'scissors')
            .text('Бугага', 'paper');

            ctx.reply('Выберите Камен, Ножны или Бугага', { reply_markup: game2Keyboard });
    }  else if (data === 'petr' || data === 'scissors' || data === 'paper') {
        await playKMNGame(ctx, data);  
    }else if (data === 'var3') {
        ctx.answerCallbackQuery('Начинаем игру угадай число!');
        await startGuessNumberGame(ctx);
    }
    else if (data === 'help') {
        ctx.answerCallbackQuery('уже нечем помочь');
        ctx.reply('нажми /help.');
    }
});

bot.on('message:text', async (ctx) => {
    if (ctx.message.text === '/start' || ctx.message.text === '/help') {
        return; 
    }
    if (currentGame[ctx.from.id]) {
        const { targetNumber, attempts } = currentGame[ctx.from.id];
        const userGuess = parseInt(ctx.message.text);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            return ctx.reply('Введите число от 1 до 100!');
        }

        currentGame[ctx.from.id].attempts++;

        if (userGuess === targetNumber) {
            await ctx.reply(`Поздравляю! Вы угадали число ${targetNumber} за ${attempts + 1} попыток.`);
            delete currentGame[ctx.from.id];
        } else if (userGuess < targetNumber) {
            await ctx.reply('Мое число больше! Попробуйте снова.');
        } else {
            await ctx.reply('Мое число меньше! Попробуйте снова.');
        }
    }
});
bot.start();
console.log('Bot started.');
