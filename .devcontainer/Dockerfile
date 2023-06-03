ARG VARIANT=20-bullseye

FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

# Ensure the included version of NPM is up-to-date.
# Install Jest to prevent errors from the VS Code test watchers
RUN npm install -g npm@latest jest@latest
