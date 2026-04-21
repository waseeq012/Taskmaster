import { CheckCircle2, Circle, Trash2, Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'
import TaskItem from './TaskItem'

export default function TaskList({ 
  tasks, 
  activeTasks, 
  completedTasks, 
  loading, 
  editingId, 
  onEdit, 
  onUpdate, 
  onDelete, 
  onToggleComplete,
  darkMode 
}) {
  if (loading) {
    return (
      <div className={`rounded-2xl p-8 flex items-center justify-center ${darkMode ? 'bg-white/5 border border-white/20' : 'bg-white border border-gray-200 shadow-soft'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className={`rounded-2xl p-12 text-center ${darkMode ? 'bg-white/5 border border-white/20' : 'bg-white border border-gray-200 shadow-soft'}`}>
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
          <svg className={`w-8 h-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No tasks yet</h3>
        <p className={darkMode ? 'text-gray-500' : 'text-gray-500'}>Create your first task to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="animate-fadeIn">
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Circle className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            Active Tasks ({activeTasks.length})
          </h3>
          <div className="space-y-3">
            {activeTasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slideIn">
                <TaskItem
                  task={task}
                  isEditing={editingId === task.id}
                  onEdit={onEdit}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="animate-fadeIn">
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-3 opacity-75">
            {completedTasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slideIn">
                <TaskItem
                  task={task}
                  isEditing={editingId === task.id}
                  onEdit={onEdit}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}