import { useState } from 'react'
import './styles.css'

export default function App() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<string[]>([])

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800">
            Preview Demo
          </h1>
          <p className="text-gray-600 mt-2">
            React + TypeScript + Tailwind
          </p>
        </div>

        {/* Counter Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCount(c => c - 1)}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white text-xl font-bold transition-colors"
            >
              -
            </button>
            <span className="text-4xl font-mono font-bold text-gray-800 w-16 text-center">
              {count}
            </span>
            <button
              onClick={() => setCount(c => c + 1)}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Dynamic List Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Dynamic List</h2>
            <button
              onClick={addItem}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
            >
              Add Item
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No items yet</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 animate-slide-in"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-700">
          <strong>Tip:</strong> Use the DevTools pill (bottom-right) to test
          responsive layouts and dark mode.
        </div>
      </div>
    </div>
  )
}
