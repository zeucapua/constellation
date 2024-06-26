import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { AstroDBAdapter } from "lucia-adapter-astrodb";
import { db, Session, User } from "astro:db";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes { 
  github_id: number;
  username: string;
  starred_url: string;
}

const adapter = new AstroDBAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD
    }
  },

  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.github_id,
      username: attributes.username,
      starred_url: attributes.starred_url
    }
  }
});

export const github = new GitHub(
  import.meta.env.GITHUB_CLIENT_ID,
  import.meta.env.GITHUB_CLIENT_SECRET
);
