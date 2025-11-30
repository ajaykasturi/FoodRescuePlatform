const { pool } = require("../config/db");

async function createRatingsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,

      order_id INTEGER UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
      consumer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      listing_id INTEGER REFERENCES food_listings(id) ON DELETE SET NULL,
      vendor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

      satisfaction INTEGER NOT NULL CHECK (satisfaction BETWEEN 1 AND 5),
      food_quality INTEGER NOT NULL CHECK (food_quality BETWEEN 1 AND 5),
      food_quantity INTEGER NOT NULL CHECK (food_quantity BETWEEN 1 AND 5),

      feedback TEXT,

      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
    console.log("Ratings table created successfully");
  } catch (err) {
    console.error("Error creating ratings table", err);
  }
}

createRatingsTable()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
  });
