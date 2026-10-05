import { $, retry, spinner } from 'zx';

/**
 * Start Directus along with the mock license server.
 * Directus 12 requires a license for some features (e.g. custom permission rules).
 * A new license server is started each time, as a license can only be activated on a limited number of projects.
 * Returns a function that stops both servers.
 */
export async function startDirectus() {
  const { PUBLIC_URL, LICENSE_API_URL } = process.env;

  const licenseServer =
    $`node --input-type=module -e ${"import('@directus/mock-license-server').then((m) => m.startServer())"}`
      .quiet()
      .nothrow();
  await retry(20, '500ms', () => fetch(`${LICENSE_API_URL}/health`));

  const directusServer = $`npx directus start`.nothrow();
  await spinner('Wait for server', () =>
    retry(20, '1s', () => fetch(`${PUBLIC_URL}/server/ping`)),
  );

  return async () => {
    directusServer.kill('SIGINT');
    licenseServer.kill('SIGINT');
    await Promise.all([directusServer, licenseServer]);
  };
}
