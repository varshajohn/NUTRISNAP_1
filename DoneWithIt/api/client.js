// FILE: api/client.js
const API_BASE_URL = 'http://172.20.10.5:3000/api'; // Ensure this IP is correct

const apiClient = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export default apiClient;