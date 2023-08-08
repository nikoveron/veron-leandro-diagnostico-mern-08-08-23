const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb+srv://nicoveron:12345@cluster0.1zziahr.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a la base de datos'));
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});

// Habilitamos CORS
app.use(cors());
app.use(express.json());

// Definición del esquema de tareas
const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean
});

const Task = mongoose.model('Task', taskSchema);

// Ruta para obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Ruta para crear una nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const { description } = req.body;
    const newTask = new Task({ description, completed: false });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear una nueva tarea' });
  }
});

// Ruta para marcar una tarea como completada
app.put('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(taskId, { completed: true }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: 'Error al marcar la tarea como completada' });
  }
});

// Ruta para eliminar una tarea
app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la tarea' });
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
