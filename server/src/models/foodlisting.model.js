const { pool } = require("../config/db");

const createFoodListingsTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS food_listings (
        id SERIAL PRIMARY KEY, 
       vendor_id INTEGER NOT NULL 
        REFERENCES users(id)
        ON DELETE CASCADE,
        food_details TEXT NOT NULL,
        actual_price NUMERIC(10,2) NOT NULL,
        discounted_price NUMERIC(10,2) NOT NULL,
        bags_available INT NOT NULL,
        category VARCHAR(50) NOT NULL CHECK (category IN ('prepared', 'grocery')),
        special_instructions TEXT,
        pickup_address TEXT NOT NULL,
        show_brand BOOLEAN DEFAULT TRUE,
        best_before TEXT NOT NULL,
        expiry_at TIMESTAMP NOT NULL, --food listing expiry
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT 'active'
          CHECK (status IN ('active', 'sold', 'expired', 'deleted')),

        view_count INT DEFAULT 0
      );
    `;

    await pool.query(query);
    console.log("food_listings table created successfully");
  } catch (error) {
    console.error("Error creating food_listings table:", error);
  }
};

createFoodListingsTable()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
  });
