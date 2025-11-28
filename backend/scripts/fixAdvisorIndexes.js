const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fixIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected');

    // Get the Advisor collection
    const db = mongoose.connection.db;
    const advisorsCollection = db.collection('advisors');

    // Drop all indexes except _id
    console.log('🔧 Dropping old indexes...');
    await advisorsCollection.dropIndexes();
    console.log('✅ Old indexes dropped');

    // Recreate the correct indexes
    console.log('🔧 Creating new indexes...');
    
    // Text index for search
    await advisorsCollection.createIndex({ advisorName: 'text', bio: 'text' });
    console.log('✅ Created text index on advisorName and bio');
    
    // Separate indexes for array fields
    await advisorsCollection.createIndex({ specializations: 1 });
    console.log('✅ Created index on specializations');
    
    await advisorsCollection.createIndex({ industries: 1 });
    console.log('✅ Created index on industries');

    console.log('🎉 All indexes fixed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('👋 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
};

fixIndexes();

