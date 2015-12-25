"use strict";

const inquirer = require('inquirer');

function message(people) {
  // send texts from here
  console.log(people);
}

function assign(people, numbers) {
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

  message(people);
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
      assign(people, numbers);
    }
  });
}

ask();
