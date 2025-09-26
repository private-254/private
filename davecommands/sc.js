const axios = require('axios');
let trashplug = async (m, { trashown, trashcore, reply }) => {
    let regionData = {
        '254': 'Kenya (+254)',
        '265': 'Malawi (+265)', 
        '91': 'India (+91)',
        '90': 'Turkey (+90)',
        '263': 'Zimbabwe (+263),
    };

    for (let countryCode in regionData) {
        if (m.sender.startsWith(countryCode)) {
            global.db.data.users[m.sender].banned = true
            let bannedCountries = Object.values(regionData).join('\n');
            reply(`Sorry, you can't use this bot at this time because your country code has been banned due to spam requests.\n\nBlocked List of Countries:\n${bannedCountries}`);
            return
        }
    }
};

trashplug.help = ['autoban']
trashplug.tags = ['security'] 
trashplug.command = ['autoban']

module.exports = trashplug;
