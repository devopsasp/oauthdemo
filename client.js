//Client Code
// Import required modules
const axios = require('axios');

// Set client credentials
const clientId = 'client1';
const clientSecret = 'client1-secret';

// Set user credentials
const username = 'john';
const password = 'password';

// Register client and get JWT token
axios.post(`http://localhost:3000/register`, {
  clientId,
  clientSecret,
  username,
})
  .then((res) => {
    const token = res.data.token;
    console.log(`Received JWT token: ${token}`);

    // Use JWT token to access protected route
    axios.get(`http://localhost:3000/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });