import express from 'express';

const app = express();
const port = 3000;

let nextId = 1;
const calculos = [];

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de cálculos de Rectángulo - Bienvenido!!');
});

// POST calcular crear un nuevo cálculo
app.post('/calcular', (req, res) => {
  const { ancho, alto } = req.body;

  // Validaciones
  if (typeof ancho === 'undefined' || typeof alto === 'undefined') {
    return res.status(400).json({
      success: false,
      message: 'Faltan los campos "ancho" y/o "alto"',
    });
  }

  const ac = parseFloat(ancho);
  const al = parseFloat(alto);

  if (isNaN(ac) || isNaN(al) || ac <= 0 || al <= 0) {
    return res.status(400).json({
      success: false,
      message: "ancho y alto deben ser mayores a 0"
    });
  }

  // Calcular perímetro y superficie 
  const perimetro = 2 * (ac + al);
  const superficie = ac * al;

  // Crear el objeto
  const nuevoCalculo = {
    id: nextId++,
    ancho: ac,
    alto: al,
    perimetro,
    superficie,
  };

  // Guardar en el arreglo
  calculos.push(nuevoCalculo);

  // Responder
  res.status(201).json({ success: true, data: nuevoCalculo });
});

app.get('/calculos', (req, res) => {
  const resultados = calculos.map(calc => {
    const tipo = calc.ancho === calc.alto ? 'cuadrado' : 'rectángulo';
    return { ...calc, tipo };
  });

  res.json({ success: true, data: resultados });
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
