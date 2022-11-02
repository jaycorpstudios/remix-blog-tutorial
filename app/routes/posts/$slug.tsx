import { marked } from "marked";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPostBySlug } from "~/models/posts.server";
import invariant from "tiny-invariant";

type LoaderDataType = {
  title: string;
  htmlContent: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "Missing slug is required");
  const post = await getPostBySlug(slug);
  invariant(post, `Post not found: ${slug}`);
  const htmlContent = marked(post.markdown);
  return json<LoaderDataType>({ title: post.title, htmlContent });
};

export default function PostRoute() {
  const { title, htmlContent } = useLoaderData() as LoaderDataType;
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </main>
  );
}
