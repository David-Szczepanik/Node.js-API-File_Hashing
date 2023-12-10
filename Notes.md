npm init -y
npm i typescript @types/node ts-node ts-node-dev -D
npm i express dotenv
npm i sequelize mysql2
npm i sequelize-cli -D
npm i process

tsc --init
"outFile": "./build"
touch .gitignore .env

npx sequelize init
npm i --save-dev @types/express

npx sequelize-cli model:generate --name User --attributes fileName:string,fileSize:integer,fileHash:string

npm i uuid
npm i @types/uuid -D

---

After converting to js `=>` TypeError: Cannot read properties of undefined

