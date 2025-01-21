const fetch = require('node-fetch');

const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json(); // Получаем данные в формате JSON
};

module.exports = { fetchData };