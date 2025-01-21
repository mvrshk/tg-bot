const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot('7707427846:AAGlk1n3_Yd-uYeVVsGR0a-6SF7HUrTIJ_g');

let currentGame = {}; // Для хранения состояния игры

bot.command('start', (ctx) => {
    const keyboard = new InlineKeyboard()
        .text('Орел Решка', 'var1')
        .text('Камень-бумага', 'var2')
        .text('Угадай число', 'var3')
        .row()
        .text('помогите', 'help');
    ctx.reply('Привет! Напиши /help, чтобы узнать, как использовать бота. Нажми на кнопки, чтобы играть!', { reply_markup: keyboard });
});

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
            .text('Бумага', 'paper');
        ctx.reply('Выберите Камень, Ножницы или Бумагу', { reply_markup: game2Keyboard });
    } else if (data === 'petr' || data === 'scissors' || data === 'paper') {
        await playKMNGame(ctx, data);
    } else if (data === 'var3') {
        ctx.answerCallbackQuery('Начинаем игру угадай число!');
        await startGuessNumberGame(ctx);
    } else if (data === 'help') {
        ctx.answerCallbackQuery('Смотри команды ниже!');
        ctx.reply('Для начала игры напиши /start, для получения помощи /help.');
    }
});

bot.command('help', (ctx) => {
    ctx.reply('/start - Приветствие\n/help - Помощь\n/echo - Повторить сообщение\n/jonk - Спой песню');
});

bot.command('echo', (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(message || 'Напиши текст, чтобы я повторил.');
});

bot.command('jonk', async (ctx) => {
    const muz = [
        'В старом доме на обочине...',
        'Этот рэпер диссит VIPERR...',
        'Я знаю твоего отца...',
        'Кто придумал сосны...',
    ];

    const randJonk = muz[Math.floor(Math.random() * muz.length)];
    await ctx.reply(randJonk);
});

async function playCoinTossGame(ctx, userChoice) {
    const result = Math.random() < 0.5 ? 'Орел' : 'Решка';
    const choice = userChoice === 'earl' ? 'Орел' : 'Решка';

    if (choice === result) {
        await ctx.reply(`Вы выбрали: ${choice}. Поздравляю, вы выиграли!`);
    } else {
        await ctx.reply(`Вы выбрали: ${choice}. К сожалению, результат: ${result}.`);
    }
}

async function playKMNGame(ctx, userChoice) {
    const options = ['Камен', 'Ножницы', 'Бумага'];
    const result = options[Math.floor(Math.random() * 3)];
    const choice = userChoice === 'petr' ? 'Камен' : userChoice === 'scissors' ? 'Ножницы' : 'Бумага';

    let outcomeMessage = `Вы: ${choice}. Бот: ${result}.`;

    if (choice === result) {
        outcomeMessage += ' Ничья!';
    } else if (
        (choice === 'Камен' && result === 'Ножницы') ||
        (choice === 'Ножницы' && result === 'Бумага') ||
        (choice === 'Бумага' && result === 'Камен')
    ) {
        outcomeMessage += ' Победа!';
    } else {
        outcomeMessage += ' Проигрыш!';
    }

    await ctx.reply(outcomeMessage);
}

async function startGuessNumberGame(ctx) {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    currentGame[ctx.from.id] = { targetNumber, attempts: 0 };

    await ctx.reply('Я загадал число от 1 до 100. Попробуйте угадать!');
}

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
