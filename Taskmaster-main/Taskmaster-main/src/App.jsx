import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const task = await res.json();
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      const task = await res.json();
      setTasks(tasks.map(t => t.id === id ? task : t));
      setEditing(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = (id, completed) => {
    updateTask(id, { completed });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600">Task Management System</h1>
        
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Task</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
            />
            <button 
              onClick={addTask} 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`border border-gray-200 rounded-lg p-4 transition duration-200 hover:shadow-md ${task.completed ? 'bg-green-50' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => toggleComplete(task.id, e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    {editing === task.id ? (
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, title: e.target.value } : t))}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <textarea
                          value={task.description}
                          onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? { ...t, description: e.target.value } : t))}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                        />
                      </div>
                    ) : (
                      <div className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        <h3 className={`font-semibold text-lg ${task.completed ? 'text-gray-500' : 'text-gray-800'}`}>{task.title}</h3>
                        <p className={`text-gray-600 mt-1 ${task.completed ? 'text-gray-400' : ''}`}>{task.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {editing === task.id ? (
                      <button 
                        onClick={() => updateTask(task.id, task)} 
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200 text-sm font-medium"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => setEditing(task.id)} 
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => deleteTask(task.id)} 
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;