import axios from 'axios';

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing profile update API...');
    
    // First, login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john.developer@email.com',
      password: 'seeker123'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data);
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');
    
    // Test profile update
    const updateResponse = await axios.patch(
      'http://localhost:5000/api/users/profile',
      {
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        interestedRoles: ['Frontend Engineer', 'Full Stack Developer'],
        preferredLocations: ['Remote', 'New York']
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Profile update successful:', updateResponse.data);
    
  } catch (error: any) {
    console.error('❌ Profile update test failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    });
  }
}

testProfileUpdate();
