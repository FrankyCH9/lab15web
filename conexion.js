const mysql = require('mysql');
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'db_servicios'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  connection.query('SELECT * FROM db_servicios.labo15', (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('index', { datos: resultados });
  });
});

// Ruta para consultas más complejas
app.get('/consultas', (req, res) => {
  const consulta = `
    SELECT t1.columna1, t2.campo1
    FROM labo5 AS t1
    JOIN tabla2 AS t2 ON t1.id = t2.id
    WHERE t1.columna2 > 10
  `;

  connection.query(consulta, (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('consultas', { datos: resultados });
  });
});

// Ruta para actualizar un dato
app.post('/actualizar/:id', [
  body('nuevoValor').isLength({ min: 3 }).withMessage('El dato debe tener al menos 3 caracteres'),
], (req, res) => {
  const id = req.params.id;
  const nuevoValor = req.body.nuevoValor;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('index', { errors: errors.array() });
    return;
  }

  const consulta = 'UPDATE db_servicios.labo15 SET columna1 = ? WHERE id = ?';

  connection.query(consulta, [nuevoValor, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar datos: ', error);
      return;
    }
    console.log('Datos actualizados exitosamente');
    res.redirect('/');
  });
});

// Ruta para eliminar un dato
app.post('/eliminar/:id', (req, res) => {
  const id = req.params.id;

  const consulta = 'DELETE FROM db_servicios.labo15 WHERE id = ?';

  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar datos: ', error);
      return;
    }
    console.log('Datos eliminados exitosamente');
    res.redirect('/');
  });
});

// Ruta para agregar un nuevo dato
app.post('/', [
  body('nuevoDato').isLength({ min: 3 }).withMessage('El dato debe tener al menos 3 caracteres'),
], (req, res) => {
  const nuevoDato = req.body.nuevoDato;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('index', { errors: errors.array() });
    return;
  }

  const consulta = 'INSERT INTO db_servicios.labo15 (columna1) VALUES (?)';

  connection.query(consulta, [nuevoDato], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
      return;
    }
    console.log('Dato insertado exitosamente');
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
