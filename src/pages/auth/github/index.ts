import { generateState } from "oslo/oauth2";
import { github } from "../../../lib/lucia";
import type { APIContext } from "astro";

export async function GET(context: APIContext) : Promise<Response> {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);

  context.cookies.set("github_oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 60,
    sameSite: "lax"
  });

  return context.redirect(url.toString());
}
