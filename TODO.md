## TODO
- [x] Express server
- [x] Calculate size
- [x] SHA-1 hash
- [x] backup to txt
- [x] backup to json
## Server
- [x] can't write into a file `=>` chmod a+rw backup.json, ls -l backup.json

---
  - ~~can't get right formatting - trailing comma~~
- [ ] separate into modules
```js
app.post('/', api.saveBackup)
```
---

- [x] handle big files
  - ~~can't upload bigger than 6 GB `=>` stream chunks~~
- ~~name: 'SequelizeDatabaseError', parent: Error: Out of range value for column 'fileSize' at row 1 `=>` int is too small~~

- [x] Node.js hosting Google Cloud
  - ~~Uncaught TypeError: Cannot read properties of undefined (reading 'digest')~~
  - [x] `=>` HTTPS certbot
  - [ ] Automate renewal
  - [ ] FTP Filezilla to Google Cloud => SSH
  
- [x] Rewrite in TypeScript

## Database
- [x] MySQL integration 
  - [x] Implement Sequelize
  - [ ] Move database to separate hosting
  - ~~TypeError: Cannot read properties of undefined (reading 'findAll')~~
  - [ ] user instead of root

---
## Front end
- [x] add progress bar
- [x] database in html
- [x] drag&drop multiple files

## Stable and resilient
- [ ] Custom Error class
- [ ] handle errors without crashing
- [x] pm2 start npm -- run start
- [ ] auto-catch `=>` eliminate try-catch
---
- [ ] ~~npx nodemon - restart with any change~~
---
