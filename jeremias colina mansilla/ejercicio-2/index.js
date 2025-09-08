import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const alumnos = [];

// Función para calcular promedio
function calcularPromedio(notas) {
  const suma = notas.reduce((acc, n) => acc + n, 0);
  return suma / notas.length;
}

// Función para determinar condición académica
function condicion(promedio) {
  if (promedio < 6) return "Reprobado";
  if (promedio >= 6 && promedio < 8) return "Aprobado";
  return "Promocionado";
}

// Crear un alumno
app.post("/alumnos", (req, res) => {
  const { nombre, nota1, nota2, nota3 } = req.body;

  if (!nombre || nota1 == null || nota2 == null || nota3 == null) {
    return res.status(400).json({ error: "Faltan datos del alumno." });
  }

  const existe = alumnos.find((a) => a.nombre === nombre);
  if (existe) {
    return res.status(400).json({ error: "Ya existe un alumno con ese nombre." });
  }

  const alumno = { nombre, nota1, nota2, nota3 };
  alumnos.push(alumno);

  res.json(alumno);
});

// Modificar un alumno
app.put("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const { nuevoNombre, nota1, nota2, nota3 } = req.body;

  const alumno = alumnos.find((a) => a.nombre === nombre);
  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  if (nuevoNombre && nuevoNombre !== nombre) {
    const repetido = alumnos.find((a) => a.nombre === nuevoNombre);
    if (repetido) {
      return res.status(400).json({ error: "Ya existe un alumno con ese nuevo nombre." });
    }
    alumno.nombre = nuevoNombre;
  }

  if (nota1 != null) alumno.nota1 = nota1;
  if (nota2 != null) alumno.nota2 = nota2;
  if (nota3 != null) alumno.nota3 = nota3;

  res.json(alumno);
});

// Consultar un alumno
app.get("/alumnos/:nombre", (req, res) => {
  const nombre = req.params.nombre;
  const alumno = alumnos.find((a) => a.nombre === nombre);

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado." });
  }

  const notas = [alumno.nota1, alumno.nota2, alumno.nota3];
  const promedio = calcularPromedio(notas);
  const estado = condicion(promedio);

  res.json({ ...alumno, promedio, condicion: estado });
});

// Consultar todos los alumnos
app.get("/alumnos", (req, res) => {
  const resultado = alumnos.map((a) => {
    const notas = [a.nota1, a.nota2, a.nota3];
    const promedio = calcularPromedio(notas);
    const estado = condicion(promedio);
    return { ...a, promedio, condicion: estado };
  });
  res.json(resultado);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});