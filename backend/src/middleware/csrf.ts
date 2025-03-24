'use strict';

import csrf from 'csurf';

// Ensure cookie-parser is used before csurf middleware
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

export default csrfProtection;
