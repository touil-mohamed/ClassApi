const studentService = require("../services/student.services");
const url = require("url");
const { parse } = require("querystring");
// Fonction pour analyser le corps JSON de la requête
const parseJsonBody = (req, callback) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const json = JSON.parse(body);
      callback(null, json);
    } catch (error) {
      callback(error, null);
    }
  });
};

async function getAllStudent(req, res) {
  try {
    const allStudent = await studentService.getAllStudent();

    res.writeHead(200, { "Content-Type": "application/json" });

    // Envoyer le corps de la réponse
    res.end(
      JSON.stringify({
        students: allStudent,
      })
    );
  } catch (error) {}
}

async function getStudentById(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.pathname.split("/").pop(); // Récupère le dernier segment de l'URL

    const studentById = await studentService.getStudentById(id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ student: studentById }));
  } catch (error) {
    // Ajoutez un log pour voir l'erreur
    console.error("Error in getStudentById:", error);

    // Assurez-vous que la réponse est envoyée même en cas d'erreur
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
}

async function createStudent(req, res) {
  try {
    parseJsonBody(req, async (error, body) => {
      if (error) {
        console.error("Error parsing JSON:", error);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
        return;
      }

      // Assurez-vous que le corps est bien attaché à la requête
      req.body = body;

      // Continuez avec la création de l'étudiant
      const newStudentData = req.body;
      const newStudent = await studentService.createStudent(newStudentData);

      // Réponse au client
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Student created successfully",
          student: newStudent,
        })
      );
    });
  } catch (error) {
    console.log("error : ", error);
  }
}

async function updateStudent(req, res) {
  const id = req.url.split("/").pop();

  // Récupérer le corps de la requête
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    // Analyser le corps de la requête pour obtenir les données JSON
    const updateData = JSON.parse(body);

    try {
      // Appeler votre service pour mettre à jour l'étudiant avec l'ID et les données de mise à jour
      const updateStudent = await studentService.updateStudent(id, updateData);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Student updated successfully",
          student: updateStudent,
        })
      );
    } catch (error) {
      if (error.message === "Student not found") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Student not found",
          })
        );
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Internal Server Error",
            message: error.message,
          })
        );
      }
    }
  });
}

module.exports = {
  getAllStudent,
  getStudentById,
  createStudent,
  updateStudent,
};
