import express, {NextFunction, Request, Response} from 'express';
import db from './models/models';
import path from "path";
import cors from 'cors';
import morgan from 'morgan';
import CustomError from "./Utils/CustomError";
import {handleErrorJSON} from './Controllers/errorController';
import {respondIndex, respondDatabaseJSON, respondUpload} from './api';

const app = express();

const port = process.env.PORT || 3000;
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

app.get('/', respondIndex);
app.get('/databaseJSON', respondDatabaseJSON);
app.post('/upload', respondUpload);


app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err); // passing an argument to the next fn will trigger the global error handling middleware
    // It will skip all other middleware fns
});

//Global error middleware
// app.use(handleErrorHTML);
app.use(handleErrorJSON);

db.sequelize.sync().then(() => { //{force:true} DROP & RECREATE
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})
