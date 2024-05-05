import type { APIRoute } from "astro";

import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const search = url.searchParams.get("search");
  if (!search)
    return new Response(
      JSON.stringify({
        error: "Search Param is missing",
      }),
      {
        status: 400,
        headers: {
          "Content-type": "application/json",
        },
      }
    );

  const allBlogs: CollectionEntry<"blog">[] = await getCollection("blog");

  const searchResults = allBlogs.filter((blog) => {
    const titleMatch = blog!.data.title
      .toLocaleLowerCase()
      .includes(search.toLowerCase());
    const bodyMatch = blog!.body
      .toLocaleLowerCase()
      .includes(search.toLowerCase());
    const slugMatch = blog!.slug
      .toLocaleLowerCase()
      .includes(search.toLowerCase());

    return titleMatch || bodyMatch || slugMatch;
  });

  return new Response(JSON.stringify(searchResults), {
    status: 200,
    headers: {
      "Content-type": "application/json",
    },
  });
};
