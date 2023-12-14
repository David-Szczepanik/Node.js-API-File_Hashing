import express, {NextFunction, Request, Response} from 'express';
import {createHash} from "crypto";
import db from './models/models';
import path from "path";

import CustomError from "./Utils/CustomError";
import {handleErrorHTML} from './Controllers/errorController';
import {respondIndex, respondDatabaseJSON, respondUpload} from './api';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

app.get('/', respondIndex);
app.get('/databaseJSON', respondDatabaseJSON);
app.post('/upload', respondUpload);

app.post( '/hash',
    express.raw({ type: 'application/octet-stream', limit: '50mb' }),
    async (req: Request<{}, {}, Buffer>, res: Response) => {
        const hash = createHash('sha-1');
        hash.update(req.body);

        const hashResult = hash.digest('hex');
        res.json({ hash: hashResult });
    }
);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new CustomError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err); // passing an argument to the next fn will trigger the global error handling middleware
    // It will skip all other middleware fns
});

//Global error middleware
app.use(handleErrorHTML);
// app.use(handleErrorJSON);

db.sequelize.sync().then(() => { //{force:true} DROP & RECREATE
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})
