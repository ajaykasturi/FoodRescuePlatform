const { pool } = require("../config/db");

async function createOrdersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      consumer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vendor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
      listing_id INTEGER NOT NULL REFERENCES food_listings(id) ON DELETE SET NULL,

      price NUMERIC(10,2) NOT NULL,
      food_details TEXT NOT NULL,
      pickup_address TEXT NOT NULL,
      category VARCHAR(50) NOT NULL,
      business_name VARCHAR(255),
      status VARCHAR(20) 
        DEFAULT 'placed'
        CHECK (status IN ('placed', 'delivered', 'cancelled')),

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
    console.log("Orders table created successfully");
  } catch (err) {
    console.error("Error creating orders table", err);
  }
}

createOrdersTable()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
  });
