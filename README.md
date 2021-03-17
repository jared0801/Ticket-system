# Ticket system / Bug Tracker

A ticketing system that can be used to track bugs, projects, and requests. Built by Jared Jacobson using Vue, MySQL, and Express.

## Project setup
```
npm install
```
Create a file in the project root directory called .env and enter the following information:
```
VUE_APP_API=
NODE_ENV=
SESS_SECRET=
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
FE_ORIGIN=
GMAIL_USER=
GMAIL_PW=
```

An example would be:
```
VUE_APP_API=http://localhost:5000/api
NODE_ENV=development
SESS_SECRET=secret
DB_HOST=localhost
DB_USER=root
DB_PASS=pass
DB_NAME=ticket-system
FE_ORIGIN=localhost:8080
GMAIL_USER=me@gmail.com
GMAIL_PW=password
```

### Compiles and hot-reloads client for development
```
npm run serve
```

### Starts and hot-reloads backend server for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Starts backend server for production
```
npm run start
```
