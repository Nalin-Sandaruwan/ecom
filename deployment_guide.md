# 🚀 Hostinger Node.js Deployment Guide

This guide contains the exact settings, commands, and environment variables required to deploy the **Frontend (Next.js)** and **Backend (Express API)** on Hostinger Node.js hosting.

---

## 🌐 Architecture Overview
Since this is a monorepo, both applications are in the same repository. You will create **two separate Node.js applications** in Hostinger, pointing to the same GitHub repository: `https://github.com/Nalin-Sandaruwan/ecom.git`

1. **Frontend Website** (e.g., `chillebazzar.com` or `play.chillebazzar.com`)
2. **Backend Website** (e.g., `api.chillebazzar.com`)

---

## 🎨 1. Frontend (Next.js) Settings
This deploys the user interface (`apps/user-front`).

### Hostinger Configuration:
| Field | Value | Rationale |
| :--- | :--- | :--- |
| **Package Manager** | `npm` | Use default npm workspaces |
| **Build Command** | `npm run build` | Compiles both the backend and frontend |
| **Output Directory** | *(Leave empty)* | Keeps the repository structure intact |
| **Entry File** | `apps/user-front/.next/standalone/apps/user-front/server.js` | The compiled Next.js standalone Node server |

### Environment Variables (Frontend):
Add this in the Hostinger Environment settings:
* **`NEXT_PUBLIC_API_URL`**: `https://api.yourdomain.com/api/v1` *(Replace with your actual backend URL)*
* **`NEXT_IGNORE_INCORRECT_LOCKFILE`**: `true`
* **`PORT`**: `3000` *(Or leave default as Hostinger will manage the port)*

> [!NOTE]
> Next.js is configured in `output: "standalone"` mode. This copies only the necessary files and dependencies into a self-contained server at `.next/standalone`, making execution extremely fast and saving RAM on Hostinger.

---

## ⚙️ 2. Backend (Express API) Settings
This deploys the database-connected Express backend (`apps/api`).

### Hostinger Configuration:
| Field | Value | Rationale |
| :--- | :--- | :--- |
| **Package Manager** | `npm` | Use default npm workspaces |
| **Build Command** | `npm run build` | Compiles the typescript files to Javascript |
| **Output Directory** | *(Leave empty)* | Keeps the repository structure intact |
| **Entry File** | `apps/api/dist/index.js` | The compiled backend entry file |

### Environment Variables (Backend):
You **MUST** add these in Hostinger's Environment variables manager for the backend to connect and run:

| Variable Name | Example / Production Value |
| :--- | :--- |
| **`NODE_ENV`** | `production` |
| **`PORT`** | `5000` |
| **`MONGO_URI`** | `mongodb+srv://<username>:<password>@cluster.mongodb.net/chillebazzar?retryWrites=true&w=majority` *(Update to your production MongoDB URI)* |
| **`CLIENT_URL`** | `https://yourdomain.com` *(Your frontend website URL)* |
| **`ACCESS_TOKEN_SECRET`** | `your_super_secret_access_key` *(Generate a strong secure key)* |
| **`ACCESS_TOKEN_EXPIRES_IN`** | `1h` |
| **`REFRESH_TOKEN_SECRET`** | `your_super_secret_refresh_key` *(Generate a strong secure key)* |
| **`REFRESH_TOKEN_EXPIRES_IN`** | `7d` |
| **`CLOUDINARY_CLOUD_NAME`** | `dm9dsm2ri` |
| **`CLOUDINARY_API_KEY`** | `228288825292669` |
| **`CLOUDINARY_API_SECRET`** | `S3EzCOVhj1lP94Bsolzmsj3vPMs` |
| **`STRIPE_SECRET_KEY`** | `sk_test_51TNEu...` *(Your production/test Stripe key)* |
| **`STRIPE_WEBHOOK_SECRET`** | `whsec_...` *(Your Stripe webhook key)* |
| **`EMAIL_USER`** | `"nalinrox125@gmail.com"` |
| **`EMAIL_PASS`** | `"hysm sctq nkas ufat"` |
| **`EMAIL_HOST`** | `"smtp.gmail.com"` |
| **`EMAIL_PORT`** | `587` |
| **`EMAIL_FROM`** | `"nalinrox125@gmail.com"` |

---

## 🛠️ Step-by-Step Deployment Steps:
1. **Prepare the Backend Subdomain** on Hostinger (e.g. `api.yourdomain.com`) as a Node.js website.
2. Link it to GitHub, paste the **Backend Configuration** above, add the backend **Environment Variables**, and click **Finish / Deploy**.
3. **Prepare the Main Domain** on Hostinger (e.g. `yourdomain.com`) as a Node.js website.
4. Link it to GitHub, paste the **Frontend Configuration** above, add `NEXT_PUBLIC_API_URL` pointing to your backend subdomain, and click **Finish / Deploy**.
