const http = require('http');

const data = JSON.stringify({
  username: 'johnd',
  password: 'm38rmF$'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', d => { responseData += d; });
  res.on('end', () => {
    console.log("Login Response Status:", res.statusCode);
    console.log("Login Response Body:", responseData);
    
    try {
        const parsed = JSON.parse(responseData);
        const token = parsed.data.token;
        console.log("Extracted Token:", token);
        
        // now test cart
        const cartReq = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/cart',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }, cartRes => {
            let cartData = '';
            cartRes.on('data', d => { cartData += d; });
            cartRes.on('end', () => {
                console.log("Cart Response Status:", cartRes.statusCode);
                console.log("Cart Response Body:", cartData);
            });
        });
        cartReq.end();
    } catch(e) {}
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
