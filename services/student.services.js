const dataStudent = "data/students.csv";

const csv = require("csv-parser");
const fs = require("fs");

async function getAllStudent() {
  return new Promise((resolve, reject) => {
    const students = [];
    fs.createReadStream(dataStudent)
      .pipe(csv())
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", () => {
        resolve(students);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function getStudentById(id) {
  return new Promise((resolve, reject) => {
    const targetStudent = [];
    fs.createReadStream(dataStudent)
      .pipe(csv())
      .on("data", (row) => {
        if (row.id == id) {
          targetStudent.push(row);
        }
      })
      .on("end", () => {
        if (targetStudent.length > 0) {
          resolve(targetStudent[0]);
        } else {
          reject(new Error("Student not found"));
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function createStudent(newStudent) {
  return new Promise(async (resolve, reject) => {
    try {
      const allStudent = await getAllStudent();

      const newId = allStudent.length + 1;

      createSt = { id: newId, ...newStudent };
      allStudent.push(createSt);

      const writeFile = fs.createWriteStream(dataStudent, { flags: "a" });
      writeFile.write(
        `${createSt.id},${createSt.lastname},${createSt.firstname},${createSt.email},${createSt.phone},${createSt.address},${createSt.zip},${createSt.city},${createSt.class} \n`
      );

      writeFile.end();
      resolve(createSt);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateStudent(id, updateData) {
  return new Promise(async (resolve, reject) => {
    try {
      const allStudent = await getAllStudent();

      const indexUpdate = allStudent.findIndex((classRow) => classRow.id == id);

      if (indexUpdate !== -1) {
        // Mettre à jour uniquement l'étudiant spécifique
        Object.assign(allStudent[indexUpdate], updateData);

        // Réécrire toutes les données dans le fichier
        const writeFile = fs.createWriteStream(dataStudent);

        writeFile.write(
          "id,lastname,firstname,email,phone,address,zip,city,class \n"
        );

        allStudent.forEach((student) => {
          writeFile.write(
            `${student.id},${student.lastname},${student.firstname},${student.email},${student.phone},${student.address},${student.zip},${student.city},${student.class} \n`
          );
        });

        writeFile.end();
        resolve(allStudent[indexUpdate]);
      } else {
        reject(new Error("Student not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllStudent,
  getStudentById,
  createStudent,
  updateStudent,
};
