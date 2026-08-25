import { startServer } from "../server";

let appPromise: ReturnType<typeof startServer> | undefined;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = startServer();
  }

  const app = await appPromise;

  return app(req, res);
}
