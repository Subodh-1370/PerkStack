// Simple test script to verify backend is working
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5001/api/health');
    console.log('Health check:', await healthResponse.json());
    
    // Test registration
    console.log('\nTesting registration...');
    const registerResponse = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        startupName: 'Test Startup'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration result:', registerData);
    
    if (registerResponse.ok) {
      console.log('\n✅ Backend is working correctly!');
      console.log('You can now test the frontend registration.');
    } else {
      console.log('\n❌ Backend registration failed:', registerData);
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\nMake sure the backend is running on port 5001');
  }
}

testBackend();
