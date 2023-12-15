const studentController = require("../controller/student.controller");

function handleRoutes(req, res) {
  if (req.method === "GET" && req.url === "/Student") {
    studentController.getAllStudent(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/Student/")) {
    // Extract the student ID from the URL
    const id = req.url.split("/").pop();
    studentController.getStudentById(req, res, id);
  } else if (req.method === "POST" && req.url.startsWith("/Student/create")) {
    studentController.createStudent(req, res);
  } else if (
    (req.method === "PATCH" || req.method === "PUT") &&
    req.url.startsWith("/Student/update/")
  ) {
    // Extract the student ID from the URL
    const id = req.url.split("/").pop();
    studentController.updateStudent(req, res, id);
  } else {
    // Handle 404 - Not Found
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
}

module.exports = {
  handleRoutes,
};
