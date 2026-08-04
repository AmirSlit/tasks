const path = require("node:path");
const fs = require("node:fs");
const { EventEmitter } = require("node:events");
const customEvent = new EventEmitter();
const os = require("node:os");
const { createGzip } = require("zlib");
const http = require("node:http");
// 1;
// function logFileLocation() {
//   console.log({
//     File: path.resolve(__filename),
//     Dir: path.dirname(__filename),
//   });
// }
// logFileLocation();

// // 2.
// function fileLocation(filePath) {
//   return path.basename(filePath);
// }
// console.log(fileLocation("/user/files/report.pdf"));

// 3.
// function fileLocation(obj) {
//   return path.format({
//     dir: obj.dir,
//     name: obj.name,
//     ext: obj.ext,
//   });
// }
// console.log(fileLocation({ dir: "/folder", name: "app", ext: ".js" }));

// 4.
// function fileLocation(filePath) {
//   return path.extname(filePath);
// }
// console.log(fileLocation("/docs/readme.md"));

// 5.
// function fileLocation(filePath) {
//   const obj = path.parse(filePath);
//   return {
//     Name: obj.name,
//     Ext: obj.ext,
//   };
// }
// console.log(fileLocation("/home/app/main.js"));

// 6;
// function isAbsolute(filePath) {
//   return path.isAbsolute(filePath);
// }
// console.log(isAbsolute("/home/user/file.txt"));

// 7.
// function fileLocation(...input) {
//   return path.join(...input);
// }
// console.log(fileLocation("src", "components", "App.js"));

// 8;
// function filLocation(filePath) {
//   return path.resolve(filePath);
// }
// console.log(filLocation("./index.js"));

// 9;
// function fileLocation(filePath_1, filePath_2) {
//   return path.join(filePath_1, filePath_2);
// }
// console.log(fileLocation("/folder1", "folder2/file.txt"));

// 10;
// async function fileDelete(filePath) {
//   await fs.unlink(filePath);
//   const baseName = path.basename(filePath);
//   return `The ${baseName} is deleted.`;
// }

// fileDelete("/path/to/file.txt")
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err)); // طبعا هيباصي إيررور عشان الملف مش موجود

// 11.
// function creatFolder() {
//   try {
//     const created = fs.mkdirSync("Creat_folder", { recursive: true });
//     return "Success";
//   } catch (error) {
//     return `Error: ${error.message}`;
//   }
// }
// console.log(creatFolder());

// 12.
// customEvent.on("start", () => {
//   console.log("Welcome event triggered!");
// });
// customEvent.emit("start");

// 13.
// customEvent.on("login", (name) => {
//   console.log(`User logged in: ${name}`);
// });
// customEvent.emit("login", "Ahmed");

// 14.
// function read(filePath) {
//   const readfile = fs.readFileSync(filePath, { encoding: "utf-8" });
//   return readfile;
// }
// console.log(read("Task_2\\notes.txt"));

// 15.
async function write(filePath, content) {
  await fs.writeFile(filePath, content, { encoding: "utf-8" });
  return `Async save success`;
}

