/**
 * Firebase Database Service
 * Kazemi x Shioru Fusion
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getDatabase,
  connectDatabaseEmulator,
  ref,
  child,
  DatabaseReference,
} from 'firebase/database';
import type { BotConfig } from '../../types/index.js';

let databaseRef: DatabaseReference | null = null;

/**
 * Initialize Firebase Database
 */
export function initializeDatabase(config: BotConfig): void {
  if (getApps().length > 0) {
    databaseRef = ref(getDatabase());
    console.log('✅ Firebase Database already initialized');
    return;
  }

  try {
    const firebaseConfig = {
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      databaseURL: config.firebase.databaseURL,
      projectId: config.firebase.projectId,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId,
      appId: config.firebase.appId,
      measurementId: config.firebase.measurementId,
    };

    initializeApp(firebaseConfig);
    databaseRef = ref(getDatabase());

    console.log('✅ Firebase Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Database:', error);
    throw error;
  }
}

/**
 * Get database reference
 */
export function getDatabaseRef(): DatabaseReference {
  if (!databaseRef) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return databaseRef;
}

/**
 * Get guild reference
 */
export function getGuildRef(guildId: string): DatabaseReference {
  return child(getDatabaseRef(), `guilds/${guildId}`);
}

/**
 * Get user reference
 */
export function getUserRef(userId: string): DatabaseReference {
  return child(getDatabaseRef(), `users/${userId}`);
}

/**
 * Get global settings reference
 */
export function getGlobalSettingsRef(): DatabaseReference {
  return child(getDatabaseRef(), 'settings');
}

/**
 * Connect to database emulator (for development)
 */
export function connectToEmulator(host: string = 'localhost', port: number = 9000): void {
  if (databaseRef) {
    connectDatabaseEmulator(getDatabase(), host, port);
    console.log(`✅ Connected to Firebase Database emulator at ${host}:${port}`);
  }
}

export default {
  initializeDatabase,
  getDatabaseRef,
  getGuildRef,
  getUserRef,
  getGlobalSettingsRef,
  connectToEmulator,
};
