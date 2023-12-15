// const express = require("express");
// const app = express();
// const basicAuth = require("basic-auth");
const http = require("http");
const url = require("url");
const cors = require("cors"); // Importez le module cors

const classRoute = require("./routes/class.routes");
const studentRoute = require("./routes/student.routes");

// const authenticate = (req, res, next) => {
//   const user = basicAuth(req);
//   if (!user || !user.name || !user.pass) {
//     res.status(401).send("Authentification required");
//     return;
//   }

//   const validUsername = "Moha";
//   const validPassword = "password123";

//   if (user.name === validUsername && user.pass === validPassword) {
//     next();
//   } else {
//     res.status(401).send("Invalid credentials");
//   }
// };

// app.use(authenticate);

// app.use(express.static("public"));
// app.use(express.json()); //Recuperer les datas au format json
// app.use(express.urlencoded({ extended: true }));

// app.use("/Class", classRoute.routes);
// app.use("/Student", studentRoute.routes);

/* Telling the server to listen on port 3000. */
// app.listen(3000, () => {
//   console.log("http://localhost:3000");
// });

// Create a server
const server = http.createServer((req, res) => {
  // Utilisez cors comme middleware
  cors()(req, res, () => {
    const parsedUrl = url.parse(req.url, true);

    // Routing basé sur le chemin de l'URL
    if (parsedUrl.pathname.startsWith("/Class")) {
      classRoute.handleRoutes(req, res);
    } else if (parsedUrl.pathname.startsWith("/Student")) {
      studentRoute.handleRoutes(req, res);
    } else {
      // Gérez 404 - Non trouvé
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  });
});

// Listen on port 3000
server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
