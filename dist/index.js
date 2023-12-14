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
const models_1 = __importDefault(require("./models/models"));
const path_1 = __importDefault(require("path"));
const CustomError_1 = __importDefault(require("./Utils/CustomError"));
const errorController_1 = require("./Controllers/errorController");
const api_1 = require("./api");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist', 'public')));
app.get('/', api_1.respondIndex);
app.get('/databaseJSON', api_1.respondDatabaseJSON);
app.post('/upload', api_1.respondUpload);
app.post('/hash', express_1.default.raw({ type: 'application/octet-stream', limit: '50mb' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = (0, crypto_1.createHash)('sha-1');
    hash.update(req.body);
    const hashResult = hash.digest('hex');
    res.json({ hash: hashResult });
}));
app.all('*', (req, res, next) => {
    const err = new CustomError_1.default(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err); // passing an argument to the next fn will trigger the global error handling middleware
    // It will skip all other middleware fns
});
//Global error middleware
app.use(errorController_1.handleErrorHTML);
// app.use(handleErrorJSON);
models_1.default.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
