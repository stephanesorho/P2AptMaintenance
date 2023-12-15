# Apartment Maintenance System Project

## Apartment Maintenance Node Express SqLite EJS

A simple full stack server side rendered app

## FrontEnd

/views/index.ejs

HTML + EJS + ES6 + Bootstrap

## BackEnd

Node + Express

### Routing

/routes/index.js

### DB Connector

/db/dbConnector_Mongo

## Database

MongoDB

## Usage

```
npm install
npm start
```

# Instructions to run the queries on DB

1. Download aptMaintenance.json file and query files

2. Import file using mongoimport
   mongoimport -h localhost:27017 -d aptMaintenance -c tenants --file aptMaintenance.json

3. Open new folder and run node prompt:
   npm init -y

If MongoDB is not installed, run:
npm install mongodb

4. Add query files to folder and run them using
   node query#.js
