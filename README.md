# Apartment Maintenance System Project

## Database (MongoDB)

aptMaintenance.json

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
