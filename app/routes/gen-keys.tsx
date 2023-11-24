import { redirect } from "@remix-run/node";
import { decryptToken, encryptToken } from "~/models/user.server";

export function loader() {
  const token = encryptToken("hello world");
  console.log('encrypted token from the loader: ', token);

  console.log('decryptToken from the loader:', decryptToken(token));

  return redirect('/');
}
