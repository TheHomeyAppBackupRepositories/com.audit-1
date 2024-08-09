"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDetail = exports.deleteMessage = exports.getFiles = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
async function getFiles() {
    const directory = '../userdata';
    let files = [];
    let details = {};
    let filepath = '';
    let stats = '';
    let type = '';
    for (const file of await promises_1.default.readdir(directory)) {
        type = file.substring(0, file.indexOf("."));
        if (type == 'message' || type == 'detail') {
            try {
                filepath = node_path_1.default.join(directory, file);
                stats = await promises_1.default.stat(filepath);
                details = {
                    location: node_path_1.default.join(directory, file),
                    name: file,
                    type: type,
                    date: file.substring(file.indexOf('.') + 1, file.length - 4),
                    size: stats.size
                };
            }
            catch (e) {
                console.log(e);
            }
            // console.log(details)
            files.push(details);
        }
    }
    return files;
}
exports.getFiles = getFiles;
// export async function deleteFiles() {
//     const directory = '../userdata';
//     for (const file of await fs.readdir(directory)) {
//         await fs.unlink(path.join(directory, file));
//     }
// }
async function deleteMessage() {
    const directory = '../userdata';
    let type = '';
    for (const file of await promises_1.default.readdir(directory)) {
        type = file.substring(0, file.indexOf("."));
        if (type == 'message') {
            await promises_1.default.unlink(node_path_1.default.join(directory, file));
        }
    }
}
exports.deleteMessage = deleteMessage;
async function deleteDetail() {
    const directory = '../userdata';
    let type = '';
    for (const file of await promises_1.default.readdir(directory)) {
        type = file.substring(0, file.indexOf("."));
        if (type == 'detail') {
            await promises_1.default.unlink(node_path_1.default.join(directory, file));
        }
    }
}
exports.deleteDetail = deleteDetail;
// const fs = require("fs");
// const path = require("path");
// export async function getFiles()  {
//     const testFolder = '../userdata'
//     let files = ''
//     fs.readdirSync(testFolder).forEach(file => {
//        files += ' ' + file
//       });
//     return files;
// }
