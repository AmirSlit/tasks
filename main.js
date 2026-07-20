// A. Part 1: Coding Questions (7.5 Grade):

// 1.
// let str = "123";
// console.log(Number(str) + 7);

// 2.
// let x = 0;
// if (!Boolean(x)) {
//   console.log("Invalid");
// }
// console.log(Boolean(x));

// 3.
// let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// for (let i = 0; i < arr.length; i++) {
//   if (i % 2 !== 0) {
//     continue;
//   }
//   console.log(arr[i]);
// }

// 4.
// let arr = [1, 2, 3, 4, 5];
// let even = arr.filter((el) => {
//   return el % 2 === 0;
// });
// console.log(even);

// 5.
// let arr1 = [1, 2, 3];
// let arr2 = [4, 5, 6];
// function concat(...nums) {
//   return nums;
// }
// console.log(concat(...arr1, ...arr2));

// 6.
// let day = 2;
// switch (day) {
//   case 1:
//     day = "Sunday";
//     break;
//   case 2:
//     day = "Monday";
//     break;
//   case 3:
//     day = "Tuesday";
//     break;
//   case 4:
//     day = "Wednesday";
//     break;
//   case 5:
//     day = "Thursday";
//     break;
//   case 6:
//     day = "Friday";
//     break;
//   case 7:
//     day = "Satyrday";
//     break;
// }
// console.log(day);

// 7.
// let arr = ["a", "ab", "abc"];
// let len = arr.map((el) => {
//   return el.length;
// });
// console.log(len);

// 8.
// let num = 15;
// if (num % 3 === 0 && num % 5 === 0) {
//   console.log("Divisible by both");
// } else {
//   console.log("Not Divisible by both");
// }

// 9.
// let square = (num) => {
//   return num * num;
// };
// console.log(square(5));

// 10;
// let obj = {
//   name: "John",
//   age: 25,
// };
// let formatted = function (obj) {
//   let { name, age } = obj;
//   let user = `${name} is ${age} years old`;
//   let result = JSON.stringify(user);
//   return result;
// };
// console.log(formatted(obj));

// 11.
// let sum = function (...nums) {
//   let result = 0;
//   for (let i = 0; i < nums.length; i++) {
//     result += nums[i];
//   }
//   return result;
// };
// console.log(sum(1, 2, 3, 4, 5));

// 12.
// let str = "Success";
// setTimeout(() => {
//   console.log(str);
// }, 3000);

// 13.
// let arr = [1, 3, 7, 2, 4];
// let max = arr[0];
// for (let i = 1; i < arr.length; i++) {
//   if (arr[i] > max) {
//     max = arr[i];
//   }
// }
// console.log(max);

// 14.
// let obj = {
//   name: "John",
//   age: 30,
// };
// let keys = function (obj) {
//   return Object.keys(obj);
// };
// console.log(keys(obj));

// 15.
// let str = "The quick brown fox";
// let wordSpace = function () {
//   let spli = str.split(" ");
//   return spli;
// };
// console.log(wordSpace());

// B. Part 2: Essay Questions (2.5 Grade):

// 1.
// forEach runs a function on every array item,
//  But you can't stop it early with a break, and it doesn't work well with wait.

// for...of is a normal loop, works on arrays, strings, and other iterables,
// And you can use a break or wait inside it normally.

// 2.
// Hoisting means variable and function declarations are moved to the top of their scope before the code runs.
// But only the declaration is hoisted, not the value.
// Example
// console.log(x); // undefined (not an error)
// var x = 5;

// let and const are hoisted too, but they aren't usable until the line where they're declared. That gap between the start of the scope and the actual declaration is called the TDZ.
//  Trying to use the variable in that zone throws an error instead of giving undefined.
// Example
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
// let y = 10;

// 3.
// ( == )compares values after converting them to the same type if they're
// ( === )compares both value and type, with no conversion.

// 4.
// try-catch lets you run code that might fail, and handle the error instead of crashing the program.
// With async/await, errors from a rejected promise don't throw immediately in a visible place .
// They need try-catch to be caught properly:

// 5.Asyncrons
// Type conversion is when you explicitly convert a value from one type to another.
// Coercion is when JavaScript implicitly converts a value's type on its own, usually during an operation.
