const axios = require('axios');

const API_URL = "http://localhost:5000";

async function testAPI() {
  try {
    // Test if server is running
    console.log('Testing server health...');
    const healthCheck = await axios.get(`${API_URL}/api/test`);
    console.log('✅ Server health:', healthCheck.data);

    // Test thoughts endpoint (no auth needed)
    console.log('\nTesting thoughts endpoint...');
    try {
      const thoughtsResponse = await axios.get(`${API_URL}/api/posts/all-thoughts`);
      console.log('✅ Thoughts response:', thoughtsResponse.data);
    } catch (err) {
      console.log('❌ Thoughts error:', err.response?.data || err.message);
    }

    // Test jobs endpoint (no auth needed)
    console.log('\nTesting jobs endpoint...');
    try {
      const jobsResponse = await axios.get(`${API_URL}/api/posts/all-jobs`);
      console.log('✅ Jobs response:', jobsResponse.data);
    } catch (err) {
      console.log('❌ Jobs error:', err.response?.data || err.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();