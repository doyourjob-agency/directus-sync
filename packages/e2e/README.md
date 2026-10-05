# End-to-End Tests

Run black-box tests on a running instance of Directus.

## Pre-requisites

The tests are running Directus instance in the host machine.
Therefore, you need to have a the dependencies installed in the host machine.

You must install the following libraries:

- `libvips`: `sudo apt install libvips` (https://libvips.github.io/libvips/install.html)

## Running the tests

First, you need to build the CLI and the extension. Go to the root of the repository and run:

```bash
npm run build
```

Then, you can run the tests:

```bash
npm run test
```

If you have edited the extension or the CLI, you need to rebuild them.

### License

Directus 12 requires a license for some features used by the tests (e.g. custom permission rules).
The tests start Directus' mock license server (`@directus/mock-license-server`) and activate its unlimited key.
See the `LICENSE_*` and `NODE_ENV` variables in `.env`.

### Running a single test

By design, the tests are ran sequentially. This is done to avoid conflicts between Directus servers.

To run a single test, you need to edit the test file and change the `it` function to `fit`.
