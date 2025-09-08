import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const tareas = [];

// Crear una tarea
app.post("/tareas", (req, res) => {
  const { nombre, completada } = req.body;

  if (!nombre || typeof completada !== "boolean") {
    return res.status(400).json({ error: "Faltan datos o tipo incorrecto." });
  }

  const existe = tareas.find((t) => t.nombre === nombre);
  if (existe) {
    return res.status(400).json({ error: "Ya existe una tarea con ese nombre." });
  }

  const tarea = { nombre, completada };
  tareas.push(tarea);

  res.json(tarea);
});

// Consultar todas las tareas o filtradas
app.get("/tareas", (req, res) => {
  const { completada } = req.query;

  let resultado = tareas;

  if (completada === "true") {
    resultado = tareas.filter((t) => t.completada === true);
  } else if (completada === "false") {
    resultado = tareas.filter((t) => t.completada === false);
  }

  res.json(resultado);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});