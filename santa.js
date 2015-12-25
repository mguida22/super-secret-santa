#!/usr/bin/env node

"use strict";

require('dotenv').config({silent: true});

const inquirer = require('inquirer');

let client;
if (process.env.NODE_ENV === 'production') {
  client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
}

function send(people, price) {
  let name, forName, text;
  for (let number in people) {
    name = people[number].name;
    forName = people[number].santaFor.name;
    if (!name || !forName || !price) {
      console.error("Incomplete info");
      return;
    }

    text = `Hi ${name}, you have ${forName}. The price limit is $${price}. Happy Holidays from super-secret-santa!`;

    if (process.env.NODE_ENV === 'production') {
      // only text in production
      client.messages.create({
      	to: number,
      	from: process.env.PHONE_NUMBER,
      	body: text,
      }, function(err, message) {
        if (err) {
          return console.error(err);
        }
        // print messages sent
        // console.log(message.body);
      });
    } else {
      console.log(text);
    }
  };
}

function assign(people, numbers, price) {
  // randomization of array adapted from http://stackoverflow.com/a/2450976
  let currentIndex = numbers.length;
  let temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = numbers[currentIndex];
    numbers[currentIndex] = numbers[randomIndex];
    numbers[randomIndex] = temporaryValue;
  }

  for (let i=0; i < numbers.length - 1; i++) {
    people[numbers[i]].santaFor = {
      name: people[numbers[i+1]].name
    };
  }

  people[numbers[numbers.length - 1]].santaFor = {
    name: people[numbers[0]].name
  };

  send(people, price);
}

console.log("Welcome to super-secret-santa!");

let people = {};
let numbers = [];
let questions = [
  {
    type: "input",
    name: "name",
    message: "Enter a name:"
  },
  {
    type: "input",
    name: "phone",
    message: "What's a good number?",
    validate: function(value) {
      var pass = value.match(/^([01]{1})?[\-\.\s]?\(?(\d{3})\)?[\-\.\s]?(\d{3})[\-\.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid phone number";
      }
    }
  },
  {
    type: "confirm",
    name: "again",
    message: "Add another person?",
    default: true
  }
];

function ask() {
  inquirer.prompt(questions, function(answers) {
    people[answers.phone] = { name: answers.name };
    numbers.push(answers.phone);
    if (answers.again) {
      ask();
    } else {
      inquirer.prompt([
        {
          type: "list",
          name: "price",
          message: "Select a price (USD) limit",
          choices: ["$ 10", "$ 15", "$ 20", "$ 30", "$ 50"],
          filter: function(val) { return val.replace(/[^0-9]/g, ''); }
        }
      ], function(answers) {
        assign(people, numbers, answers.price)
      });
    }
  });
}

ask();
