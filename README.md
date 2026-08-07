# ARG Anchor

> *"Describe what you want to build. We'll organize the details, secure the architecture, and ensure your progress is never lost."*

---

## What is ARG?

**ARG** (Autonomous Reconstruction Group) is an intelligent, self-guided workspace designed to help you build software safely and easily.

Building apps often comes with messy setup files, sudden bugs, or lost work when something goes wrong. ARG solves this by acting as a smart project manager and safety net:
* **You focus on your ideas:** Just tell ARG what you want to build.
* **ARG handles the structure:** It breaks your goal down into clear blueprints, writes clean code, and checks for potential bugs automatically.
* **Your progress is safe:** Every action is automatically saved in a continuous ledger, so you can restore or roll back your project at any time.

---

## Key Features in Simple Terms

### 1. Simple Mode vs. Detailed Mode
* **Operator Mode (Default):** A clean, clutter-free screen where you can focus on your goals without being distracted by technical code background noise.
* **Builder Mode:** A detailed view for developers who want to inspect safety rules, check live system metrics, and customize system settings.

### 2. Automatic Safety Checks & Rules
ARG automatically runs your project through **9 Core Engineering Rules** (Mandates) to make sure your code stays fast, secure, and well-organized—preventing crashes before they happen.

### 3. Automatic Backups & Recovery
Never worry about losing your work. ARG logs every change to a secure history timeline. If an update breaks something, you can restore your workspace to any previous point with a single click.

### 4. 100% Portable (Runs Anywhere)
ARG doesn't lock you into a proprietary cloud server. You can download your project and run it anywhere—on your own laptop, in a Docker container, or hosted on your own server.

---

## How ARG Works (The 6 Simple Steps)

1. **Intake (Step 0):** You enter what you want to build or achieve.
2. **Scoping (Step 1):** ARG asks a few clear questions to make sure it understands your goals and constraints.
3. **Planning (Step 2):** A step-by-step execution blueprint is created.
4. **Execution (Step 3):** ARG builds the project features step-by-step.
5. **Verification (Step 4):** ARG checks the final result with one fundamental question: *"Did we actually achieve what you wanted?"*
6. **Workspace (Step 5):** Your project is live, verified, and ready for you to use or expand!

---

## How to Run ARG on Your Own Computer

You can easily run ARG locally or host it on your own server.

### Option 1: Run Locally (Node.js)

1. **Download/Clone** the project files to your computer.
2. Open your terminal in the project folder and install dependencies:
   ```bash
   npm install
   ```
3. Start the app in development mode:
   ```bash
   npm run dev
   ```
4. Open your web browser and go to `http://localhost:3000`.

To build for production:
```bash
npm run build
npm run start
```

---

### Option 2: Run with Docker

If you prefer using Docker, you can containerize and launch ARG with this simple setup:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## Project Governance & Legal Docs

For a deep dive into the official rules and guidelines powering ARG:
* **[ACR.md](./ACR.md):** Architectural Law & Safety Boundaries.
* **[AOC.md](./AOC.md):** Operational Constitution (AOC v1.0 RC2) — Rules for workflows, state management, and user experience.
* **[ARS.md](./ARS.md):** Architectural Runtime Specifications & Technical Details.

---

## Credits

* **Primary Creator & Operator:** Kelsea Ziegler ([kelseaziegler@gmail.com](mailto:kelseaziegler@gmail.com))
* **Co-Architect Partner:** Google Gemini
* **Status:** Operational Constitution v1.0 RC2
