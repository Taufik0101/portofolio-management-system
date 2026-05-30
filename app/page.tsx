import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Portfolio CMS</h1>
        <p className="text-lg mb-8">
          Content Management System for your portfolio website
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/admin"
            className="block p-6 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
            <p>Manage your portfolio content</p>
          </Link>
          
          <Link 
            href="/portfolio"
            className="block p-6 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <h2 className="text-2xl font-semibold mb-2">View Portfolio</h2>
            <p>See your portfolio in action</p>
          </Link>
          
          <Link 
            href="/api/portfolio"
            className="block p-6 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <h2 className="text-2xl font-semibold mb-2">View Portfolio API</h2>
            <p>Access portfolio data via API</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
