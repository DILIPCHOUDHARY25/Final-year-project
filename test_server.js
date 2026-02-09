// Simple test script to verify server setup
const fs = require('fs');
const path = require('path');

console.log('Testing server setup...');

// Check if all required files exist
const requiredFiles = [
  'server/package.json',
  'server/server.js',
  'server/models/User.js',
  'server/middleware/upload.js',
  'server/middleware/authenticate.js',
  'server/controllers/verificationController.js',
  'server/routes/verificationRoutes.js',
  'server/routes/authRoutes.js',
  'server/.env.example',
  'client/package.json',
  'client/src/App.jsx',
  'client/src/components/ParentVerification.jsx',
  'client/src/components/Sidebar.jsx',
  'client/src/pages/Login.jsx',
  'client/src/pages/Register.jsx',
  'client/src/pages/ParentDashboard.jsx',
  'client/src/index.js',
  'client/src/index.css',
  'client/public/index.html'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const fullPath = path.join('/home/engine/project', file);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

if (allFilesExist) {
  console.log('\n✅ All required files are present!');
  console.log('\nTo run the server:');
  console.log('1. cd /home/engine/project/server');
  console.log('2. npm start');
  console.log('\nTo run the client (after installing dependencies):');
  console.log('1. cd /home/engine/project/client');
  console.log('2. npm install');
  console.log('3. npm start');
} else {
  console.log('\n❌ Some files are missing!');
}

// Test server package.json
try {
  const serverPackage = require('./server/package.json');
  console.log('\n✅ Server dependencies:');
  console.log('- express:', serverPackage.dependencies.express);
  console.log('- mongoose:', serverPackage.dependencies.mongoose);
  console.log('- multer:', serverPackage.dependencies.multer);
  console.log('- tesseract.js:', serverPackage.dependencies['tesseract.js']);
  console.log('- jsonwebtoken:', serverPackage.dependencies.jsonwebtoken);
} catch (error) {
  console.log('\n❌ Error reading server package.json:', error.message);
}