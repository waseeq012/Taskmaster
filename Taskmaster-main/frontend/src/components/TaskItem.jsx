import { CheckCircle2, Circle, Trash2, Edit2, Save, X, Tag } from 'lucide-react'
import { useState } from 'react'

const priorityColors = {
  high: { dark: 'text-red-400 bg-red-500/10 border-red-500/30', light: 'text-red-600 bg-red-50 border-red-300' },
  medium: { dark: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', light: 'text-yellow-600 bg-yellow-50 border-yellow-300' },
  low: { dark: 'text-green-400 bg-green-500/10 border-green-500/30', light: 'text-green-600 bg-green-50 border-green-300' },
}

const categoryColors = {
  Work: { dark: 'bg-blue-500/20 text-blue-300', light: 'bg-blue-100 text-blue-700' },
  Personal: { dark: 'bg-purple-500/20 text-purple-300', light: 'bg-purple-100 text-purple-700' },
  Shopping: { dark: 'bg-pink-500/20 text-pink-300', light: 'bg-pink-100 text-pink-700' },
  Health: { dark: 'bg-green-500/20 text-green-300', light: 'bg-green-100 text-green-700' },
  Finance: { dark: 'bg-yellow-500/20 text-yellow-300', light: 'bg-yellow-100 text-yellow-700' },
}

export default function TaskItem({ task, isEditing, onEdit, onUpdate, onDelete, onToggleComplete, darkMode }) {
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [editPriority, setEditPriority] = useState(task.priority || 'medium')
  const [editCategory, setEditCategory] = useState(task.category || '')
  const [editDueTime, setEditDueTime] = useState(task.dueTime || '')

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        category: editCategory,
        dueTime: editDueTime || null,
        completed: task.completed,
      })
    }
  }

  const getPriorityColor = () => {
    return priorityColors[editPriority] || priorityColors['medium']
  }

  const getCategoryColor = (cat) => {
    return categoryColors[cat] || (darkMode ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-700')
  }

  return (
    <div className={`rounded-xl p-4 transition-all hover:shadow-medium ${
      darkMode
        ? task.completed 
          ? 'bg-white/5 border border-white/10 hover:border-white/20' 
          : 'bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/40'
        : task.completed 
          ? 'bg-gray-50 border border-gray-200 hover:border-gray-300' 
          : 'bg-white border border-gray-200 shadow-soft hover:shadow-medium hover:border-gray-300'
    }`}>
      {isEditing ? (
        // Edit Mode
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows="3"
            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 resize-none ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/30'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
              }`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Category"
              className={`px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/30'
              }`}
            />
          </div>
          <input
            type="datetime-local"
            value={editDueTime}
            onChange={(e) => setEditDueTime(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
              darkMode
                ? 'bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400/30'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/30'
            }`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`flex-1 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors font-medium ${
                darkMode
                  ? 'bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/30'
                  : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
              }`}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => onEdit(null)}
              className={`flex-1 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors font-medium ${
                darkMode
                  ? 'bg-gray-500/20 hover:bg-gray-500/40 text-gray-400 border border-gray-500/30'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-400'
              }`}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="flex gap-3 items-start">
          {/* Checkbox */}
          <button
            onClick={() => onToggleComplete(task.id, task.completed)}
            className={`mt-1 transition-colors flex-shrink-0 ${
              darkMode 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-400 hover:text-blue-600'
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3 className={`font-semibold text-base ${
                  task.completed 
                    ? darkMode 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-500 line-through'
                    : darkMode 
                      ? 'text-white' 
                      : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mt-1 ${
                    task.completed 
                      ? darkMode 
                        ? 'text-gray-600' 
                        : 'text-gray-400'
                      : darkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                {task.dueTime && (
                  <p className={`text-sm mt-1 ${
                    task.completed 
                      ? darkMode 
                        ? 'text-gray-600' 
                        : 'text-gray-400'
                      : darkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                  }`}>
                    Due: {new Date(task.dueTime).toLocaleString()}
                  </p>
                )}
              </div>
              
              {/* Priority & Category Badges */}
              <div className="flex gap-2 flex-wrap justify-end">
                {task.priority && (
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor()[darkMode ? 'dark' : 'light']}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}
                {task.category && (
                  <span className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${getCategoryColor(task.category)}`}>
                    <Tag className="w-3 h-3" />
                    {task.category}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onEdit(task.id)}
                className={`text-sm transition-colors flex items-center gap-1 font-medium ${
                  darkMode
                    ? 'text-gray-400 hover:text-blue-400'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className={`text-sm transition-colors flex items-center gap-1 font-medium ${
                  darkMode
                    ? 'text-gray-400 hover:text-red-400'
                    : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}