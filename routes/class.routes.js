const classController = require("../controller/class.controller");

function handleRoutes(req, res) {
  try {
    if (req.method === "GET" && req.url === "/Class") {
      classController.getAllClass(req, res);
    } else if (req.method === "GET" && req.url.startsWith("/Class/")) {
      // Extract the class ID from the URL
      const id = req.url.split("/").pop();
      classController.getClassById(req, res, id);
    } else if (req.method === "POST" && req.url === "/Class/create") {
      classController.createClass(req, res);
    } else if (
      (req.method === "PATCH" || req.method === "PUT") &&
      req.url.startsWith("/Class/update/")
    ) {
      // Extract the class ID from the URL
      const id = req.url.split("/").pop();
      classController.updateClass(req, res, id);
    } else {
      // Handle 404 - Not Found
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } catch (error) {
    console.error("error : ", error);
  }
}

module.exports = {
  handleRoutes,
};
