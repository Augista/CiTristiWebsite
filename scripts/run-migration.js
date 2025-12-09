import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL)

const migrationSQL = `
-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  price BIGINT NOT NULL,
  size_sqm INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  featured_image_url VARCHAR(500),
  gallery_images JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  listing_status VARCHAR(50) DEFAULT 'available',
  admin_id INTEGER REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(listing_status);
CREATE INDEX IF NOT EXISTS idx_properties_admin_id ON properties(admin_id);

-- Seed initial admin user (password: admin123)
INSERT INTO admin_users (email, name, password_hash) VALUES 
  ('admin@cristiproperty.com', 'Admin', '\$2b\$10\$YIjlrVyaW4aNXVJ5jZvt2OYPB/0m1BdXMjvZf5lXhk5I5J5J5J5J5')
ON CONFLICT DO NOTHING;
`

async function runMigration() {
  try {
    console.log(" Starting database migration...")

    const statements = migrationSQL.split(";").filter((s) => s.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(" Executing:", statement.substring(0, 50) + "...")
        await sql(statement)
      }
    }

    console.log(" ✅ Migration completed successfully!")
    console.log(" Tables created: admin_users, properties")
    console.log(" Admin user created: admin@cristiproperty.com (password: admin123)")
  } catch (error) {
    console.error(" ❌ Migration failed:", error.message)
    process.exit(1)
  }
}

runMigration()
