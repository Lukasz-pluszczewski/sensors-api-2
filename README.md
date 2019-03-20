# Sensor api 2
Api for collecting and fetching humidity and temperature sensors data.

### Environment variables
- **PORT** (default: 8080)
- **DB_NAME** (default: 'chooseYourDbNameForThisBoilerplate', you can change the default in config.js)
- **DB_HOST** (default: 'localhost:27017')
- **SENSORS_HOST** (default: 'localhost:8081')
- **SENSORS_PASSWORD** - will be added to each requests as an authentication headers
- **ADMIN_PASSWORD** - password to access API (password must be then added to each request as a "authentication" header)

### Run development build
`npm run dev`

### Run production build
`npm run start`
