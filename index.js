const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'TOKEN HERE';

bot.on('ready', () => {
    console.log("Bot is online");
    
});

bot.cooldowns= require("./cooldowns.json")

const fs = require("fs");
let cooldown = new Set();


bot.on('message', message => {
    if (message.content.startsWith("!cooldown ")){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission to execute that command.");
        let args = message.content.slice(10).split(" ");
        let CD_role = message.mentions.roles.first();
        let CD_duration = args[1];
        let CD_channel = message.mentions.channels.first()
        bot.cooldowns [CD_role.id + " "+CD_channel.id] = {
            Role: CD_role.name,
            Channel: CD_channel.name,
            Duration: parseInt(CD_duration)
        };
        if(!args[0] || !args[1] || !args[2]) return message.channel.send("Invalid usage: !cooldown @Role [Duration] #Channel");
        if(!CD_role) return message.channel.send("Invalid role!");
        if(!CD_channel) return message.channel.send("Invalid channel!");
        
        
        if(parseInt(CD_duration)==0) {
            delete bot.cooldowns[CD_role.id + " "+CD_channel.id];
            fs.writeFile("./cooldowns.json", JSON.stringify(bot.cooldowns, null,4), err =>{
                if (err)throw err;
                message.channel.send("Cooldown has been **deleted** successfully!");
            });
            return;
        }
        fs.writeFile("./cooldowns.json", JSON.stringify(bot.cooldowns, null,4), err =>{
            if (err)throw err;
            message.channel.send("Cooldown has been **added** successfully!");
        });
    }else{
        if(message.member.hasPermission("ADMINISTRATOR")) return;
        let CD_channel = message.channel;
        let CD_duration = 150900;
        let CurrentDuration;
        let Role;
        message.member.roles.forEach(role => {
                try {
                    
                CurrentDuration = bot.cooldowns[role.id + " "+CD_channel.id].Duration;
                if (CurrentDuration) {
                    if(CD_duration>CurrentDuration){
                        CD_duration = CurrentDuration;
                        Role = role;
                    }
            }
        }catch (error) {
                    }
            
        })
        
        if(cooldown.has(message.author.id+": "+CD_channel.id)){
            message.delete();
            return;
            //message.author.send("");
        }
        if(CD_duration==150900) return;
        cooldown.add(message.author.id+": "+CD_channel.id);
        setTimeout(() =>{
            cooldown.delete(message.author.id+": "+CD_channel.id);
        }, CD_duration * 1000)
    }
    }
)

bot.login(token);
