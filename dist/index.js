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
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const fs_1 = require("fs");
require('dotenv').config();
const models_1 = __importDefault(require("./models/models"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist', 'public')));
app.get('/', respondIndex);
app.get('/databaseJSON', respondDatabaseJSON);
app.post('/upload', respondUpload);
function respondIndex(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const indexPath = path_1.default.resolve(__dirname, 'public', 'index.html');
        console.log(indexPath);
        try {
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            yield fs_1.promises.access(indexPath, fs_1.promises.constants.F_OK);
            res.sendFile(indexPath);
        }
        catch (err) {
            res.status(500).send('Error accessing index.html');
        }
    });
}
function respondDatabaseJSON(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.setHeader('Content-Type', 'application/json');
            res.json(yield models_1.default.File.findAll({
                attributes: ['fileName', 'fileSize', 'fileHash'],
                order: [['createdAt', 'DESC']],
            }));
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
app.post('/hash', express_1.default.raw({ type: 'application/octet-stream', limit: '10mb' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = (0, crypto_1.createHash)('sha-1');
    hash.update(req.body);
    const hashResult = hash.digest('hex');
    res.json({ hash: hashResult });
}));
function respondUpload(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fileName, fileSize, fileHash } = req.body;
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
            res.status(201).json({
                message: 'File uploaded successfully',
                file: newFile,
            });
        }
        catch (err) {
            console.error('Error uploading file:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
models_1.default.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
