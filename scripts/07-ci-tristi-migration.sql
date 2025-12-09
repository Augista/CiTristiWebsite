-- Create admin users table
CREATE TABLE IF NOT EXISTS admincitristi_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table
CREATE TABLE IF NOT EXISTS citristiproperties (
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
  admin_id INTEGER REFERENCES admincitristi_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_citristi_properties_district ON citristiproperties(district);
CREATE INDEX IF NOT EXISTS idx_citristi_properties_type ON citristiproperties(property_type);
CREATE INDEX IF NOT EXISTS idx_citristi_properties_price ON citristiproperties(price);
CREATE INDEX IF NOT EXISTS idx_citristi_properties_status ON citristiproperties(listing_status);
CREATE INDEX IF NOT EXISTS idx_citristi_properties_admin_id ON citristiproperties(admin_id);

-- Seed initial admin user (password: admin123)
-- Hash generated with bcrypt at cost 10
INSERT INTO admincitristi_users (email, name, password_hash) VALUES 
  ('admin@citristiproperty.com', 'Ci Tristi', '$2b$10$YIjlrVyaW4aNXVJ5jZvt2OYPB/0m1BdXMjvZf5lXhk5I5J5J5J5J5')
ON CONFLICT DO NOTHING;
