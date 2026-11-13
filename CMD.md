# CMD.md --- Commands to Build and Run the Project

This file contains the terminal commands for setting up, running,
checking, and deploying the KPaisa Flight Seat Selection project.

Commands below assume **Node.js and npm** are installed.

## 1. Check Node.js and npm

``` bash
node -v
npm -v
```

Use a current supported Node.js LTS version.

## 2. Create the React + Vite project

Run these commands in the directory where you want the project:

``` bash
npm create vite@latest kpaisa-flight-seat-selection -- --template react
cd kpaisa-flight-seat-selection
npm install
```

## 3. Install optional icon package

``` bash
npm install lucide-react
```

No backend, database, or API package is required.

## 4. Start the development server

``` bash
npm run dev
```

Open the local URL printed in the terminal (normally
`http://localhost:5173`).

Stop the server with:

``` bash
Ctrl + C
```

## 5. Create the suggested folders

Run from the project root.

### Windows PowerShell

``` powershell
New-Item -ItemType Directory -Force src/components, src/data, src/hooks, src/utils, src/styles
New-Item -ItemType File -Force AGENT.md, CMD.md, README.md
```

### macOS / Linux / Git Bash

``` bash
mkdir -p src/components src/data src/hooks src/utils src/styles
touch AGENT.md CMD.md README.md
```

If the files already exist, do not overwrite them just to create the
folders.

## 6. Run the production build

``` bash
npm run build
```

Vite writes the production build to the `dist/` directory.

## 7. Preview the production build locally

Run the build first, then:

``` bash
npm run preview
```

Open the preview URL printed in the terminal. Stop it with `Ctrl + C`.

## 8. Check the project before committing

``` bash
npm run build
git status
```

If linting is configured in the project, also run:

``` bash
npm run lint
```

If the project does not have a `lint` script, do not expect that command
to work; check the available scripts in `package.json`.

## 9. Initialize Git and make the first commit

If Git has not already been initialized:

``` bash
git init
git add .
git commit -m "Initial flight seat selection implementation"
```

Create an empty repository on GitHub, then connect it. Replace the
placeholder with your actual repository URL:

``` bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/kpaisa-flight-seat-selection.git
git push -u origin main
```

If `origin` is already configured, inspect it instead of adding it
again:

``` bash
git remote -v
```

For later updates:

``` bash
git add .
git commit -m "Complete seat selection and pricing flow"
git push
```

## 10. Deploy to Vercel

Option A --- Vercel CLI:

``` bash
npm install -g vercel
vercel
```

Follow the prompts to link and deploy the project.

For a production deployment:

``` bash
vercel --prod
```

Option B --- Vercel website: 1. Push the project to GitHub. 2. Sign in
to Vercel. 3. Import the GitHub repository. 4. Keep the Vite defaults: -
Framework preset: Vite - Build command: `npm run build` - Output
directory: `dist` - Install command: `npm install` 5. Deploy and open
the generated URL.

## 11. Useful troubleshooting commands

Reinstall dependencies if the install is incomplete:

``` bash
npm install
```

If dependencies are badly out of sync, remove the installed dependency
folder and reinstall.

### Windows PowerShell

``` powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### macOS / Linux / Git Bash

``` bash
rm -rf node_modules
npm install
```

Check the available npm scripts:

``` bash
npm run
```

Check the Git remote:

``` bash
git remote -v
```

Check the working tree:

``` bash
git status
```

## 12. Final submission checklist

``` text
[ ] npm run dev works locally
[ ] npm run build completes successfully
[ ] Both 3-2 and 2-3-2 layouts work
[ ] Passenger switching preserves assignments
[ ] Duplicate seat assignment is prevented
[ ] Seat change and removal work
[ ] Total recalculates correctly
[ ] Mobile and desktop layouts are checked
[ ] README includes setup and logic explanations
[ ] GitHub repository is pushed and accessible
[ ] Vercel deployment is live
[ ] Live URL is tested in an incognito/private window
[ ] Assessment email reply includes GitHub and live demo links
```

**Assessment deadline:** 18 November 2026, 11:59 PM IST.
