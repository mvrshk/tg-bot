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


bot.command('help', (ctx) => {
    ctx.reply('/start - привет\n/help - помощь\n/echo - повторить сообщение\n/jonk - спой песню');
});

bot.command('echo', (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ');
    ctx.reply(message || 'Напиши прикол, чтобы я повторил.');
});

bot.command('markdown', (ctx) => {
    ctx.reply('Вот пример *жирного текста* , _курсива_ и `монотекста`', { parse_mode: 'MarkdownV2' });
});

bot.command('html', (ctx) => {
    ctx.reply('Вот пример <b>жирного текста</b> и <i>курсива</i>.', { parse_mode: 'HTML' });
});

bot.command('jonk', async (ctx) => {
    const muz = [
        'В старом доме на обочине\nТри цветка, три дочери\nАманда, Линда и Роуз\nАманда, Линда и Роуз\nРисовали акварелями\nЧтоб забыть о времени\nАманда, Линда и Роуз\nАманда, Линда и Роуз',
        'Этот рэпер диссит VIPERR, хз, как он называется\nТипа влево шаг, вправо шаг, деньги просто спавнятся\nСкажи, что слушаешь VIPERR, если хочешь ей понравиться (Факт)\nА-а-а, VIPERR-лига — это чемпион\nТеперь, как Нико Беллик, на FM Владивосток\nИ ты ничё не дропаешь, потому что у тебя застой\nТы переводишь чужой рэп, а у меня секси-рэп\n',
        'Я знаю твоего отца, он знает меня тоже.\n Я мало ему нравлюсь — в этом мы с ним так похожи.\n Зато я нравлюсь твоей маме, с ней гораздо проще',
        'Кто придумал сосны, маму и кефир?\n Кто нас поливает проливным дождем, \nКто про завтра знает уже сегодня днем?\n Тимочка-философ в облака глядит',
    ];

    const randJonk = muz[Math.floor(Math.random() * muz.length)];
    await ctx.reply(randJonk);
});

async function playCoinTossGame(ctx, userChoice) {
    const result = Math.random() < 0.5 ? 'Орел' : 'Решка';
    const choice = userChoice === 'earl' ? 'Орел' : 'Решка';

    if (choice === result) {
        await ctx.reply(`Выбор: ${choice}. ww`);
    } else {
        await ctx.reply(`Выбор: ${choice}. =( Результат: ${result}`);
    }
}

async function playKMNGame(ctx, userChoice) {
    const options = ['Камен', 'Ножны', 'Бугага'];
    const result = options[Math.floor(Math.random() * 3)];
    const choice = userChoice === 'petr' ? 'Камен' : userChoice === 'scissors' ? 'Ножны' : 'Бугага';

    let outcomeMessage = `Вы: ${choice}. ботяра: ${result}.`;

    if (choice === result) {
        outcomeMessage += ' Ничья!';
    } else if (
        (choice === 'Камен' && result === 'Ножны') ||
        (choice === 'Ножны' && result === 'Бугага') ||
        (choice === 'Бугага' && result === 'Камен')
    ) {
        outcomeMessage += ' ww';
    } else {
        outcomeMessage += ' =(';
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
