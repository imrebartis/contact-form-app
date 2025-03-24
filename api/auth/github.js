// Simple GitHub OAuth redirect handler
'use strict';

module.exports = (req, res) => {
  console.log('GitHub auth serverless function hit');

  // Get the client ID from environment variables
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    console.error('Missing GitHub client ID');
    return res.status(500).send('Server configuration error');
  }

  // Construct the redirect URL
  const redirectUri = encodeURIComponent(
    `${
      process.env.CLIENT_URL || 'https://contact-form-app-sable.vercel.app'
    }/api/auth/callback/github`
  );
  const scope = 'user:email';

  // Build the GitHub authorization URL
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  // Perform the redirect
  return res.redirect(githubAuthUrl);
};
