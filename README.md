# Snapod

Snapod Electron Desktop Client

Currently available on macOS and Windows

<br/>

## Version Update Workflow

1. update `package.json` both in the root directory and inside `src`
2. update the initial value of the `latestVersion` state in `src/App.tsx`
3. update version number in the backend API endpoint `/latestAppVersion`
4. repackage Snapod app
5. redeploy to AWS Elastic Beanstalk
6. upload new installers to OneDrive
