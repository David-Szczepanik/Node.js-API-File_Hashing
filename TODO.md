## TODO
- [x] Express server
- [x] Calculate size
- [x] SHA-1 hash
- [x] backup to txt =>
- [x] backup to json
## Server
- [x] can't write into a file `=>` chmod a+rw backup.json, ls -l backup.json
- [x] Debugger: --inspect=0.0.0.0:9229
- [x] Create Firewall Rule for tcp:2992 `=>` chrome://inspect
---
  - ~~can't get right formatting - trailing comma~~
- [x] separate into modules
- [ ] unsecure connection when HTTP `=>` .htaccess automatically redirect to HTTPS
---

- [x] handle big files `=>` stream chunks
  - ~~can't upload bigger than 6 GB~~
- ~~name: 'SequelizeDatabaseError', parent: Error: Out of range value for column 'fileSize' at row 1~~ `=>` int is too small

- [x] Node.js hosting Google Cloud
  - ~~Uncaught TypeError: Cannot read properties of undefined (reading 'digest')~~
  - [x] `=>` HTTPS certbot
  - [ ] Automate renewal
  - [ ] FTP Filezilla to Google Cloud => SSH
  
- [x] Rewrite in TypeScript

## Database
- [x] MySQL integration 
  - [x] Implement Sequelize
  - [x] Move database to separate hosting PlanetScale
  - ~~TypeError: Cannot read properties of undefined (reading 'findAll')~~
  - [ ] Validation for example maxLength for fileName + send error to front end

---
## Front end
- [x] add progress bar
- [x] database in html
- [x] drag&drop multiple files
- [x] add progress percentage

## Error class
- [x] Custom Error class
- Operational vs Programmer errors
- [ ] show user only operational errors
---
- [x] pm2 start npm -- run start `=>` autostart when server restarts
---
- [ ] auto-catch for errors `=>` how to send custom error
- [ ] ~~npx nodemon - restart with any change~~
---

https://node.green/