import { mediaTypeLookup} from "../deps.ts";

interface CreateRequestHandlerOptions {
  staticAssets: Map<string, string | Uint8Array>;
  remixRequestHandler: (request: Request) => Promise<Response>;
}

export function createRequestHandler(
  options: CreateRequestHandlerOptions | Promise<CreateRequestHandlerOptions>
) {
  const finalOptionsPromise = Promise.resolve(options).then((options) => {
    const encoder = new TextEncoder();
    for (let [key, asset] of options.staticAssets) {
      if (typeof asset === "string") {
        asset = encoder.encode(asset);
      }
      options.staticAssets.set(key, asset);
    }
    return options;
  });

  return async function requestHandler(
    request: Request
    // connectionInfo: server.ConnInfo
  ) {
    const { staticAssets, remixRequestHandler } = await finalOptionsPromise;
    const url = new URL(request.url);
    const staticAsset = staticAssets.get(url.pathname);
    if (typeof staticAsset !== "undefined") {
      const headers = new Headers();
      const contentType = mediaTypeLookup(url.pathname);
      contentType && headers.set("Content-Type", contentType);
      return new Response(staticAsset, { headers });
    }

    try {
      return await remixRequestHandler(request);
    } catch (error) {
      return new Response(String(error), { status: 500 });
    }
  };
}

// export function createRequestHandler<
//   Context extends AppLoadContext | undefined = undefined,
// >({
//   build,
//   mode,
//   getLoadContext,
// }: {
//   build: ServerBuild;
//   mode?: string;
//   getLoadContext?: (request: Request) => Promise<Context> | Context;
// }) {
//   const handleRequest = createRemixRequestHandler(build, mode);

//   return async (request: Request) => {
//     try {
//       const loadContext = await getLoadContext?.(request);

//       return handleRequest(request, loadContext);
//     } catch (error: unknown) {
//       console.error(error);

//       return new Response("Internal Error", { status: 500 });
//     }
//   };
// }
