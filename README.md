# api-band-manager

# Getting started
Step by step to running this project
- Clone this repo
- `npm install` to install all required dependencies
- Import the database `band_mgr.sql` file to pg_admin or navicat or etc. The database using Postgresql
- `npm run dev` to start the local server
- `npm test` to test the band endpoint

The project running well in:
- Node: v16.15.1
- NPM: 9.6.7
- PostgreSQL 14.3

# API Documentation
this config site for API documentation is http://{host}:{port}/api-docs/

# Flow API
- Create a band
- Create a player
- Create a member using an ID from the band and an ID from the player
- Possible to get data from any endpoint with the method GET  

# Flow Database
![Diagram 1](https://github.com/dwikiramadhan/api-band-manager/assets/10826698/215bd2eb-1870-4c99-8937-5538391de500)

