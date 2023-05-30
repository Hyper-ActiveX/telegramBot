// const TelegramBot = require('node-telegram-bot-api');
// const axios = require("axios");

// const token = '6214847713:AAGrB4BHejtunHKX5Qhru9mdxvlDr8nQd2I';

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const dotenv = require('dotenv')
const express = require('express');
const app = express();

// import { env } from "module";

app.get('/start', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// const token = process.env.Token;
const token = '6214847713:AAGrB4BHejtunHKX5Qhru9mdxvlDr8nQd2I';

const bot = new TelegramBot(token, { polling: true });

const subscribers = new Set();



bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  function subscribersfun(susbcribed_users) {
    if(subscribers.has(susbcribed_users)){
      bot.sendMessage(chatId,"You already subscribed");
    }
    else{
      subscribers.add(susbcribed_users);
      bot.sendMessage(chatId,"successfully Subscribed");
    }
  }
  function unsubscribefun(susbcribed_users) {
    if(subscribers.has(susbcribed_users)){
      subscribers.delete(susbcribed_users);
      bot.sendMessage(chatId,"Unsubscribed Successfully");
    }
    else{
      bot.sendMessage(chatId, "you are not a subscriber member");
    }
  }

  const commonmsg="for weather update you have to write city name";

  const helpertext = 'For weather update you have to write city name' +'\n' + 'For subscribe weatherapp please write /subscribe'
  + '\n' + 'for unsubscribe please write /unsubscribe';

  if (userInput==='/start') {
    bot.sendMessage(chatId,"You started");
    bot.sendMessage(chatId,helpertext);
  } 
  else if(userInput === "/subscribe"){
    subscribersfun(chatId);
    bot.sendMessage(chatId,helpertext);
  }
  else if(userInput === "/unsubscribe"){
    unsubscribefun(chatId);
    bot.sendMessage(chatId,"Please subscribe to get weather update");
  }
  else if(userInput==="hello" || userInput==="hi" ||userInput==="hii"){
    bot.sendMessage(chatId,"hii! "+commonmsg);
  }
  else {
    try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=bd2a9f10f65489d3347ec44572847012`
        );
        const data = response.data;
        const weather = data.weather[0].description;
        const temperature = data.main.temp - 273.15;
        const city = data.name;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const windSpeed = data.wind.speed;
        const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;
          if (subscribers.has(chatId)) {
            bot.sendMessage(chatId, message);
            bot.sendMessage(chatId,helpertext);
          }
          else{
            bot.sendMessage(chatId,"subscribe to get weather update");
            bot.sendMessage(chatId,helpertext);
          }
        
        // console.log(chatId,'\n',message);
        // console.log(data,'\n',weather,'\n',temperature,'\n',city,'\n',humidity,'\n',pressure,'\n',windSpeed,'\n');
      } catch (error) {
        bot.sendMessage(chatId, "I didn't get, please write a valid city name");
      }
  }
  
});