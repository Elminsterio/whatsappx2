"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OnMailApp_1 = require("./OnMailApp");
try {
    new OnMailApp_1.OnMailApp().start();
}
catch (e) {
    console.log(e);
    process.exit(1);
}
process.on("uncaughtException", (err) => {
    console.log("uncaughtException", err);
    process.exit(1);
});
