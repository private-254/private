const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

let trashplug = async (m, { reply, text, trashcore }) => {
  try {
    if (!text) {
      return reply('Usage: .play <song name or YouTube link>');
    }

    let video;
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      video = { url: text };
    } else {
      const search = await yts(text);
      if (!search || !search.videos.length) {
        return reply('No results found.');
      }
      video = search.videos[0];
    }

    await trashcore.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: `🎵 Downloading: *${video.title}*\n⏱ Duration: ${video.timestamp}`,
    }, { quoted: m });

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=mp3`;
    
    const res = await axios.get(apiUrl, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.data || !res.data.result || !res.data.result.download) {
      throw new Error('Izumi API failed to return a valid link.');
    }

    const audioData = res.data.result;
    await trashcore.sendMessage(m.chat, {
      audio: { url: audioData.download },
      mimetype: 'audio/mpeg',
      fileName: `${audioData.title || video.title || 'song'}.mp3`,
      ptt: false,
    }, { quoted: m });
  } catch (err) {
    console.error('Song command error:', err);
    reply('❌ Failed to download song.');
  }
};

trashplug.help = ['play'];
trashplug.tags = ['downloader'];
trashplug.command = ['play'];

module.exports = trashplug;