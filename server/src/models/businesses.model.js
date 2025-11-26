const { pool } = require("../config/db");

const createBusinessTable = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS business_info (
        id SERIAL PRIMARY KEY,                                -- Unique business identifier

        user_id INTEGER UNIQUE NOT NULL,                      -- One-to-one with users table
        FOREIGN KEY (user_id) REFERENCES users(id) 
          ON DELETE CASCADE,
        
        legal_name VARCHAR(255) NOT NULL,                     -- Business legal name
        
        license_number VARCHAR(100),                          -- Optional
        
        verification_status VARCHAR(20) NOT NULL 
          DEFAULT 'Pending',                                  -- Pending | Approved | Rejected
        
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- When vendor submitted
        
        reviewed_at TIMESTAMP,                                -- When admin reviewed
        
        reviewed_by INTEGER,                                  -- Admin account ID
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
          ON DELETE SET NULL
      );
    `;

    await pool.query(query);
    console.log("Business Information table created successfully.");
  } catch (error) {
    console.error("Error creating business table:", error);
  }
};

createBusinessTable()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end();
  });
