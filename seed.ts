import { query } from './database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  try {
    logger.info('Seeding database...');

    const passwordHash = await bcrypt.hash('Password123!', 12);

    const users = [
      { id: uuidv4(), email: 'alice@example.com', username: 'alice_dev', display_name: 'Alice Johnson', bio: 'Software developer & coffee enthusiast ☕' },
      { id: uuidv4(), email: 'bob@example.com', username: 'bob_design', display_name: 'Bob Smith', bio: 'UI/UX Designer | Making things beautiful' },
      { id: uuidv4(), email: 'carol@example.com', username: 'carol_pm', display_name: 'Carol White', bio: 'Product Manager | Building great products' },
    ];

    for (const user of users) {
      await query(
        `INSERT INTO users (id, email, password_hash, username, display_name, bio)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO NOTHING`,
        [user.id, user.email, passwordHash, user.username, user.display_name, user.bio]
      );

      await query(
        `INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
        [user.id]
      );
    }

    logger.info('Seed completed successfully');
    logger.info('Demo accounts: alice@example.com, bob@example.com, carol@example.com');
    logger.info('Password for all: Password123!');
    process.exit(0);
  } catch (error) {
    logger.error('Seed failed', error);
    process.exit(1);
  }
}

seed();