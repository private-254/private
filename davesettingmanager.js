const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'davelib/settings.json');

function loadSettings() {
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
      // Global bot settings
      autoread: { enabled: false },
      autorecord: { enabled: false },
      autotyping: { enabled: false },
      public: true,
      onlygroup: false,
      onlypc: false,
      
      // Group protection settings (enabled per group)
      antilink: {},
      antitag: {},
      antibadword: {},
      antipromote: {},
      antidemote: {},
      antibot: {},
      
      // Auto-react settings
      areact: {
        enabled: false,
        chats: {},
        emojis: ["😂","🔥","😎","👍","💀","❤️","🤖","🥵","🙌","💯"],
        mode: "random"
      },
      
      // Warning system
      warnings: { enabled: true, maxWarnings: 3, chats: {} },
      
      // Other settings from your dave.js
      autoviewstatus: true,
      autoreactstatus: true,
      welcome: false,
      goodbye: false,
      anticall: false,
      autobio: true,
      antidelete: { enabled: true },
      antilinkgc: { enabled: false },
      connectmessage: { enabled: true },
      online: true
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

module.exports = { loadSettings, saveSettings };
