# OBS Extension

This is a VSCode Extension for viewing and editing Open Bible Stories (OBS). This extension uses a custom editor and...
<!-- TODO: MORE INFO -->

<!-- TODO: SCREENSHOT ![A screenshot of the sample extension]() -->

## Documentation

For a deeper dive into how this sample works, read the guides below.

- [Extension structure](./docs/extension-structure.md)
- [Extension commands](./docs/extension-commands.md)
- [Extension development cycle](./docs/extension-development-cycle.md)

## Run The Sample
Follow the following steps to see the OBS extension in action. Replace the `npm` with any package manager of your choice. The extension was developed with the `pnpm` package manager, so scripts in the `package.json` file will favor pnpm. 

```bash

# Install dependencies for both the extension and webview UI source code
pnpm run install:all

# Build webview UI source code
pnpm run build:webview

# Open sample in VS Code
code .
```

Once the sample is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window
2. Inside the host window, open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and type `OBS: Show`
