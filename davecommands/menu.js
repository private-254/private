const axios = require('axios');
let trashplug = async (m, {trashcore,replymenu,menu}) => {
replymenu(`${menu}
`)
    await trashcore.sendMessage(m.chat, { 
           audio: { url: 'https://files.catbox.moe/189cve.mp3' },
           mimetype: 'audio/mp4', 
           ptt: false 
       },{ quoted: m }
     );
};
trashplug.help = ['trashcore']
trashplug.tags = ['menu']
trashplug.command = ['menu']


module.exports = trashplug;