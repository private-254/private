const qs = require('querystring');
const BASE_URL = 'https://steptodown.com'

async function getToken() {
  const res = await fetch(`${BASE_URL}/pinterest-video-downloader/`, {
    headers: {
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137 Safari/537.36'
    }
  })
  const html = await res.text()
  const match = html.match(/name="token" value="([^"]+)"/)
  if (!match) throw new Error('token tidak ditemukan')
  return match[1]
}

async function getVideoData(targetUrl, token) {
  const res = await fetch(`${BASE_URL}/wp-json/aio-dl/video-data/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137 Safari/537.36',
      'origin': BASE_URL,
      'referer': `${BASE_URL}/pinterest-video-downloader/`
    },
    body: qs.stringify({
      url: targetUrl,
      token
    })
  })
  return res.json()
}

const trashplug = async (m, {trashcore, text,reply,command }) => {
  if (!text) return reply(`Example : ${command} https://pin.it/xxxxx`)
  try {
    m.reply(mess.wait)
    const token = await getToken()
    const data = await getVideoData(text, token)

    if (!data.medias || !data.medias.length) return reply('failed to fetch media')

    const video = data.medias.find(x => x.extension === 'mp4')
    if (video) {
      await trashcore.sendMessage(m.chat, {
        video: { url: video.url },
        mimetype: 'video/mp4'
      }, { quoted: m })
    } else {
      const image = data.medias.find(x => x.extension === 'jpg' || x.extension === 'png')
      if (image) {
        await trashcore.sendMessage(m.chat, {
          image: { url: image.url }
        }, { quoted: m })
      }
    }
  } catch (e) {
    m.reply(`Eror occured : ${e.message}`)
  }
}

trashplug.help = ['pinterestdl <url>']
trashplug.tags = ['downloader']
trashplug.command = ['pindl', 'pinterestdl']

module.exports = trashplug;

    