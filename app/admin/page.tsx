"use client";

import { useState, useEffect, useRef } from "react";
import PortfolioList from "@/components/PortfolioList";
import PortfolioForm from "@/components/PortfolioForm";

export default function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const listRef = useRef<{ fetchItems: () => void }>(null);

  const handleItemAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio Management
          </h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PortfolioForm onItemAdded={handleItemAdded} />
          </div>
          <div className="lg:col-span-2">
            <PortfolioList key={refreshTrigger} onRefresh={handleItemAdded} />
          </div>
        </div>
      </div>
    </div>
  );
}
