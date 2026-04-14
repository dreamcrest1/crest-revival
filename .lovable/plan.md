

## Deploying Your Site to cPanel via GitHub

Here's the complete step-by-step process:

### Step 1: Connect Lovable to GitHub
1. In the Lovable editor sidebar, click **Connectors** (root level)
2. Click **GitHub → Connect project**
3. Authorize the Lovable GitHub App when prompted
4. Select your GitHub account
5. Click **Create Repository** — this creates a new repo with all your code

From this point, every change you make in Lovable auto-pushes to GitHub.

### Step 2: Build the Project
Since your site is a Vite/React app, it needs to be **built** into static files before hosting:

1. Clone the repo locally: `git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git`
2. Install dependencies: `npm install`
3. Create a `.env` file with your environment variables (copy from Lovable's `.env`)
4. Build: `npm run build`
5. This creates a `dist/` folder with all static files

### Step 3: Configure for cPanel SPA Routing
Create an `.htaccess` file inside the `dist/` folder:
```text
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```
This ensures all routes (e.g., `/about`, `/products`) load correctly instead of showing 404.

### Step 4: Upload to cPanel (MilesWeb)
1. Log into your **cPanel** on MilesWeb
2. Open **File Manager**
3. Navigate to `public_html/` (or the subdomain folder for your domain)
4. **Delete** existing files if replacing an old site
5. **Upload** the entire contents of the `dist/` folder (not the folder itself — the files inside it)
6. Make sure `index.html` is at the root of `public_html/`

### Step 5: Point Your Domain
If `dreamcrest.net` isn't already pointing to MilesWeb:
1. In your domain registrar, set nameservers to MilesWeb's nameservers
2. Or add an **A record** pointing to your MilesWeb server IP
3. In cPanel, ensure the domain is added under **Domains** or **Addon Domains**

### Step 6: Enable SSL
1. In cPanel, go to **SSL/TLS** or **Let's Encrypt**
2. Issue a free SSL certificate for your domain
3. Force HTTPS redirect

### Alternative: Automated Deploys
For automatic deployment on every push, you can set up **GitHub Actions**:
- Add a workflow that runs `npm run build` and FTPs the `dist/` folder to your cPanel using an action like `SamKirkland/FTP-Deploy-Action`

### Summary
```text
Lovable → GitHub (auto-sync)
GitHub → Local clone → npm run build → dist/
dist/ + .htaccess → Upload to cPanel public_html/
```

No code changes are needed for this — it's all configuration and deployment steps.

