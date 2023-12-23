"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./models/models"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const CustomError_1 = __importDefault(require("./Utils/CustomError"));
const errorController_1 = require("./Controllers/errorController");
const api_1 = require("./api");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist', 'public')));
app.get('/', api_1.respondIndex);
app.get('/databaseJSON', api_1.respondDatabaseJSON);
app.post('/upload', api_1.respondUpload);
app.all('*', (req, res, next) => {
    const err = new CustomError_1.default(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err); // passing an argument to the next fn will trigger the global error handling middleware
    // It will skip all other middleware fns
});
//Global error middleware
// app.use(handleErrorHTML);
app.use(errorController_1.handleErrorJSON);
models_1.default.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
