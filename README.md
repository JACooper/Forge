Forge client
============

Server repository for Forge, a task tracking app that helps you prioritize on the things you can do right now. Most solutions, be they simple todo lists or complex kanban workflows, operate under the principle of the user conforming to the application model. Forge takes a different approach: tasks are assigned difficulties in three categories (time, effort, and focus), and are presented to the user based on what they specify they're prepared to tackle at that point in their day.


Stack
-----

The Forge server is built using Node, Express, Redis, and MongoDB, with Mongoose as the ODM. Familiarity with ES6 syntax is strongly recommended to make sense of and edits to the source.


Running Locally
---------------

Make sure you have [Node](https://nodejs.org) installed, and [Redis](https://redis.io/) and [MongoDB](https://www.mongodb.com/) installed and running. To start, navigate to the project directory and run

```
npm install
npm start
```

This will start the server listening for connections. To access the app, go to localhost:3000 on the webpage of your choice. To run with the Chrome debugger attached, run

```
npm run start-debug
```

This will print a url you can use to access the debugger. While developing server features, it is recommended to run through nodemon to automatically restart when files are saved. To do so, run

```
npm run nodemon
```


License
-------

Forge is under the MIT License. Details can be found in the repo.