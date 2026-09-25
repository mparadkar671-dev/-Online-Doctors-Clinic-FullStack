# MediPulse Clinic Pro - CI/CD Pipeline & Free Cloud Deployment Guide

Welcome! This guide explains how your GitHub Actions **CI/CD Pipeline** works, how to deploy both the Frontend and Backend to **100% Free Cloud Hosting**, and how mobile users can install and use it as a **Native Mobile App (PWA)**.

---

## 1. Understanding Your CI/CD Pipeline (GitHub Actions)

### What is CI/CD?
- **CI (Continuous Integration)**: Every time you push code to GitHub (`git push origin main`), an automated server in the cloud (GitHub Runner) downloads your code, installs dependencies, compiles your code, and runs tests to ensure nothing is broken.
- **CD (Continuous Deployment)**: Once CI passes, CD automatically deploys the built code to your live production hosting without any manual intervention.

### How `.github/workflows/ci-cd.yml` Works Step-by-Step:
Your workflow file is located at [`.github/workflows/ci-cd.yml`](file:///c:/Projects/-Online-Doctors-Clinic-FullStack/.github/workflows/ci-cd.yml).

1. **Triggers (`on:`)**:
   ```yaml
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   ```
   *Whenever new code is pushed to `main` or a pull request is opened, GitHub starts the pipeline automatically.*

2. **Job 1: Backend CI (`backend-ci`)**:
   - **Virtual Machine**: Runs on a clean cloud Ubuntu server (`ubuntu-latest`).
   - **Java 21 Setup**: Installs Eclipse Temurin JDK 21 and caches Maven dependencies to speed up future builds.
   - **Maven Build**: Executes `./mvnw clean package -DskipTests` to compile the Java code into a standalone `.jar` file.
   - **Artifact Upload**: Saves the compiled `.jar` file inside GitHub Actions so you can download and run it anywhere.

3. **Job 2: Frontend CI (`frontend-ci`)**:
   - **Virtual Machine**: Runs on Ubuntu with Node.js 20.
   - **NPM Install**: Runs `npm install --legacy-peer-deps` using GitHub's npm cache.
   - **Production Build**: Runs `npm run build` which bundles, minifies, and optimizes your React code for high-performance delivery.
   - **Artifact Upload**: Archives the `build/` folder as a deployable artifact.

4. **Job 3: Deploy Stage (`deploy`)**:
   - Runs only after both `backend-ci` and `frontend-ci` succeed.
   - Confirms that both full-stack components are healthy and ready for live cloud hosting.

---

## 2. Free Cloud Hosting Deployment

You can deploy this full-stack application completely free using the modern recommended architecture:

| Component | Recommended Free Host | Alternative | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend (React PWA)** | **Vercel** | Netlify / Render | 100% Free |
| **Backend (Spring Boot)** | **Render.com** (Docker) | Railway.app / Koyeb | 100% Free |
| **Database (MySQL)** | **Aiven.io** / **Clever Cloud** | Railway / TiDB Cloud | 100% Free |

---

### Step A: Deploy Free MySQL Database
1. Go to [Aiven.io](https://aiven.io) or [Clever Cloud](https://www.clever-cloud.com) and create a **Free MySQL** service.
2. Note your connection details:
   - Host (e.g. `mysql-xyz.aivencloud.com`)
   - Port (e.g. `3306`)
   - Database name (`doctors_clinic`)
   - User (`avnadmin` or `root`)
   - Password

---

### Step B: Deploy Backend to Render.com (Free)
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your repository: `mparadkar671-dev/-Online-Doctors-Clinic-FullStack`.
4. Configure:
   - **Root Directory**: `OnlineDoctorsClinic`
   - **Environment**: `Docker` (Render will automatically detect your `Dockerfile`)
   - **Instance Type**: `Free`
5. In **Environment Variables**, add:
   - `DB_URL`: `jdbc:mysql://YOUR_DB_HOST:3306/doctors_clinic?sslMode=REQUIRED`
   - `DB_USERNAME`: your database username
   - `DB_PASSWORD`: your database password
   - `MAIL_USERNAME`: `mparadkar671@gmail.com`
   - `MAIL_PASSWORD`: `jwrhwaaiccaejvjs`
6. Click **Create Web Service**.
7. Render will build your Docker container and give you a public URL: `https://your-clinic-backend.onrender.com`.

---

### Step C: Deploy Frontend to Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Select `mparadkar671-dev/-Online-Doctors-Clinic-FullStack`.
4. Configure:
   - **Root Directory**: Click *Edit* and select `clinic-frontend`.
   - **Framework Preset**: `Create React App`
5. In **Environment Variables**, add:
   - `REACT_APP_API_BASE_URL`: `https://your-clinic-backend.onrender.com` (your Render backend URL from Step B)
6. Click **Deploy**.
7. Your app is live with a free global HTTPS URL (e.g. `https://online-doctors-clinic.vercel.app`)!

---

## 3. How to Use as a Mobile App (PWA)

Your web application has been converted into a **Progressive Web App (PWA)** with native touch features and an offline service worker.

### On Android (Chrome, Edge, Samsung Internet):
1. Open the website on your phone.
2. An **"Install MediPulse Clinic Pro"** banner will automatically appear at the top.
3. Tap **Install** (or tap the 3 dots **⋮** -> **"Install app"** / **"Add to Home screen"**).
4. The app icon will appear on your phone's home screen.
5. Opening the app launches it in **full-screen standalone mode** (without any browser address bar), complete with the bottom navigation bar!

### On iOS (iPhone / iPad - Safari):
1. Open the website in **Safari**.
2. Tap the **Share** button (**⎙**) at the bottom.
3. Scroll down and tap **"Add to Home Screen"** (**➕**).
4. Tap **Add**.
5. The MediPulse Pro icon will appear on your iPhone home screen and launch like a native iOS app!

---

## 4. Local Deployment with Docker (One-Click)

To run the entire full stack (MySQL + Backend + Frontend) locally with one command:
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`
