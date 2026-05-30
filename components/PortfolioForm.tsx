"use client";

import { useState } from "react";

interface PortfolioFormState {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  projectUrl: string;
  techStack: string;
}

interface PortfolioFormProps {
  onItemAdded?: () => void;
}

export default function PortfolioForm({ onItemAdded }: PortfolioFormProps) {
  const [formData, setFormData] = useState<PortfolioFormState>({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    projectUrl: "",
    techStack: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imageUrl;

      // Upload image if file is selected
      if (imageFile) {
        setUploading(true);
        try {
          const formDataToUpload = new FormData();
          formDataToUpload.append("file", imageFile);
          formDataToUpload.append("fileName", imageFile.name);

          const res = await fetch("/api/upload-image", {
            method: "POST",
            body: formDataToUpload,
          });

          const data = await res.json();

          if (res.ok && data.publicUrl) {
            imageUrl = data.publicUrl;
          } else {
            // Fallback to URL input if upload fails
            alert("Image upload failed, using URL input instead");
          }
        } catch (error) {
          console.error("Upload error:", error);
          alert("Image upload failed, using URL input instead");
        } finally {
          setUploading(false);
        }
      }

      const techStack = formData.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          techStack,
        }),
      });

      if (res.ok) {
        alert("Portfolio item created successfully");
        setFormData({
          title: "",
          description: "",
          category: "",
          imageUrl: "",
          projectUrl: "",
          techStack: "",
        });
        setImageFile(null);
        // Refetch portfolio items after successful creation
        onItemAdded?.();
      } else {
        alert("Failed to create item");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select category</option>
            <option value="Web Development">Web Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Design">Design</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              dark:file:bg-gray-700 dark:file:text-gray-300"
          />
          {imageFile && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Or use Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project URL
          </label>
          <input
            type="text"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="Next.js, TypeScript, React"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Add Portfolio Item"}
        </button>
      </div>
    </form>
  );
}
