import { query, getClient } from "./db";

// Portfolio item types
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  projectUrl: string;
  techStack: string[];
  createdAt: string;
}

// Initialize database tables
export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }
  
  const client = await getClient();
  try {
    // Create portfolio_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        project_url VARCHAR(500),
        tech_stack TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON portfolio_items(category)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON portfolio_items(created_at)
    `);
    
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Test database connection
export async function testConnection() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL is not set");
    return false;
  }
  
  try {
    const client = await getClient();
    await client.query("SELECT 1");
    console.log("Connected to database successfully");
    client.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Get all portfolio items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Returning empty array.");
    return [];
  }
  
  try {
    const result = await query(
      "SELECT * FROM portfolio_items ORDER BY created_at DESC"
    );
    return result.rows.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      category: row.category,
      imageUrl: row.image_url || "",
      projectUrl: row.project_url || "",
      techStack: row.tech_stack || [],
      createdAt: row.created_at.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    throw error;
  }
}

// Get single portfolio item by ID
export async function getPortfolioItemById(id: string): Promise<PortfolioItem | null> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Returning null.");
    return null;
  }
  
  try {
    const result = await query("SELECT * FROM portfolio_items WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      category: row.category,
      imageUrl: row.image_url || "",
      projectUrl: row.project_url || "",
      techStack: row.tech_stack || [],
      createdAt: row.created_at.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    throw error;
  }
}

// Create new portfolio item
export async function createPortfolioItem(data: {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  projectUrl?: string;
  techStack: string[];
}): Promise<PortfolioItem> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Cannot create portfolio item.");
  }
  
  try {
    const result = await query(
      `INSERT INTO portfolio_items (title, description, category, image_url, project_url, tech_stack)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.title,
        data.description,
        data.category,
        data.imageUrl || null,
        data.projectUrl || null,
        data.techStack,
      ]
    );
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      category: row.category,
      imageUrl: row.image_url || "",
      projectUrl: row.project_url || "",
      techStack: row.tech_stack || [],
      createdAt: row.created_at.toISOString(),
    };
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    throw error;
  }
}

// Update portfolio item
export async function updatePortfolioItem(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    projectUrl: string;
    techStack: string[];
  }>
): Promise<PortfolioItem | null> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Cannot update portfolio item.");
  }
  
  try {
    const fields = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(data.description);
      paramIndex++;
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramIndex}`);
      values.push(data.category);
      paramIndex++;
    }
    if (data.imageUrl !== undefined) {
      fields.push(`image_url = $${paramIndex}`);
      values.push(data.imageUrl);
      paramIndex++;
    }
    if (data.projectUrl !== undefined) {
      fields.push(`project_url = $${paramIndex}`);
      values.push(data.projectUrl);
      paramIndex++;
    }
    if (data.techStack !== undefined) {
      fields.push(`tech_stack = $${paramIndex}`);
      values.push(data.techStack);
      paramIndex++;
    }
    
    if (fields.length === 0) return null;
    
    // Add WHERE clause with id (separate from SET fields)
    const result = await query(
      `UPDATE portfolio_items SET ${fields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      [...values, id]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      title: row.title,
      description: row.description,
      category: row.category,
      imageUrl: row.image_url || "",
      projectUrl: row.project_url || "",
      techStack: row.tech_stack || [],
      createdAt: row.created_at.toISOString(),
    };
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    throw error;
  }
}

// Delete portfolio item
export async function deletePortfolioItem(id: string): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Cannot delete portfolio item.");
  }
  
  try {
    await query("DELETE FROM portfolio_items WHERE id = $1", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    throw error;
  }
}
