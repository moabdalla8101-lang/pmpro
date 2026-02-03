// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test database if not already set
if (!process.env.DB_NAME) {
  process.env.DB_NAME = 'pmp_app_test';
}



