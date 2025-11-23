const fs = require('fs')
const STORE_FILE = './baileys_store.json'

// Config: keep last 20 messages per chat (configurable) - More aggressive for lower RAM
let MAX_MESSAGES = 20

// Try to read config from settings - FIXED VERSION
try {
    const settingsModule = require('./davesettingmanager.js')
    const settings = settingsModule.loadSettings()
    if (settings.maxStoreMessages && typeof settings.maxStoreMessages === 'number') {
        MAX_MESSAGES = settings.maxStoreMessages
        console.log(`📦 Store: Using max ${MAX_MESSAGES} messages per chat`)
    }
} catch (e) {
    console.log('⚠️ Store: Using default message limit (20) -', e.message)
}

const store = {
    messages: {},
    contacts: {},
    chats: {},

    // Add method to update max messages dynamically
    setMaxMessages(max) {
        if (typeof max === 'number' && max > 0) {
            MAX_MESSAGES = max
            console.log(`📦 Store: Updated max messages to ${MAX_MESSAGES}`)
            
            // Trim existing messages to new limit
            Object.keys(this.messages).forEach(jid => {
                if (this.messages[jid].length > MAX_MESSAGES) {
                    this.messages[jid] = this.messages[jid].slice(-MAX_MESSAGES)
                }
            })
        }
    },

    // Add method to get current max messages
    getMaxMessages() {
        return MAX_MESSAGES
    },

    readFromFile(filePath = STORE_FILE) {
        try {
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
                this.contacts = data.contacts || {}
                this.chats = data.chats || {}
                this.messages = data.messages || {}

                // Clean up any existing data to match new format
                this.cleanupData()
            }
        } catch (e) {
            console.warn('Failed to read store file:', e.message)
        }
    },

    writeToFile(filePath = STORE_FILE) {
        try {
            const data = JSON.stringify({
                contacts: this.contacts,
                chats: this.chats,
                messages: this.messages
            })
            fs.writeFileSync(filePath, data)
        } catch (e) {
            console.warn('Failed to write store file:', e.message)
        }
    },

    cleanupData() {
        // Convert old format messages to new format if needed
        if (this.messages) {
            Object.keys(this.messages).forEach(jid => {
                if (typeof this.messages[jid] === 'object' && !Array.isArray(this.messages[jid])) {
                    // Old format - convert to new format
                    const messages = Object.values(this.messages[jid])
                    this.messages[jid] = messages.slice(-MAX_MESSAGES)
                }
            })
        }
    },

    bind(ev) {
        ev.on('messages.upsert', ({ messages }) => {
            messages.forEach(msg => {
                if (!msg.key?.remoteJid) return
                const jid = msg.key.remoteJid
                this.messages[jid] = this.messages[jid] || []

                // push new message
                this.messages[jid].push(msg)

                // trim old ones
                if (this.messages[jid].length > MAX_MESSAGES) {
                    this.messages[jid] = this.messages[jid].slice(-MAX_MESSAGES)
                }
            })
        })

        ev.on('contacts.update', (contacts) => {
            contacts.forEach(contact => {
                if (contact.id) {
                    this.contacts[contact.id] = {
                        id: contact.id,
                        name: contact.notify || contact.name || ''
                    }
                }
            })
        })

        ev.on('chats.set', (chats) => {
            this.chats = {}
            chats.forEach(chat => {
                this.chats[chat.id] = { id: chat.id, subject: chat.subject || '' }
            })
        })
    },

    async loadMessage(jid, id) {
        return this.messages[jid]?.find(m => m.key.id === id) || null
    },

    // Get store statistics
    getStats() {
        let totalMessages = 0
        let totalContacts = Object.keys(this.contacts).length
        let totalChats = Object.keys(this.chats).length

        Object.values(this.messages).forEach(chatMessages => {
            if (Array.isArray(chatMessages)) {
                totalMessages += chatMessages.length
            }
        })

        return {
            messages: totalMessages,
            contacts: totalContacts,
            chats: totalChats,
            maxMessagesPerChat: MAX_MESSAGES
        }
    }
}

module.exports = store