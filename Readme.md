--> command to install prisma 
npm i typescript ts-node @types/node prisma --save-dev

-->create tsconfig.json file 
{
    "compilerOptions": {
        "sourceMap": true,
        "outDir": "dist",
        "lib": ["esnext"],
        "esModuleInterop": true
    }
}

--> commanr to initialize prisma 
npx prisma init

--> for the format anr errors of schema use 
npm prisma format 

--> comand to execute prisma studio
npx prisma studio

------------------------>>Migration process to tell db how data look like 
-->> install prisma client 
npm i @prisma/client --save 

--> to reset the migration 
 npx prisma migrate reset 

-->> code to run the migration 
npx prisma migrate dev --name init 

-------------------------->> CURD / REST 
GET product/:id - get a product by a given ID 
GET product - get all products (from authenticated user )
POST product - create a new product
PUT product/:id - update/replace a product that matches a given ID
DELETE product/:id - delete a product by a given id  

--------------------------->> Midleware for relational database 
app.use((req,res,next)=>{
    res.secret_vatialble="this variable can be use in etire app"
    next();
})

--> to top api call or send back data it will not execute any api 
app.use((req,res,next)=>{
    res.status(401)
    res.send('Nodpe')
})

--------------------------->> For mongodb 
1) import csv in mongodb in structure you wnat your schema 

-->> run this command to create your schema in prisma.schema file 
npx prisma db pull

2) after changing in prisma use thi command to execute schmea 
-->> command to execute schema 
npx prisma generate

--------------------------->> JWT Tokken
-->> install jwt , dotev, and bcrpt dependecies 
npm i jsonwebtoken bcrypt dotenv 

---------------------------->> Validation for accessign other resource apis
--> install validation library
npm i express-validator --save