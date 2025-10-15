
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Check for service account key in environment variables
const serviceAccountKey = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
if (!serviceAccountKey) {
  console.error("Error: FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON environment variable is not set.");
  console.error("Please provide the service account JSON key to seed the database.");
  process.exit(1);
}

initializeApp({
  credential: cert(JSON.parse(serviceAccountKey)),
});

const db = getFirestore();

import { popularOffers, quickTasks, leaderboardData, offerWalls } from '../src/lib/mock-data';

async function seedCollection(collectionName: string, data: any[]) {
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();
    
    console.log(`Seeding ${collectionName}...`);

    for (const item of data) {
        const docRef = collectionRef.doc(); // Auto-generate ID
        batch.set(docRef, item);
    }

    try {
        await batch.commit();
        console.log(`Successfully seeded ${data.length} documents into ${collectionName}.`);
    } catch (error) {
        console.error(`Error seeding ${collectionName}:`, error);
    }
}

async function main() {
  console.log("Starting database seed process...");

  const allOffers = [...popularOffers.map(o => ({...o, isPopular: true})), ...quickTasks.map(o => ({...o, isQuickTask: true}))];
  
  // Combine all seeding operations
  const seedingOperations = [
    seedCollection('offers', allOffers),
    seedCollection('leaderboard', leaderboardData),
    seedCollection('offer-walls', offerWalls),
  ];

  try {
    await Promise.all(seedingOperations);
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("An error occurred during the database seeding process:", error);
  }
}

main();
