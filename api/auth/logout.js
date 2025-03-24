'use strict';

import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

export default async (req, res) => {
  // Apply CSRF protection
  csrfProtection(req, res, (err) => {
    if (err) {
      console.error('CSRF validation failed:', err);
      return res.status(403).json({ error: 'CSRF validation failed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Only allow GET for this endpoint
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      // Clear the auth cookie
      res.setHeader(
        'Set-Cookie',
        'auth_user=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure'
      );

      // Redirect the user to the home page
      return res.status(302).redirect('/');
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};
