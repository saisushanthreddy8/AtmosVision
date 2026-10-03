# AtmosVision AI — Scientific Climate Tensor Platform

Atmospheric Tensor Analysis & HOSVD-Based Climate Data Exploration for the ECMWF ERA5 Tamil Nadu Dataset.

---

## 🐳 Option 1: Run with Docker (Recommended for Any Laptop)

Docker ensures the application runs identically on any laptop (Windows, macOS, Linux) without needing to install Node.js or configure environment dependencies.

### Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Using Docker Compose (Easiest):
```bash
# Build and start the container
docker compose up --build
```
Then open **[http://localhost:3000](http://localhost:3000)** in the browser.

To stop the container:
```bash
docker compose down
```

### 2. Using Docker CLI:
```bash
# Build the Docker image
docker build -t atmosvision-ai .

# Run the container
docker run -p 3000:3000 -d --name atmosvision-ai-app atmosvision-ai
```
Then open **[http://localhost:3000](http://localhost:3000)**.

---

## 🌐 Opening the App on Another Laptop on the Same Network (LAN / Wi-Fi)

If you are running the server or Docker container on one laptop and want someone else to open it on **their laptop** over the same Wi-Fi network:

1. **Find your local IP address**:
   - **Windows**: Open Command Prompt / PowerShell and type:
     ```powershell
     ipconfig
     ```
     Look for **IPv4 Address** (e.g. `192.168.1.45`).
   - **macOS / Linux**: Open Terminal and type:
     ```bash
     ifconfig | grep "inet "
     ```

2. **On the other laptop's browser**, navigate to:
   ```
   http://<YOUR-IP-ADDRESS>:3000
   ```
   *(Example: `http://192.168.1.45:3000`)*

> **Note for Windows Firewall**: If the page doesn't load on the other laptop, ensure Windows Defender Firewall allows incoming connections on port `3000` or allows Node.js / Docker.

---

## 💻 Option 2: Run with Node.js Locally

### Prerequisites:
- [Node.js](https://nodejs.org/) (v20+ or v22+ LTS)

### Steps:
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```

3. **Or Build and Run in Production Mode**:
   ```bash
   npm run build
   npm start
   ```

4. Open **[http://localhost:3000](http://localhost:3000)**.
