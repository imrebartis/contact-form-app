import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { IUser } from 'src/types/user';

import User from '../models/user.model';

const ADMIN_GITHUB_ID = process.env.ADMIN_GITHUB_ID
  ? parseInt(process.env.ADMIN_GITHUB_ID, 10)
  : null;

export const configurePassport = () => {
  passport.serializeUser((user: IUser, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID ?? '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        callbackURL: process.env.GITHUB_CALLBACK_URL ?? '',
        scope: ['read:user user:email'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: {
          id: string;
          login?: string;
          name?: string;
          email?: string | null;
        },
        done: (error: unknown, user?: IUser) => void
      ) => {
        try {
          const profileIdNum = parseInt(profile.id, 10);

          let email: string | null = null;
          if (profile.email) {
            email = profile.email;
          } else {
            const username = profile.login || 'unknown';
            email = `${username}@users.noreply.github.com`;
          }

          const [user, created] = await User.findOrCreate({
            where: { githubId: profile.id },
            defaults: {
              email: email,
              name: profile.name || profile.login || 'GitHub User',
              isAdmin:
                ADMIN_GITHUB_ID !== null && profileIdNum === ADMIN_GITHUB_ID,
            },
          });

          if (
            !created &&
            ADMIN_GITHUB_ID !== null &&
            profileIdNum === ADMIN_GITHUB_ID &&
            !user.isAdmin
          ) {
            user.isAdmin = true;
            await user.save();
          }

          return done(null, user);
        } catch (error: unknown) {
          console.error('Error during authentication:', error);
          if (error instanceof Error) {
            return done(error, undefined);
          }
          return done(new Error(String(error)), undefined);
        }
      }
    )
  );

  return passport;
};
