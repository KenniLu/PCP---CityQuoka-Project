'use client';
import { useState } from 'react';
import { Plus, Trash2 } from "lucide-react"; // Make sure to install lucide-react

export default function CategoryFilter() {
    const [categories, setCategories] = useState([
        'All',
        'Text',
        'Image',
        'Video',
    ]);
    const [active, setActive] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        const newCategory = prompt("Enter new category name:");
        if (newCategory && newCategory.trim() !== "") {
            setCategories([...categories, newCategory]);
        }
    };

    const handleDeleteCategory = (catToDelete) => {
        setCategories(categories.filter((cat) => cat !== catToDelete));
        if (active === catToDelete) {
            setActive("All");
        }
    };

    return (
    <div> {/* className ="min-h-5 bg-blue-300 p-2 border-1 border-black rounded-3xl" */}
      {/* Category Filter Box */}
      <nav className="flex gap-4 justify-center bg-[#FFE2A8] rounded-xl border-2 border-black  shadow-md px-6 py-4">
        {categories.map((cat) => (
          <div
            key = {cat}
            className={`px-6 py-2 rounded-full font-semibold transition 
              ${
                active === cat
                  ? "bg-red-600 text-white border-b-4 border-red-800"
                  : "bg-gray-200 text-black"
              }`}
              >
              <button
                onClick={() => setActive(cat)}>
              {cat}
              </button>
          </div> ))}

          {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 rounded-full bg-gray-200 flex items-center gap-1 hover:bg-gray-300 transition"
        >
          <Plus size={18} /> Add
        </button>     

        {/* Single Trash Button */}
      <button
        onClick={() => active !== "All" && handleDeleteCategory(active)}
        disabled={active === "All"}
        className={`px-3 py-2 rounded-full flex items-center transition ${
          active !== "All"
            ? "text-red-600 hover:text-red-800"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        <Trash2 size={20} />
      </button>
      </nav> 

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Add Category</h2>

            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newCategory.trim()) {
                    setCategories([...categories, newCategory.trim()]);
                    setNewCategory("");
                    setIsModalOpen(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>);
}