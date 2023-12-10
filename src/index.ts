import express, { Request, Response } from 'express';
import {createHash} from "crypto";
import {promises as fsPromises} from "fs";
require('dotenv').config();
import db from './models/models';
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));

app.get('/', respondIndex);
app.get('/databaseJSON', respondDatabaseJSON);
app.post('/upload', respondUpload);

async function respondIndex(req: Request, res: Response) {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');
    console.log(indexPath);
    try {
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        await fsPromises.access(indexPath, fsPromises.constants.F_OK);
        res.sendFile(indexPath);
    } catch (err) {
        res.status(500).send('Error accessing index.html');
    }
}

async function respondDatabaseJSON(req: Request, res: Response) {
    try {
        res.setHeader('Content-Type', 'application/json');

        res.json(await db.File.findAll({
            attributes: ['fileName', 'fileSize', 'fileHash'],
            order: [['createdAt', 'DESC']],
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

app.post( '/hash',
    express.raw({ type: 'application/octet-stream', limit: '10mb' }),
    async (req: Request<{}, {}, Buffer>, res: Response) => {
        const hash = createHash('sha-1');
        hash.update(req.body);

        const hashResult = hash.digest('hex');
        res.json({ hash: hashResult });
    }
);

async function respondUpload(req: Request, res: Response) {
    try {
        const { fileName, fileSize, fileHash } = req.body;

        // => DB
        const newFile = await db.File.create({
            fileName,
            fileSize,
            fileHash,
        });

        const backupJsonPath = 'backup.json';
        const backupTxtPath = 'backup.txt';

        // => JSON
        let existingContent;
        try {
            const existingJsonData = await fsPromises.readFile(backupJsonPath, 'utf-8');
            existingContent = JSON.parse(existingJsonData);
        } catch (readError) {
            // Create JSON if it doesn't exist
            existingContent = [];
        }
        existingContent.push(newFile);

        await fsPromises.writeFile(backupJsonPath, JSON.stringify(existingContent, null, 2));

        // => TXT
        const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const currentTime = new Date().toLocaleTimeString('cs-CZ'); // HH:MM:SS
        const textContent = `File Name: ${fileName}\nFile Size: ${fileSize} bytes\nSHA-1 Hash: ${fileHash}\nDate: ${currentDate}-${currentTime}\n\n`;
        await fsPromises.appendFile(backupTxtPath, textContent);

        console.log('File information saved to backup.json and backup.txt');
        res.status(201).json({
            message: 'File uploaded successfully',
            file: newFile,
        });
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

db.sequelize.sync().then(() => { //{force:true} DROP & RECREATE
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})

