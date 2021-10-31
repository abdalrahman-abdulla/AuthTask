# AuthTask
project for auth task 
## Steps to Run this Project
- clone this repo
- run ```npm i``` 
- configure project with your mysql database in .env file 
- run ```npx prisma migrate dev --name init``` to migrate tables
- now run project ```npm run start```

## Api For This Project 
- ```/register``` to register new user
- ```/login``` to login user
