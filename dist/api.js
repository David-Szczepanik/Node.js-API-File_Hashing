"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondUpload = exports.respondDatabaseJSON = exports.respondIndex = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const asyncErrorHandler_1 = require("./Utils/asyncErrorHandler");
const CustomError_1 = __importDefault(require("./Utils/CustomError"));
const models_1 = __importDefault(require("./models/models"));
const upload_1 = require("./upload");
exports.respondIndex = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const indexPath = path_1.default.resolve(__dirname, 'public', 'index.html');
    console.log(indexPath);
    debugger;
    try { //if file exists send it
        yield fs_1.promises.access(indexPath, fs_1.promises.constants.F_OK);
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.sendFile(indexPath);
    }
    catch (err) { // otherwise create an error and pass it to middleware
        const error = new CustomError_1.default('Index.html not found', 404);
        next(error);
    }
}));
exports.respondDatabaseJSON = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.json(yield models_1.default.File.findAll({
            attributes: ['fileName', 'fileSize', 'fileHash'],
            order: [['createdAt', 'DESC']],
        }));
    }
    catch (err) {
        const error = new CustomError_1.default('Database unreachable', 550);
        next(error);
    }
}));
exports.respondUpload = (0, asyncErrorHandler_1.asyncErrorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield (0, upload_1.hashFile)(req, next);
        const newFiles = [];
        for (const { fileSize, fileName, fileHash } of files) {
            // => DB
            const newFile = yield models_1.default.File.create({
                fileName,
                fileSize,
                fileHash,
            });
            const backupJsonPath = 'backup.json';
            const backupTxtPath = 'backup.txt';
            // => JSON
            let existingContent;
            try {
                const existingJsonData = yield fs_1.promises.readFile(backupJsonPath, 'utf-8');
                existingContent = JSON.parse(existingJsonData);
            }
            catch (readError) {
                // Create JSON if it doesn't exist
                existingContent = [];
            }
            existingContent.push(newFile);
            yield fs_1.promises.writeFile(backupJsonPath, JSON.stringify(existingContent, null, 2));
            // => TXT
            const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const currentTime = new Date().toLocaleTimeString('cs-CZ'); // HH:MM:SS
            const textContent = `File Name: ${fileName}\nFile Size: ${fileSize} bytes\nSHA-1 Hash: ${fileHash}\nDate: ${currentDate}-${currentTime}\n\n`;
            yield fs_1.promises.appendFile(backupTxtPath, textContent);
            console.log('File information saved to backup.json and backup.txt');
            newFiles.push(newFile);
        }
        res.status(201).json({
            status: 'Success',
            message: 'Files uploaded successfully',
            files: newFiles,
        });
    }
    catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
