const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4173);
const frontendRoot = path.resolve(__dirname, "../frontend");

const resumeProfiles = {
  frontend: {
    score: 82,
    candidate: "Aarav Sharma",
    role: "Frontend Engineer",
    roleMatch: "Strong for Frontend Engineer",
    matchStatus: "Good",
    summary: "Good foundation. Three changes can make it more convincing for frontend roles."
  },
  analyst: {
    score: 74,
    candidate: "Riya Mehta",
    role: "Data Analyst",
    roleMatch: "Developing for Data Analyst",
    matchStatus: "Review",
    summary: "The analytical foundation is clear. Sharpen the headline and add more measurable outcomes."
  }
};

const chatReplies = [
  ["what should i do next", "Your best next step is the 25-minute Graphs warm-up. It targets your biggest gap."],
  ["why are graphs a priority", "Graphs are at 48% accuracy across your recent attempts, so they offer the biggest readiness lift."],
  ["how do i prep for interviews", "Use a simple three-part answer: context, your action, and the result."]
];

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 100_000) req.destroy(new Error("Request too large"));
    });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

function contentType(filePath) {
  return {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".pdf": "application/pdf"
  }[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function serveFrontend(req, res, urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.resolve(frontendRoot, `.${requested}`);
  if (!filePath.startsWith(frontendRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health" && req.method === "GET") {
    sendJson(res, 200, { ok: true, service: "careerpilot-fake-backend", mode: "mock" });
    return;
  }

  if (url.pathname === "/api/profile" && req.method === "GET") {
    sendJson(res, 200, { firstName: "Aarav", lastName: "Sharma", role: "Frontend Engineer", graduationYear: "2027", cgpa: "8.6" });
    return;
  }

  if (url.pathname === "/api/resume/analyze" && req.method === "POST") {
    try {
      const input = await readJson(req);
      const fileName = String(input.fileName || "");
      const profileKey = /analyst|data|riya|mehta/i.test(fileName) ? "analyst" : "frontend";
      sendJson(res, 200, { fileName, profileKey, profile: resumeProfiles[profileKey], demo: true });
    } catch (error) {
      sendJson(res, 400, { error: "Send a JSON body with fileName." });
    }
    return;
  }

  if (url.pathname === "/api/chat" && req.method === "POST") {
    try {
      const input = await readJson(req);
      const question = String(input.message || "").toLowerCase();
      const match = chatReplies.find(([key]) => question.includes(key));
      sendJson(res, 200, { answer: match ? match[1] : "Start with a 25-minute focused block. Graphs and interview storytelling are the best next moves.", demo: true });
    } catch (error) {
      sendJson(res, 400, { error: "Send a JSON body with message." });
    }
    return;
  }

  serveFrontend(req, res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`CareerPilot fake backend running at http://localhost:${PORT}`);
});
