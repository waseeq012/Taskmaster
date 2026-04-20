import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function TaskForm({ onAddTask, darkMode }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('')
  const [dueTime, setDueTime] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim(),
      dueTime: dueTime || null,
      completed: false,
    })

    setTitle('')
    setDescription('')
    setPriority('medium')
    setCategory('')
    setDueTime('')
  }

  return (
    <div className={`rounded-2xl p-6 sticky top-6 transition-all ${
      darkMode
        ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20'
        : 'bg-white border border-gray-200 shadow-soft'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <Plus className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
        </div>

        {/* Description Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows="3"
            className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 resize-none ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
        </div>

        {/* Priority Select */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Category Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Work, Personal, Shopping"
            className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
        </div>

        {/* Due Time Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Due Time (Optional)</label>
          <input
            type="datetime-local"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className={`w-full font-semibold py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${
            darkMode
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-700 disabled:to-gray-700 text-white'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white'
          }`}
        >
          Add Task
        </button>
      </form>
    </div>
  )
}