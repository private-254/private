const axios = require('axios');
let trashplug = async (m, {command, text,trashcore }) => {
  if (!text) {
    await trashcore.sendMessage(m.chat, { text: 'Example: .gemma you good?' }, { quoted: m })
   
  }

  await trashcore.sendMessage(m.chat, { react: { text: '💡', key: m.key } })

  try {
    const res = await fetch(`https://www.velyn.biz.id/api/ai/gemma-2-9b-it?prompt=${encodeURIComponent(text)}`)
    if (res.ok) {
      const json = await res.json()
      if (json.status) {
        await trashcore.sendMessage(m.chat, { text: json.data }, { quoted: m })
        await trashcore.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
      } else {
        await trashcore.sendMessage(m.chat, { text: 'failed to fetch data from api.' }, { quoted: m })
        await trashcore.sendMessage(m.chat, { react: { text: '🚨', key: m.key } })
      }
    } else {
      await trashcore.sendMessage(m.chat, { text: `Status error: ${res.status}` }, { quoted: m })
      await trashcore.sendMessage(m.chat, { react: { text: '🚨', key: m.key } })
    }
  } catch (e) {
    await trashcore.sendMessage(m.chat, { text: 'an error has occurred.' }, { quoted: m })
    await trashcore.sendMessage(m.chat, { react: { text: '🚨', key: m.key } })
    console.error(e)
  }
};
trashplug.help = ['gemmachat']
trashplug.tags = ['gemmagpt']
trashplug.command = ['gemma']


module.exports = trashplug;