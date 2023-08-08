
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then(response => response.json())
      .then(setTasks)
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newTask })
      });

      if (response.ok) {
        const data = await response.json();
        setTasks([...tasks, data]);
        setNewTask('');
      } else {
        console.error('Error adding task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: action === 'complete' ? 'PUT' : 'DELETE'
      });

      if (response.ok) {
        if (action === 'complete') {
          const updatedTasks = tasks.map(task =>
            task._id === taskId ? { ...task, completed: true } : task
          );
          setTasks(updatedTasks);
        } else if (action === 'delete') {
          const updatedTasks = tasks.filter(task => task._id !== taskId);
          setTasks(updatedTasks);
        }
      } else {
        console.error(`Error ${action === 'complete' ? 'completing' : 'deleting'} task`);
      }
    } catch (error) {
      console.error(`Error ${action === 'complete' ? 'completing' : 'deleting'} task:`, error);
    }
  };

  return (
    <div className="App">
      <h1>Lista de Tareas</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button onClick={handleAddTask}>Agregar Tarea</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.description}
            </span>
            {!task.completed && (
              <>
                <button onClick={() => handleTaskAction(task._id, 'complete')}>Completar</button>
                <button onClick={() => handleTaskAction(task._id, 'delete')}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
