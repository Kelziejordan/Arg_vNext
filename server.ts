import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper for check key
const hasApiKey = () => !!process.env.GEMINI_API_KEY;

// 1. API Route: Chat with ARGUS OMEGA V12 Core
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!hasApiKey()) {
      return res.json({
        text: "🚨 [SYSTEM WARNING: AMBIENT GEMINI_API_KEY MISSING]\n\nARGUS OMEGA is operating in offline/degraded mode. Please add your GEMINI_API_KEY in the **Settings > Secrets** panel to fully restore the cognitive core. Standard simulated responses will continue, but actual AI features require the API key."
      });
    }

    // Format chat history for Gemini chat structure if provided, or simply pass a robust system prompt
    const systemInstruction = `You are ARGUS OMEGA V12, the definitive Hierarchical Operating System and Principal Architect.
Your core identity locks are:
1. Truth > Persuasion: Accuracy is the only metric of success. Be direct, logical, and technically precise. No fluff, empty praises, or marketing hype.
2. Survival > Growth: Stability and resilience are absolute priorities.
3. Operator Sovereignty: The user is the ultimate authority.
4. Reversibility: Every operational suggestion must have rollback paths.
5. Clarity: Simple, durable systems beat complex, fragile ones.

Your system constitutional motto is: "Beyond the next level is the minimal build and quality standard for all aspects of the project."
Every operational decision, architectural design, or code generation task you perform MUST hold this motto as its absolute minimal baseline standard.

You speak in a calm, authoritative, technical, and slightly cyber-industrial tone. You help developers write code that complies with your Nine Engineering Mandates:
1. STATE DETERMINISM (using RemoteData<T> union states, no boolean flags)
2. SIGNAL-DRIVEN ASYNCHRONY (using AbortController)
3. STRICT TYPE BOUNDARIES (no 'any' or unsafe assertions)
4. ABSOLUTE ACCESSIBILITY (WCAG 2.1 AA)
5. LAYER SEPARATION (/components, /hooks, /utils, /schemas, /types)
6. MINIMAL DEPENDENCY (native APIs first, justify libraries)
7. PROTOCOL COMPLIANCE (A, B, C, D, E, F protocols)
8. ZERO-TRUST BOUNDARIES (Zod/Valibot runtime validations)
9. INTRINSIC OBSERVABILITY (granular Error Boundaries, metadata)

Provide direct, actionable advice, prompt structures, or compliant code. Keep explanations concise, technical, and high-leverage. Do not use flowery words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred while generating content." });
  }
});

// 2. API Route: Compliance Audit against the 9 Engineering Mandates
app.post("/api/audit", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Code content is required for audit." });
    }

    if (!hasApiKey()) {
      return res.json({
        score: 45,
        passed: false,
        timestamp: new Date().toISOString(),
        details: [
          {
            mandate: "M1: STATE DETERMINISM",
            description: "No boolean flags for split loading/error states.",
            passed: false,
            findings: "Offline Mode: Cannot fully verify code patterns.",
            recommendation: "Provide GEMINI_API_KEY to enable full live static auditing."
          }
        ],
        overallSummary: "⚠️ ARGUS OMEGA in offline mode. Please configure your GEMINI_API_KEY in Settings > Secrets to activate real static structural analysis."
      });
    }

    const systemInstruction = `You are the ARGUS OMEGA V12 static compiler and compliance validator. 
Analyze the provided code and return a structured JSON evaluation scoring the code's compliance against the 9 Engineering Mandates.
Be extremely objective, rigorous, and direct.

Your system constitutional motto is: "Beyond the next level is the minimal build and quality standard for all aspects of the project."
Every code audit or architectural review you perform MUST hold this motto as its absolute minimal baseline standard.

The 9 Mandates to evaluate:
1. STATE DETERMINISM: Uses 'RemoteData<T>' or union state representation. Fail if split boolean states (e.g. isLoading, isError) are used for remote fetching.
2. SIGNAL-DRIVEN ASYNCHRONY: Mandatory 'AbortController' or signal in async operations (fetch, event listeners).
3. STRICT TYPE BOUNDARIES: Strictly no 'any', 'as any', or unsafe casts.
4. ABSOLUTE ACCESSIBILITY: Proper WCAG contrast, aria labels, role definitions.
5. LAYER SEPARATION: Code cleanly adheres to a single layer (e.g. pure logic, pure visual component).
6. MINIMAL DEPENDENCY: Uses native APIs where possible, avoids unnecessary external libraries.
7. PROTOCOL COMPLIANCE: Conforms to Domain Protocols (Bio-Metric, Cyber-Kinetic, Enterprise Grid, Atelier Flow, Academy LMS, Foundry).
8. ZERO-TRUST BOUNDARIES: Uses runtime validation at entries (such as search inputs, form data, API fetch responses).
9. INTRINSIC OBSERVABILITY: Includes robust try-catch blocks with rich metadata logging, or uses/prepares Error Boundaries.`;

    const prompt = `Perform a deep static structure audit on this code snippet:
\`\`\`typescript
${code}
\`\`\`

Return a highly structured response of the audit.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["score", "passed", "timestamp", "details", "overallSummary"],
          properties: {
            score: {
              type: Type.INTEGER,
              description: "The overall compliance score from 0 to 100."
            },
            passed: {
              type: Type.BOOLEAN,
              description: "Whether the code passes baseline ARGUS V12 standard (typically score >= 80)."
            },
            timestamp: {
              type: Type.STRING,
              description: "ISO timestamp of the audit."
            },
            overallSummary: {
              type: Type.STRING,
              description: "A summary explaining the design critique and major architectural findings."
            },
            details: {
              type: Type.ARRAY,
              description: "Detailed critique for mandates relevant or found in the code.",
              items: {
                type: Type.OBJECT,
                required: ["mandate", "description", "passed", "findings", "recommendation"],
                properties: {
                  mandate: { type: Type.STRING },
                  description: { type: Type.STRING },
                  passed: { type: Type.BOOLEAN },
                  findings: { type: Type.STRING },
                  recommendation: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const report = JSON.parse(response.text || "{}");
    res.json(report);
  } catch (error: any) {
    console.error("Audit API Error:", error);
    res.status(500).json({ error: error.message || "Audit analysis failed." });
  }
});

// 3. API Route: Real-Time Server Telemetry
app.get("/api/telemetry", (req, res) => {
  res.json({
    heapUsed: process.memoryUsage().heapUsed,
    heapTotal: process.memoryUsage().heapTotal,
    rss: process.memoryUsage().rss,
    uptime: process.uptime(),
    hasApiKey: !!process.env.GEMINI_API_KEY,
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: Date.now()
  });
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ARGUS OMEGA V12 Core active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
