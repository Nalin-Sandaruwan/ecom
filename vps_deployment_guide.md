# 🚀 Production Hostinger VPS Deployment Guide (CI/CD)

This guide provides the complete, step-by-step instructions to deploy your **Next.js Frontend** and **Express.js API** monorepo to a **Hostinger VPS (Ubuntu)** with automated CI/CD using **GitHub Actions**, **PM2**, and **Nginx Reverse Proxy**.

---

## 📐 Architecture Diagram & Overview

When code is pushed to your `main` branch, **GitHub Actions** will compile your Next.js and Express apps, bundle them, and securely sync them to your VPS. **Nginx** will route incoming traffic to the appropriate application, and **PM2** will keep both services running 24/7.

```mermaid
graph TD
    User([🌐 Web User]) -->|HTTPS: 443| Nginx[🔒 Nginx Reverse Proxy]
    Nginx -->|Proxy: Port 3000| NextJS[🎨 Next.js Frontend (PM2)]
    Nginx -->|Proxy: Port 5000| ExpressAPI[⚙️ Express Backend API (PM2)]
    
    GitHub[🐙 GitHub Repository] -->|Push main| GH_Action[🤖 GitHub Actions Runner]
    GH_Action -->|1. Install & Build| GH_Action
    GH_Action -->|2. Rsync via SSH| VPS[🖥️ Hostinger VPS]
    VPS -->|3. PM2 Graceful Restart| NextJS
    VPS -->|3. PM2 Graceful Restart| ExpressAPI
```

---

## 🛠️ Step 1: Hostinger VPS Initial Server Prep

Connect to your Hostinger VPS via SSH as `root` (or a sudo user):

```bash
ssh root@YOUR_VPS_IP
```

Run the following commands to update the system and install **Node.js 20**, **Nginx**, **Git**, and **Certbot (SSL)**:

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Verify installations
node -v  # Should be v20.x
npm -v   # Verify npm is installed

# 4. Install PM2 (Process Manager) globally
sudo npm install -g pm2

# 5. Install Nginx and Git
sudo apt install nginx git rsync -y

# 6. Create the deployment directory and adjust permissions
sudo mkdir -p /var/www/woodengallery
sudo chown -R $USER:$USER /var/www/woodengallery
```

---

## 🔑 Step 2: Configure SSH Authentication for GitHub Actions

To allow GitHub Actions to securely copy files to your VPS, you need to generate a new SSH Key Pair.

### 1. Generate SSH Key on your VPS:
On your **VPS** (logged in as root/sudo user), run:
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_deploy -N ""
```

### 2. Authorize the Key:
Add the newly generated public key to your VPS's `authorized_keys` file:
```bash
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. Retrieve the Private Key:
Print your private key. **Copy the entire output** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`):
```bash
cat ~/.ssh/github_actions_deploy
```

### 4. Save Secrets in GitHub:
Go to your GitHub repository: **Settings** ➡️ **Secrets and variables** ➡️ **Actions** ➡️ **New repository secret** and add these three secrets:

| Secret Name | Value |
| :--- | :--- |
| **`VPS_SSH_KEY`** | *Paste the entire private key copied in Step 3* |
| **`VPS_IP`** | `YOUR_VPS_PUBLIC_IP_ADDRESS` |
| **`VPS_USER`** | `root` (or the user you logged in as) |

---

## ⚙️ Step 3: Set Up Production Environment Variables (`.env`)

For security, your database URLs and API keys should **never** be committed to Git. Instead, create them directly on the VPS.

### 1. Backend Environment Variables
Create the directory and the backend `.env` file on your VPS:
```bash
mkdir -p /var/www/woodengallery/apps/api
nano /var/www/woodengallery/apps/api/.env
```
Paste and fill out your production configurations:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://your_production_mongo_uri
CLIENT_URL=https://woodengallery.studio
ACCESS_TOKEN_SECRET=generate_a_very_strong_random_secret_string
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=generate_another_very_strong_random_secret_string
REFRESH_TOKEN_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=your_email@gmail.com
```
*Press `CTRL + O` to save and `CTRL + X` to exit.*

### 2. Frontend Environment Variables
Create the directory and the frontend `.env` file:
```bash
mkdir -p /var/www/woodengallery/apps/user-front
nano /var/www/woodengallery/apps/user-front/.env
```
Paste and configure:
```env
PORT=3000
NEXT_PUBLIC_API_URL=https://api.woodengallery.studio/api/v1
```
*Press `CTRL + O` to save and `CTRL + X` to exit.*

---

## 🔒 Step 4: Configure Nginx & SSL

We will configure Nginx to route `woodengallery.studio` to Next.js (port `3000`) and `api.woodengallery.studio` to the Express API (port `5000`).

### 1. Create Nginx Configuration:
```bash
sudo nano /etc/nginx/sites-available/woodengallery
```

Paste the following configuration:

```nginx
# --- FRONTEND WEBSERVER (PORT 3000) ---
server {
    listen 80;
    server_name woodengallery.studio www.woodengallery.studio;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# --- BACKEND API WEBSERVER (PORT 5000) ---
server {
    listen 80;
    server_name api.woodengallery.studio;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable Configuration & Restart Nginx:
```bash
# Link the configuration to sites-enabled
sudo ln -s /etc/nginx/sites-available/woodengallery /etc/nginx/sites-enabled/

# Test Nginx syntax
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 3. Install SSL Certificates (HTTPS):
Hostinger VPS has open standard ports. Secure both your frontend and API domains using free Let's Encrypt certificates:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d woodengallery.studio -d www.woodengallery.studio -d api.woodengallery.studio
```
*Follow the on-screen prompts to configure SSL redirection automatically.*

---

## 🚀 Step 5: Trigger the First CI/CD Run

You are ready! Let's commit and push the CI/CD files to trigger the GitHub Actions workflow.

```bash
git add .
git commit -m "feat: setup GitHub Actions CI/CD and PM2 configurations for VPS"
git push origin main
```

Monitor your deployment progress on your GitHub repository page under the **Actions** tab.

---

## 🔄 Step 6: Initialize PM2 (First-Time Only)

Once the GitHub Action completes successfully, it will have synced all build artifacts onto the VPS at `/var/www/woodengallery` and run `npm ci --omit=dev`. 

For the **first-time deployment only**, you must manually start the PM2 apps:

```bash
# SSH back into the VPS
ssh root@YOUR_VPS_IP

# Navigate to application root
cd /var/www/woodengallery

# Start both applications using our ecosystem.config.js
pm2 start ecosystem.config.js

# Save the PM2 list so they restart automatically if the VPS server reboots
pm2 save
sudo pm2 startup
```

> [!TIP]
> From now on, whenever you push to the `main` branch, GitHub Actions will compile, sync, and reload your apps **automatically without any manual intervention!**

---

## 📊 Pro PM2 Monitoring Commands

You can monitor, log, and control your servers using these simple commands on your VPS:

| Command | Description |
| :--- | :--- |
| **`pm2 status`** / **`pm2 list`** | Check if your frontend and backend apps are online |
| **`pm2 logs`** | View live consolidated logs of both applications |
| **`pm2 logs woodengallery-backend`** | View live logs only for the backend API |
| **`pm2 logs woodengallery-frontend`** | View live logs only for the frontend Next.js |
| **`pm2 monit`** | Open a graphical, real-time dashboard inside your terminal |
| **`pm2 restart ecosystem.config.js`** | Manually force-restart both applications |
| **`pm2 stop all`** | Stop both apps |
