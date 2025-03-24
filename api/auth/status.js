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
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
      // Check for the auth_user cookie
      const authCookie = req.headers.cookie
        ?.split('; ')
        .find((row) => row.startsWith('auth_user='));

      if (!authCookie) {
        return res.status(200).json({ isAuthenticated: false, user: null });
      }

      // Decode the cookie value
      const authToken = decodeURIComponent(authCookie.split('=')[1]);
      const user = JSON.parse(authToken);

      // Check if the user object is valid and has required fields
      const isAuthenticated = !!user && !!user.id;

      // Check if user is admin by comparing with ADMIN_GITHUB_ID
      const isAdmin = String(user?.id) === process.env.ADMIN_GITHUB_ID;

      return res.status(200).json({
        isAuthenticated,
        user: isAuthenticated
          ? {
              id: user.id,
              email: user.email || null,
              name: user.name || null,
              isAdmin,
            }
          : null,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
};
