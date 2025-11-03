const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'davelib/settings.json');

function loadSettings() {
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({
      autoread: { enabled: false },
      autorecord: { enabled: false },
      autotyping: { enabled: false },
      autoviewstatus: true,
      autoreactstatus: true,
      welcome: false,
      goodbye: false,
      anticall: false,
      autobio: true,
      antidelete: { enabled: true },
      antilinkgc: { enabled: false },
      antilink: { enabled: false },
      antitag: {},
      antibadword: {},
      antipromote: { enabled: false, mode: "revert" },
      antidemote: { enabled: false, mode: "revert" },
      antibot: {},
      areact: {
        enabled: false,
        chats: {},
        emojis: ["😂","🔥","😎","👍","💀","❤️","🤖","🥵","🙌","💯"],
        mode: "random"
      },
      warnings: { enabled: true, maxWarnings: 3, chats: {} },
      online: true,
      public: true,
      onlygroup: false,
      onlypc: false,
      showConnectMsg: true
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(settingsPath));
}

function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

module.exports = { loadSettings, saveSettings };
