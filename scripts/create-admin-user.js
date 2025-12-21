#!/usr/bin/env node

/**
 * Script to create an admin user
 * Usage: node scripts/create-admin-user.js [email] [password] [firstName] [lastName]
 */

// Use backend/server node_modules
const path = require('path');
const Module = require('module');
const originalRequire = Module.prototype.require;
const backendServerPath = path.join(__dirname, '../backend/server');

// Override require to look in backend/server/node_modules first
Module.prototype.require = function(id) {
  try {
    return originalRequire.apply(this, arguments);
  } catch (e) {
    try {
      return originalRequire.apply(this, [path.join(backendServerPath, 'node_modules', id)]);
    } catch (e2) {
      throw e;
    }
  }
};

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '../backend/server/.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pmp_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function createAdminUser() {
  // Get arguments or use defaults
  const email = process.argv[2] || 'admin@pmpapp.com';
  const password = process.argv[3] || 'admin123';
  const firstName = process.argv[4] || 'Admin';
  const lastName = process.argv[5] || 'User';

  try {
    console.log('🔐 Creating admin user...');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      if (user.role === 'admin') {
        console.log('⚠️  Admin user already exists with this email!');
        console.log(`   User ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('');
        console.log('To update password, use:');
        console.log(`   node scripts/create-admin-user.js ${email} <new-password>`);
        process.exit(0);
      } else {
        // Update existing user to admin
        console.log('⚠️  User exists but is not admin. Updating to admin...');
        const passwordHash = await bcrypt.hash(password, 10);
        await pool.query(
          'UPDATE users SET password_hash = $1, role = $2, first_name = $3, last_name = $4, updated_at = NOW() WHERE email = $5',
          [passwordHash, 'admin', firstName, lastName, email]
        );
        console.log('✅ User updated to admin successfully!');
        process.exit(0);
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create admin user
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, email, first_name, last_name, role, subscription_tier, created_at`,
      [userId, email, passwordHash, firstName, lastName, 'admin', 'premium']
    );

    const user = result.rows[0];

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('User Details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.first_name} ${user.last_name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Subscription: ${user.subscription_tier}`);
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('🌐 You can now login at:');
    console.log('   Web Admin: http://localhost:3000');
    console.log('   Mobile App: Use these credentials');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === '23505') {
      console.error('   User with this email already exists');
    } else if (error.code === '28P01') {
      console.error('   Database authentication failed. Check your .env file.');
    } else if (error.code === '3D000') {
      console.error('   Database does not exist. Run migrations first.');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdminUser();

