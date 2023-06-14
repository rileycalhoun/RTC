// Get schema, url and port
const { schema, url, address, port } = require('../../configs/config.json').client;

// Define the express app
const express = require('express');
const app = express();

// Define the web server
const http = require('http');
const webServer = http.createServer(app);

// Create the router and read routes from the routes folder
const fs = require('fs');
const router = express.Router();
const routes = {};
fs.readdirSync(__dirname + '/routes').forEach(file => {
    // Get the route file
    let route = require(__dirname + '/routes/' + file);
    
    // Get the route properties
    let path = route.path;
    let type = route.type;
    let aliases = route.aliases;
    let call = route.call;

    // Add the route to the router after checking for errors in the route file
    if (path) {
        if(call) {
            if(type) {
                if (aliases) {
                    aliases.forEach(alias => {
                        routes[alias] = route;
                    });
                }

                routes[path] = route;
            } else {
                console.error('Route ' + file + ' does not have a type');
            }
        } else {
            // TODO: Add a default call
            console.error('Route ' + file + ' does not have a call');
        }
    } else {
        // TODO: Add a default path
        console.error('Route ' + file + ' does not have a path');
    }
});

((routes) => { 

    for (let route in routes) {
        // Get the route properties
        let path = "/" + route;
        let type = routes[route].type;
        let call = routes[route].call;

        console.info("Registering route " + type + " " + path);

        // Add the route to the router
        router[type.toLowerCase()](path, call);
    }

})(routes);

app.use(express.static(__dirname + "/public", {
    index: false,
    immutable: false,
    cacheControl: true,
    maxAge: "30d"
}));

app.use("/", router);
webServer.listen(port, address, () => {
    console.info(`Listening on ${address}:${port}`);
    console.log(`Access on ${schema}://${url}`);
})
