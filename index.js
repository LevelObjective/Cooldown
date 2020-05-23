const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'BOT TOKEN HERE';

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
        bot.cooldowns [CD_role.name + " "+CD_channel.name] = {
            Role: CD_role.name,
            Channel: CD_channel.name,
            Duration: parseInt(CD_duration)
        };
        if(!CD_role) return message.channel.send("I couldn't find the role **"+args[0]+"**");;
        
        fs.writeFile("./cooldowns.json", JSON.stringify(bot.cooldowns, null,4), err =>{
            if (err)throw err;
            message.channel.send("Cooldown has been added successfully!");
        });
    }else{
        if(message.member.hasPermission("ADMINISTRATOR")) return;
        let CD_channel = message.channel;
        let CD_duration = 1509;
        let CurrentDuration;
        let Role;
        message.member.roles.forEach(role => {
                try {
                    
                CurrentDuration = bot.cooldowns[role.name + " "+CD_channel.name].Duration;
                if (CurrentDuration) {
                    if(CD_duration>CurrentDuration){
                        CD_duration = CurrentDuration;
                        Role = role;
                    }
            }
        }catch (error) {
                    }
            
        })
        
        if(cooldown.has(message.author.id+": "+CD_channel.name)){
            message.delete();
            return;
            //message.author.send("");
        }
        cooldown.add(message.author.id+": "+CD_channel.name);
        setTimeout(() =>{
            cooldown.delete(message.author.id+": "+CD_channel.name);
        }, CD_duration * 1000)
    }
    }
)

bot.login(token);
