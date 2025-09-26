let trashplug=async(m,{args,reply})=>{
  try{
    if(!args[0])return reply('provide a query')
    m.reply((await (await fetch(`https://api.nekolabs.my.id/ai/copilot?text=${encodeURIComponent(args.join(' '))}`)).json()).result.text)
  }catch(e){m.reply(e.message)}
}

trashplug.help=['copilot']
trashplug.command=['copilot']
trashplug.tags=['ai']

module.exports = trashplug;	