const classServices = require("../services/class.services");

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

async function getAllClass(req, res) {
  try {
    const allClass = await classServices.getAllClass();
    // Définir le statut et les en-têtes de la réponse
    res.writeHead(200, { "Content-Type": "application/json" });

    // Envoyer le corps de la réponse
    res.end(
      JSON.stringify({
        classes: allClass,
      })
    );
  } catch (error) {
    console.error("Error in getAllClass:", error);
    // res.status(500).send({ error: "Internal Server Error" });
  }
}

async function getClassById(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.pathname.split("/").pop(); // Récupère le dernier segment de l'URL

    const studentById = await studentService.getStudentById(id);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ student: studentById }));
  } catch (error) {
    console.error("Error in getStudentById:", error);

    // Assurez-vous que la réponse est envoyée même en cas d'erreur
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
}

async function createClass(req, res) {
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
      const newClassData = req.body;
      const newClass = await classServices.createClass(newClassData);

      // Réponse au client
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Class created successfully",
          student: newClass,
        })
      );
    });
  } catch (error) {
    res.status(500).send({
      details: error.message, // Ajout du message d'erreur dans la réponse
    });
  }
}

async function updateClass(req, res) {
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
      const updateClass = await classServices.updateClass(id, updateData);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Class updated successfully",
          student: updateClass,
        })
      );
    } catch (error) {
      if (error.message === "Class not found") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Class not found",
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
  getAllClass,
  getClassById,
  createClass,
  updateClass,
};
