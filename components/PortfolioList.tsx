"use client";

import { useState, useEffect } from "react";
import EditPortfolioForm from "./EditPortfolioForm";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  projectUrl: string;
  techStack: string[];
  createdAt: string;
}

interface PortfolioListProps {
  onRefresh?: () => void;
}

export default function PortfolioList({ onRefresh }: PortfolioListProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch items");
      }
      
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refreshKey]);

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete item");
      }
      
      setItems(items.filter((item) => item.id !== id));
      alert("Item deleted successfully");
      setRefreshKey((prev) => prev + 1);
      onRefresh?.();
    } catch (error: any) {
      alert(error.message || "Failed to delete item");
    }
  };

  const startEditing = (item: PortfolioItem) => {
    setEditingItem(item);
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Items</h2>
        <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Items</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No items yet. Add one using the form.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditPortfolioForm
          item={editingItem}
          onClose={closeEditModal}
          onUpdated={() => {
            setRefreshKey((prev) => prev + 1);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
}