async function main() {
  const filePath = path.resolve("notes.txt");
  try {
    const result = await write(filePath, "Async save amir slit");
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
}

main();

// 16;
// function check(filePath) {
//   return fs.existsSync(filePath);
// }
// console.log(check("Task_2\\notes.txt"));

// 17;
// function systemInfo() {
//   return {
//     Platform: os.platform(),
//     Arch: os.arch(),
//   };
// }

// console.log(systemInfo()); // ماخدتهاش بس بحثت عنها وعرفتها

// 18;
// const readStream = fs.createReadStream("./big.txt", {
//   encoding: "utf-8",
// });
// readStream.on("data", (chunk) => {
//   console.log(chunk);
// });

// 19;
// const readStream = fs.createReadStream("./source.txt", { encoding: "utf-8" });
// const writeStream = fs.createWriteStream("./dest.txt", { encoding: "utf-8" });
// readStream.on("data", (chunk) => {
//   writeStream.write(chunk);
// });
// readStream.on("end", () => {
//   console.log("File copied using streams");
// });
// readStream.on("error", (error) => {
//   console.log(error);
// });

// 20;
// const readStream = fs.createReadStream("./data.txt");
// const writeStream = fs.createWriteStream("./data.txt.gz");

// readStream.pipe(createGzip()).pipe(writeStream);
// readStream.on("end", () => {
//   console.log("File copied using Pipe");
// });
// readStream.on("error", (error) => {
//   console.log(error.message);
// });

// Part 2

// 1.
// Add a new User
const server = http.createServer((req, res) => {
  const usersPath = path.resolve("D:\\Assigments\\users.json");
  const { url, method } = req;
  if (url == "/user" && method == "POST") {
    let bodyData = "";
    req.on("data", (chunk) => {
      bodyData += chunk;
    });
    req.on("end", () => {
      bodyData = JSON.parse(bodyData);
      let usersData = fs.readFileSync(usersPath, { encoding: "utf-8" });
      usersData = JSON.parse(usersData);

      const user = usersData.find((user) => {
        return user.email == bodyData.email;
      });
      if (user) {
        res.writeHead(409);
        res.end(JSON.stringify({ message: "Email already Exists" }));
      } else {
        usersData.push(bodyData);
        fs.writeFileSync(usersPath, JSON.stringify(usersData));
        res.end("User Add Sucessfully");
      }
    });
    // ==============================================
    // 2
  } else if (url.startsWith("/user/") && method == "PATCH") {
    const id = url.split("/")[2];
    let bodyData = "";
    req.on("data", (chunk) => {
      bodyData += chunk;
    });
    req.on("end", () => {
      bodyData = JSON.parse(bodyData);
      let usersData = fs.readFileSync(usersPath, { encoding: "utf-8" });
      usersData = JSON.parse(usersData);
      const userIndex = usersData.findIndex((user) => {
        return user.id == id;
      });
      if (userIndex == -1) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "User ID not found." }));
      } else {
        usersData[userIndex] = { ...usersData[userIndex], ...bodyData };
        fs.writeFileSync(usersPath, JSON.stringify(usersData));
        res.end(JSON.stringify({ message: "User age updated successfully." }));
      }
    });
    // ==================================
    // .3
  } else if (url.startsWith("/user/") && method == "DELETE") {
    const id = url.split("/")[2];
    let usersData = fs.readFileSync(usersPath, { encoding: "utf-8" });
    usersData = JSON.parse(usersData);
    const userIndex = usersData.findIndex((user) => {
      return user.id == id;
    });
    if (userIndex == -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "User ID not found." }));
    } else {
      usersData.splice(userIndex, 1);
      fs.writeFileSync(usersPath, JSON.stringify(usersData));
      res.end(JSON.stringify({ meesage: "User Delete Successfully" }));
    }
    // ==============================
    // 4.
  } else if (url == "/user" && method == "GET") {
    let usersData = fs.readFileSync(usersPath, { encoding: "utf-8" });
    usersData = JSON.parse(usersData);
    res.end(JSON.stringify(usersData));
    // =========================
    // 5.
  } else if (url.startsWith("/user/") && method == "GET") {
    const id = url.split("/")[2];
    let usersData = fs.readFileSync(usersPath, { encoding: "utf-8" });
    usersData = JSON.parse(usersData);
    const userId = usersData.findIndex((user) => {
      return user.id == id;
    });
    if (userId == -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "User ID not found." }));
    } else {
      res.end(JSON.stringify(usersData[userId]));
    }
  } else {
    res.writeHead(404);
    res.end("Invalid Routing");
  }
});

server.listen(3000, () => {
  console.log("Server is Running port 3000");
});
server.on("error", (error) => {
  console.log(error);
});
