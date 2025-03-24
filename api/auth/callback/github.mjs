// GitHub OAuth callback handler
'use strict';

import fetch from 'node-fetch';

export default async (req, res) => {
  console.log("GitHub callback serverless function hit");

  const { code } = req.query;

  if (!code) {
    console.error("No code provided in GitHub callback");
    return res.status(400).redirect('/?error=no_code');
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("Missing GitHub credentials");
      return res.status(500).redirect('/?error=server_config');
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Error exchanging code for token:", tokenData.error_description);
      return res.status(400).redirect(`/?error=${tokenData.error}`);
    }

    const { access_token } = tokenData;

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
    });

    const userData = await userResponse.json();

    // Get user email from GitHub
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find(email => email.primary)?.email || emails[0]?.email;

    // Set a cookie as backup authentication method
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    const userId = String(userData.id);
    const adminId = process.env.ADMIN_GITHUB_ID;
    const isAdmin = userId === adminId;

    const authPayload = {
      id: userData.id,
      name: userData.name || userData.login,
      email: primaryEmail || '',
      isAdmin,
    };

    res.setHeader('Set-Cookie', [
      `auth_user=${encodeURIComponent(JSON.stringify(authPayload))}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax; Secure`
    ]);

    // Redirect to /welcome with query parameters
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : process.env.CLIENT_URL || '';

    const redirectUrl = `${baseUrl}/welcome?auth=true&id=${encodeURIComponent(authPayload.id)}&name=${encodeURIComponent(authPayload.name)}&email=${encodeURIComponent(authPayload.email)}&isAdmin=${authPayload.isAdmin}`;

    return res.status(302).redirect(redirectUrl);

  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return res.status(500).redirect('/?error=server_error');
  }
};
