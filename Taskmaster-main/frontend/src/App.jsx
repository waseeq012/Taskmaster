import { CheckCircle2, Trash2, Edit2, Plus, ListTodo, Search, Moon, Sun, Tag, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [notificationTimeouts, setNotificationTimeouts] = useState(new Map())
  const [notifications, setNotifications] = useState([])
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || false
    }
    return false
  })
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const API_URL = '/api'

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (user) {
      scheduleNotifications()
    }
  }, [tasks, user])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Notification permission granted')
      }
    }
  }

  const scheduleNotifications = () => {
    notificationTimeouts.forEach(timeout => clearTimeout(timeout))
    setNotificationTimeouts(new Map())

    const now = new Date()
    const newTimeouts = new Map()

    tasks.forEach(task => {
      if (task.dueTime && !task.completed) {
        const dueDate = new Date(task.dueTime)
        const timeDiff = dueDate - now
        if (timeDiff > 0) {
          const timeout = setTimeout(() => {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Task Due: ${task.title}`, {
                body: task.description || 'Time to complete your task!'
              })
            }
            const notification = {
              id: Date.now() + Math.random(),
              title: `Task Due: ${task.title}`,
              message: task.description || 'Time to complete your task!',
              time: new Date().toLocaleTimeString(),
              taskId: task.id
            }
            setNotifications(prev => [notification, ...prev])
          }, timeDiff)
          newTimeouts.set(task.id, timeout)
        }
      }
    })

    setNotificationTimeouts(newTimeouts)
  }

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (!token || !userData) {
        logout()
        return
      }

      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('Fetch tasks failed:', data)
        if (res.status === 401 || res.status === 403) {
          logout()
        }
        setTasks([])
        return
      }

      if (!Array.isArray(data)) {
        console.error('Expected tasks array, got:', data)
        setTasks([])
        return
      }

      const normalizedTasks = data.map(task => ({
        ...task,
        id: task.id || task._id,
      }))

      setTasks(normalizedTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Error adding task:', data)
        if (res.status === 401 || res.status === 403) {
          logout()
        }
        return
      }
      const normalizedTask = { ...data, id: data.id || data._id }
      setTasks([...tasks, normalizedTask])
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const updateTask = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Error updating task:', data)
        if (res.status === 401 || res.status === 403) {
          logout()
        }
        return
      }
      const normalizedTask = { ...data, id: data.id || data._id }
      setTasks(tasks.map(t => t.id === id ? normalizedTask : t))
      setEditingId(null)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/tasks/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) {
        console.error('Error deleting task:', data)
        if (res.status === 401 || res.status === 403) {
          logout()
        }
        return
      }
      setTasks(tasks.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setTasks([])
    navigate('/login')
  }

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const categories = ['all', ...new Set(tasks.filter(t => t.category).map(t => t.category))]

  const filteredTasks = tasks.filter(task => {
    const title = task.title || ''
    const description = task.description || ''
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || (task.category || '') === selectedCategory
    return matchesSearch && matchesCategory
  })

  const completedCount = filteredTasks.filter(t => t.completed).length
  const activeTasks = filteredTasks.filter(t => !t.completed)
  const completedTasks = filteredTasks.filter(t => t.completed)
  const progressPercent = filteredTasks.length ? Math.round((completedCount / filteredTasks.length) * 100) : 0
  const progressRadius = 38
  const progressCircumference = 2 * Math.PI * progressRadius
  const progressOffset = progressCircumference - (progressPercent / 100) * progressCircumference

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/tasks" /> : <Login darkMode={darkMode} setUser={setUser} />} />
      <Route path="/register" element={user ? <Navigate to="/tasks" /> : <Register darkMode={darkMode} />} />
      <Route path="/tasks" element={user ? (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-8 px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-6xl mx-auto">
            <div className={`mb-8 flex items-center justify-between animate-slideIn ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                  <ListTodo className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${darkMode ? 'from-blue-400 via-cyan-400 to-blue-500' : 'from-blue-600 via-cyan-600 to-blue-700'} bg-clip-text text-transparent`}>
                    Task Master
                  </h1>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Organize your work efficiently</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-3 rounded-xl transition-all hover:scale-110 ${darkMode ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                <button
                  onClick={logout}
                  className={`p-3 rounded-xl transition-all hover:scale-110 ${darkMode ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="mb-8 space-y-2">
                {notifications.map(notification => (
                  <div key={notification.id} className={`rounded-xl p-4 flex items-start justify-between animate-slideIn ${darkMode ? 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/30' : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'}`}>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{notification.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-600'}`}>{notification.message}</p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{notification.time}</p>
                    </div>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className={`ml-4 p-1 rounded-lg transition-all hover:scale-110 ${darkMode ? 'text-red-400 hover:bg-red-800/30' : 'text-red-600 hover:bg-red-100'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {filteredTasks.length > 0 && (
              <div className={`grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 animate-slideIn`}>
                <div className={`rounded-xl p-4 text-center hover:shadow-medium transition-all ${darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white border border-gray-200 shadow-soft hover:shadow-medium'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{filteredTasks.length}</p>
                </div>
                <div className={`rounded-xl p-4 text-center hover:shadow-medium transition-all ${darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white border border-gray-200 shadow-soft hover:shadow-medium'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{activeTasks.length}</p>
                </div>
                <div className={`rounded-xl p-4 text-center hover:shadow-medium transition-all ${darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white border border-gray-200 shadow-soft hover:shadow-medium'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{completedCount}</p>
                </div>
                <div className={`rounded-xl p-4 text-center hover:shadow-medium transition-all ${darkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-white border border-gray-200 shadow-soft hover:shadow-medium'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progress</p>
                  <div className="mx-auto mt-4 w-28 h-28 relative">
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r={progressRadius}
                        strokeWidth="8"
                        className={darkMode ? 'text-slate-700' : 'text-gray-200'}
                        stroke="currentColor"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={progressRadius}
                        strokeWidth="8"
                        className={darkMode ? 'text-blue-400' : 'text-blue-600'}
                        stroke="currentColor"
                        fill="none"
                        strokeDasharray={`${progressCircumference} ${progressCircumference}`}
                        strokeDashoffset={progressOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{progressPercent}%</span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>done</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-slideIn`}>
              <div className={`relative ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Search className="absolute left-3 top-3 w-5 h-5 opacity-50" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 ${darkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'}`}
                />
              </div>

              {categories.length > 1 && (
                <div className={`flex items-center gap-2 overflow-x-auto ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Tag className="w-5 h-5 flex-shrink-0 opacity-50" />
                  <div className="flex gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? darkMode ? 'bg-blue-500/40 text-blue-300 border border-blue-400' : 'bg-blue-100 text-blue-700 border border-blue-300' : darkMode ? 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20' : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'}`}
                      >
                        {cat === 'all' ? 'All' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 animate-slideIn">
                <TaskForm onAddTask={addTask} darkMode={darkMode} />
              </div>

              <div className="lg:col-span-2 animate-slideIn">
                <TaskList 
                  tasks={filteredTasks}
                  activeTasks={activeTasks}
                  completedTasks={completedTasks}
                  loading={loading}
                  editingId={editingId}
                  onEdit={setEditingId}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  onToggleComplete={(id, completed) => updateTask(id, { completed: !completed })}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>
      ) : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/tasks" : "/login"} />} />
    </Routes>
  )
}

export default App
