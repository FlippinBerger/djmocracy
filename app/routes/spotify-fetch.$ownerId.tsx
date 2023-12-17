import { json, LoaderFunctionArgs } from "@remix-run/node";

import invariant from "tiny-invariant";
import { search } from "~/spotify/search.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.ownerId, "ownerId not found");
  const url = new URL(request.url);
  const searchParams = url.searchParams.get("search")
  if (!searchParams) {
    return;
  }

  const res = await search(searchParams, params.ownerId);

  return json(res);
};
