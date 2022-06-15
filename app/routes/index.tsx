import * as React from "react";
import { Link, useLoaderData } from "remix/react";
import type { LoaderFunction } from "remix/server";
import { json } from "remix/server";

export const loader: LoaderFunction = () => {
  return json({
    message: "Hello, World!",
  });
};

export default function Index() {
  const { message } = useLoaderData();
  return (
    <main>
      <h1>{message}</h1>
      <p>
        <Link to="/second">Second</Link>
      </p>
    </main>
  );
}
