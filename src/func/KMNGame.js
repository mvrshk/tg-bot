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
module.exports = {playKMNGame};