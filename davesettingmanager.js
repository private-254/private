const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'davelib/settings.json');

function loadSettings() {
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
      // Global bot settings (nested structure)
      autoread: { enabled: false },
      autorecord: { enabled: false },
      autotyping: { enabled: false },
      antidelete: { enabled: true },
      connectmessage: { enabled: false },
      chatbot: { enabled: false },

      // Flat structure settings
      showConnectMsg: false,
      anticall: false,
      autoviewstatus: true,
      autoreactstatus: true,
      welcome: false,
      goodbye: false,
      autobio: true,
      antilinkgc: { enabled: false },
      online: false,

      // ⭐ SIMPLE PUBLIC/PRIVATE MODE
      mode: "public",   // <== can be "public" or "private"

      onlygroup: false,
      onlypc: false,

      // Group protection settings
      antilink: {},
      antitag: {},
      antibadword: {},
      antipromote: {},
      antidemote: {},
      antibot: {},

      // Auto react settings
      areact: {
        enabled: false,
        chats: {},
        emojis: ["😂","🔥","😎","👍","💀","❤️","🤖","🥵","🙌","💯"],
        mode: "random"
      },

      // Warning system
      warnings: { enabled: true, maxWarnings: 3, chats: {} },

      // Bot info
      botName: "Dave AI",
      ownername: "Dev-dave",
      owner: ["254104260236"]
    }, null, 2));
  }

  const settings = JSON.parse(fs.readFileSync(settingsPath));

  // Make mode accessible globally
  global.mode = settings.mode; // "public" or "private"

  return settings;
}

function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

  // update global after saving
  global.mode = settings.mode;
}

module.exports = { loadSettings, saveSettings };