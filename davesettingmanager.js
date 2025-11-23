const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'davelib/settings.json');

function loadSettings() {
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
      // ---------------- Nested feature toggles ----------------
      autoread: { enabled: false },
      autorecord: { enabled: false },
      autotyping: { enabled: false },
      antidelete: { enabled: true },
      connectmessage: { enabled: false },
      chatbot: { enabled: false },

      // ---------------- Flat feature toggles ----------------
      showConnectMsg: false,
      anticall: false,
      autoviewstatus: true,                 // Auto-view status (default ON)
      autoreactstatus: true,                // Auto-react to status
      statusReactEmojis: ["💙","❤️","🌚","😍","✅"],

      welcome: false,
      goodbye: false,
      autobio: true,
      antilinkgc: { enabled: false },
      online: false,

      // ---------------- Public/private mode ----------------
      mode: "public",                       // Default public

      onlygroup: false,
      onlypc: false,

      // ---------------- Group protection ----------------
      antilink: {},
      antitag: {},
      antibadword: {},
      antipromote: {},
      antidemote: {},
      antibot: {},

      // ---------------- Auto-react settings ----------------
      areact: {
        enabled: false,
        chats: {},
        emojis: ["😂","🔥","😎","👍","💀","❤️","🤖","🥵","🙌","💯"],
        mode: "random"
      },

      // ---------------- Warning system ----------------
      warnings: { enabled: true, maxWarnings: 3, chats: {} },

      // ---------------- Bot info ----------------
      botName: "Dave AI",
      ownername: "Dev-dave",
      owner: ["254104260236"]
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

module.exports = { loadSettings, saveSettings };