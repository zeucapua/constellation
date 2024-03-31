import { github, lucia } from "../../../lib/lucia";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import type { APIContext } from "astro";
import { User, db, eq } from "astro:db";

interface GitHubUser {
  id: number;
  login: string;
}

export async function GET(context: APIContext) : Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const stored_state = context.cookies.get("github_oauth_state")?.value ?? null;

  if (!code || !state || !stored_state || state !== stored_state) {
    return new Response(null, { status: 400 });
  }


  try {
    const tokens = await github.validateAuthorizationCode(code);
    const response = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    });
    const github_user : GitHubUser = await response.json();
    const [existing_user] = await db.select().from(User).where(eq(User.github_id, github_user.id));
    if (existing_user) {
      const session = await lucia.createSession(existing_user.id, {});
      const session_cookie = lucia.createSessionCookie(session.id);
      context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);
      return context.redirect("/dashboard");
    }

    const user_id = generateId(15);
    const [user] = await db.insert(User).values({
      id: user_id,
      github_id: github_user.id,
      username: github_user.login
    }).returning();

    const session = await lucia.createSession(user.id, {});
    const session_cookie = lucia.createSessionCookie(session.id);
    context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);

    return context.redirect("/dashboard");
  }
  catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 });
    }

    console.log((e as Error).message);
    return new Response(null, { status: 500 });
  }
}
