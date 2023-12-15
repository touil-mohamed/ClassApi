const csv = require("csv-parser");
const fs = require("fs");
const { resolve } = require("path");

const dataClass = "data/class.csv";

async function getAllClass() {
  return new Promise((resolve, reject) => {
    const classes = [];
    fs.createReadStream(dataClass)
      .pipe(csv())
      .on("data", (row) => {
        classes.push(row);
      })
      .on("end", () => {
        resolve(classes);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
async function getClassById(id) {
  return new Promise((resolve, reject) => {
    const targetClasse = [];
    fs.createReadStream(dataClass)
      .pipe(csv())
      .on("data", (row) => {
        if (row.id == id) {
          targetClasse.push(row);
        }
      })
      .on("end", () => {
        if (targetClasse.length > 0) {
          resolve(targetClasse[0]);
        } else {
          reject(new Error("Class not found"));
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

async function createClass(newClass) {
  return new Promise(async (resolve, reject) => {
    try {
      const allClass = await getAllClass();

      const newId = allClass.length + 1;

      createCl = { id: newId, ...newClass };
      allClass.push(createCl);

      const writeFile = fs.createWriteStream(dataClass, { flags: "a" });
      writeFile.write(`${createCl.id},${createCl.name},${createCl.level} \n`);

      writeFile.end();
      resolve(createCl);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateClass(id, updateData) {
  return new Promise(async (resolve, reject) => {
    try {
      const allClass = await getAllClass();

      const indexUpdate = allClass.findIndex((classRow) => classRow.id == id);

      if (indexUpdate !== -1) {
        Object.assign(allClass[indexUpdate], updateData);

        const writeFile = fs.createWriteStream(dataClass);

        writeFile.write("id,name,level \n"); // En-tête

        allClass.forEach((classRow) => {
          writeFile.write(
            `${classRow.id},${classRow.name},${classRow.level} \n`
          );
        });
        writeFile.end();
        resolve(allClass[indexUpdate]);
      } else {
        reject(new Error("Class not found"));
      }
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllClass,
  getClassById,
  createClass,
  updateClass,
};
