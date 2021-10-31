# AuthTask
project for auth task 
## Steps to Run this project
- clone this repo
- run ```npm i``` 
- configure project with your mysql database in .env file 
- run ```npx prisma migrate dev --name init ``` to migrate table
- now run Project ```npm run start```

## Api For This project 
- ```/register``` to register new user
- ```/login``` to login user
