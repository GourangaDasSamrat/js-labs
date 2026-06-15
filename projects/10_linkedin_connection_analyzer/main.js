const COLORS = {
  purple: "#6c63ff",
  red: "#ff6b6b",
  green: "#43e97b",
  yellow: "#f9a825",
  teal: "#00d2d3",
  pink: "#fd79a8",
  blue: "#74b9ff",
  orange: "#e17055",
  muted: "#7b7a8e",
};

const ROLE_KEYWORDS_MAP = {
  "AI / ML": [
    "AI", "Machine Learning", "Artificial Intelligence", "LLM", "Deep Learning",
    "Computer Vision", "NLP", "Data Scien", "Prompt Engineer", "AI Engineer",
    "GenAI", "Transformer", "Neural", "RAG", "Fine.?tuning", "MLOps",
    "Researcher", "AI Researcher",
  ],
  Frontend: [
    "Frontend", "Front-end", "React", "Vue", "Angular", "UI Developer",
    "Web Developer", "Vue.js", "Next.js", "Svelte", "TypeScript", "WebAssembly",
    "Performance", "PWA", "Accessibility", "A11y", "HTML", "CSS",
  ],
  Backend: [
    "Backend", "Back-end", "Node", "Python Dev", "Java Dev", "Spring",
    "Laravel", "Django", "Rust", "Go Dev", "Golang", "Microservices",
    "GraphQL", "REST", "SQL", "NoSQL", "Distributed", "Scalability", "Database",
  ],
  "Full-stack": ["Full.?stack", "Fullstack", "MERN", "MEAN", "Polyglot"],
  DevOps: [
    "DevOps", "SRE", "Cloud Eng", "Infrastructure", "Platform Eng",
    "Site Reliability", "Cloud Architect", "Kubernetes", "K8s", "Docker",
    "Terraform", "CI\\/CD", "Infrastructure as Code",
  ],
  Mobile: [
    "Mobile", "iOS", "Android", "Flutter", "React Native", "Swift",
    "Kotlin", "Xamarin", "Jetpack", "SwiftUI", "Cross.?platform",
  ],
  Data: [
    "Data Engineer", "Data Analyst", "BI ", "Analytics", "Big Data",
    "Spark", "Hadoop", "ETL", "Data Pipeline", "Warehouse",
    "Analytics Engineer", "Data Platform",
  ],
  Manager: [
    "Manager", "Director", "Head of", "VP ", "CTO", "CEO", "Lead",
    "Principal", "Staff", "Engineering Manager", "Tech Lead", "Architect",
    "VP Engineering",
  ],
  Security: [
    "Security", "InfoSec", "Cybersecurity", "CISO", "Penetration",
    "Application Security", "Vulnerability", "Threat", "Exploit",
    "Compliance", "GDPR", "Privacy",
  ],
  Product: [
    "Product Manager", "PM", "Product Owner", "Product Lead", "CPO",
    "Strategy", "Roadmap", "Requirements",
  ],
  Design: [
    "Design", "Designer", "UX", "UI", "Product Design", "Design Lead",
    "Design System", "Prototyping", "Wireframe", "Motion", "Animation",
    "Interaction",
  ],
  QA: [
    "QA", "Quality Assurance", "Test", "Automation Test", "QA Engineer",
    "SDET", "Manual Test", "Integration", "Load Test", "Performance Test",
  ],
};

const BIGTECH_LIST = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "GitHub",
  "IBM", "Oracle", "Salesforce", "Adobe", "Atlassian", "Nvidia", "OpenAI",
  "Tesla", "X Corp", "Discord", "Stripe", "Figma", "Notion", "Uber",
  "Shopify", "Zoom", "LinkedIn", "Anthropic", "Databricks", "Canva",
  "Rippling", "Intel", "Qualcomm", "AMD", "Cisco", "Twilio", "ServiceNow",
  "Workday", "Datadog", "Elastic", "HashiCorp", "Okta", "Vercel", "Netlify",
  "Supabase", "Hugging Face", "Mistral", "Perplexity", "Asana", "Auth0",
  "PagerDuty", "Wiz", "Snyk", "Miro", "Webflow", "Broadcom", "VMware",
  "Red Hat", "Canonical", "Slack", "Telegram", "Signal", "Monday",
  "Airtable", "SAP", "NetSuite", "HubSpot", "Pipedrive", "Square", "Block",
  "PayPal", "Wise", "Revolut", "DJI", "Tableau", "Looker", "Qlik",
  "Alteryx", "Mixpanel", "Amplitude", "Segment", "Tealium", "MongoDB",
  "Splunk", "New Relic", "Dynatrace", "AppDynamics", "Sentry", "Rollbar",
  "Sumo Logic", "Tenable", "Rapid7", "CrowdStrike", "SentinelOne",
  "Zscaler", "Palo Alto", "Fortinet", "F5", "Imperva", "DigitalOcean",
  "Linode", "Vultr", "Hetzner", "Equinix", "Cloudflare", "Fastly",
  "Akamai", "OneLogin", "Ping Identity", "JFrog", "GitLab", "Pulumi",
  "Checkmarx", "Veracode", "SonarSource", "Infinispan", "Consul",
  "Memcached", "Redis", "RabbitMQ", "Kafka", "ActiveMQ", "NiFi", "Spark",
  "Hadoop", "Hive", "Presto", "Trino", "Druid", "ClickHouse", "Timescale",
  "InfluxDB", "Prometheus", "Grafana", "Alertmanager", "Jaeger", "Zipkin",
  "ELK Stack", "Logstash", "Kibana", "Graylog", "Loki", "Thanos", "Cortex",
];

const ROLE_KEYWORDS = Object.fromEntries(
  Object.entries(ROLE_KEYWORDS_MAP).map(([role, keywords]) => [
    role,
    new RegExp(keywords.join("|"), "i"),
  ])
);

const BIGTECH = new RegExp(BIGTECH_LIST.join("|"), "i");

let charts = {};
let allConnections = [];
let currentSortMode = "date";
let currentViewMode = "recent";
let currentPage = "analysis";
let currentMode = null; // "analysis" or "diff"
let diffData = { file1: null, file2: null, file1Name: "", file2Name: "" };

function destroyCharts() {
  Object.values(charts).forEach((c) => {
    try {
      c.destroy();
    } catch (e) {}
  });
  charts = {};
}

function parseConnections(csvText) {
  // LinkedIn exports have 3 header rows — skip them
  const lines = csvText.split("\n");
  let dataStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("First Name") && lines[i].includes("Last Name")) {
      dataStart = i;
      break;
    }
  }
  const dataCSV = lines.slice(dataStart).join("\n");
  const result = Papa.parse(dataCSV, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data.filter((r) => r["First Name"] && r["First Name"].trim());
}

function classifyRole(position) {
  if (!position) return "Other";
  for (const [role, regex] of Object.entries(ROLE_KEYWORDS)) {
    if (regex.test(position)) return role;
  }
  return "Other";
}

function buildMonthlyData(connections) {
  const map = {};
  connections.forEach((c) => {
    const raw = c["Connected On"];
    if (!raw) return;
    const d = new Date(raw);
    if (isNaN(d)) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + 1;
  });
  const sorted = Object.keys(map).sort();
  return {
    labels: sorted.map((k) => {
      const [y, m] = k.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months[parseInt(m) - 1] + " " + y.slice(2);
    }),
    data: sorted.map((k) => map[k]),
  };
}

function topCompanies(connections, n = 15) {
  const map = {};
  connections.forEach((c) => {
    const co = (c["Company"] || "").trim();
    if (!co) return;
    map[co] = (map[co] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function renderStats(connections) {
  const total = connections.length;
  const bigTech = connections.filter((c) =>
    BIGTECH.test(c["Company"] || ""),
  ).length;
  const devs = connections.filter((c) =>
    /Developer|Engineer|Programmer|Coder/i.test(c["Position"] || ""),
  ).length;
  const seniors = connections.filter((c) =>
    /Senior|Lead|Principal|Staff|Head|Director|VP|CTO|CEO|Manager|Architect/i.test(
      c["Position"] || "",
    ),
  ).length;
  const aiml = connections.filter((c) =>
    /AI|Machine Learning|Artificial Intelligence|LLM|Data Scien/i.test(
      c["Position"] || "",
    ),
  ).length;

  const stats = [
    {
      label: "Total Connections",
      value: total,
      note: "total connections",
      cls: "purple",
    },
    {
      label: "Big Tech",
      value: bigTech,
      note: "FAANG+ companies",
      cls: "red",
    },
    {
      label: "Developer",
      value: devs,
      note: "engineering roles",
      cls: "green",
    },
    {
      label: "AI / ML",
      value: aiml,
      note: "ai & ml roles",
      cls: "yellow",
    },
  ];

  const grid = document.getElementById("stats-grid");
  grid.innerHTML = stats
    .map(
      (s) => `
    <div class="stat-card ${s.cls}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value ${s.cls}">${s.value.toLocaleString()}</div>
      <div class="stat-note">${s.note}</div>
    </div>
  `,
    )
    .join("");
}

function renderRoleChart(connections) {
  const counts = {};
  connections.forEach((c) => {
    const role = classifyRole(c["Position"]);
    counts[role] = (counts[role] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map((e) => e[0]);
  const data = sorted.map((e) => e[1]);
  const bgColors = [
    COLORS.purple,
    COLORS.green,
    COLORS.red,
    COLORS.yellow,
    COLORS.teal,
    COLORS.pink,
    COLORS.blue,
    COLORS.orange,
    COLORS.muted,
  ];

  // Legend
  const legend = document.getElementById("role-legend");
  legend.innerHTML = labels
    .map(
      (l, i) => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${bgColors[i % bgColors.length]}"></div>
      ${l}
    </div>
  `,
    )
    .join("");

  charts.role = new Chart(document.getElementById("roleChart"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: bgColors.slice(0, labels.length),
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1c1c27",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          callbacks: {
            label: (ctx) =>
              ` ${ctx.label}: ${ctx.raw} (${Math.round((ctx.raw / connections.length) * 100)}%)`,
          },
        },
      },
      cutout: "62%",
    },
  });
}

function renderGrowthChart(connections) {
  const { labels, data } = buildMonthlyData(connections);
  const maxVal = Math.max(...data);
  const bgColors = data.map((v) =>
    v === maxVal ? COLORS.purple : "rgba(108,99,255,0.35)",
  );

  charts.growth = new Chart(document.getElementById("growthChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Connections",
          data,
          backgroundColor: bgColors,
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1c1c27",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#7b7a8e",
            font: { size: 10 },
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 45,
          },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
        y: {
          ticks: { color: "#7b7a8e", font: { size: 10 } },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
      },
    },
  });
}

function renderCompanyChart(connections) {
  const top = topCompanies(connections, 15);
  const labels = top.map((e) => e[0]);
  const data = top.map((e) => e[1]);
  const maxVal = Math.max(...data);

  // Adjust height dynamically
  const wrap = document.getElementById("company-wrap");
  wrap.style.height = Math.max(300, labels.length * 36 + 80) + "px";

  charts.company = new Chart(document.getElementById("companyChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Connections",
          data,
          backgroundColor: data.map((v) =>
            v === maxVal ? COLORS.green : "rgba(67,233,123,0.3)",
          ),
          borderRadius: 5,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1c1c27",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: "#7b7a8e", font: { size: 11 } },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
        y: {
          ticks: { color: "#e0dff8", font: { size: 12 } },
          grid: { display: false },
        },
      },
    },
  });
}

function renderRecentTable(connections) {
  const sorted = [...connections]
    .filter((c) => c["Connected On"])
    .sort((a, b) => new Date(b["Connected On"]) - new Date(a["Connected On"]))
    .slice(0, 20);

  const tbody = document.getElementById("recent-tbody");
  tbody.innerHTML = sorted
    .map((c) => {
      const role = classifyRole(c["Position"]);
      const badgeCls =
        {
          "AI / ML": "badge-yellow",
          Manager: "badge-red",
          Frontend: "badge-blue",
          Backend: "badge-green",
          "Full-stack": "badge-green",
          DevOps: "badge-blue",
          Data: "badge-yellow",
          Mobile: "badge-blue",
          Security: "badge-red",
          Product: "badge-purple",
          Design: "badge-pink",
          QA: "badge-teal",
        }[role] || "";
      return `<tr>
      <td style="font-weight:600">${c["First Name"]} ${c["Last Name"]}</td>
      <td style="color:#a09ec8;font-size:12px">${(c["Position"] || "").slice(0, 45)}${(c["Position"] || "").length > 45 ? "…" : ""}</td>
      <td>${c["Company"] ? `<span class="badge badge-blue">${(c["Company"] || "").slice(0, 25)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted)">${c["Connected On"] || ""}</td>
    </tr>`;
    })
    .join("");
}

function filterConnections(searchQuery) {
  if (!searchQuery.trim()) {
    return allConnections;
  }

  const fuse = new Fuse(allConnections, {
    keys: ["First Name", "Last Name", "Position", "Company"],
    threshold: 0.3,
    minMatchCharLength: 1,
  });

  return fuse.search(searchQuery).map((result) => result.item);
}

function sortConnections(connections, sortMode) {
  const sorted = [...connections];

  switch (sortMode) {
    case "name":
      return sorted.sort((a, b) => {
        const nameA = `${a["First Name"]} ${a["Last Name"]}`.toLowerCase();
        const nameB = `${b["First Name"]} ${b["Last Name"]}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });

    case "company":
      return sorted.sort((a, b) => {
        const compA = (a["Company"] || "").toLowerCase();
        const compB = (b["Company"] || "").toLowerCase();
        if (compA === compB) {
          return `${a["First Name"]} ${a["Last Name"]}`.localeCompare(
            `${b["First Name"]} ${b["Last Name"]}`,
          );
        }
        return compA.localeCompare(compB);
      });

    case "date":
    default:
      return sorted.sort((a, b) => {
        const dateA = new Date(a["Connected On"] || 0);
        const dateB = new Date(b["Connected On"] || 0);
        return dateB - dateA;
      });
  }
}

function renderConnectionsTable(connections) {
  const tbody = document.getElementById("recent-tbody");
  const noResults = document.getElementById("no-results");

  if (connections.length === 0) {
    tbody.innerHTML = "";
    noResults.style.display = "flex";
    return;
  }

  noResults.style.display = "none";

  // Filter by view mode
  let visibleConnections = connections;
  if (currentViewMode === "recent") {
    visibleConnections = connections.slice(0, 20);
  }

  // Sort connections
  visibleConnections = sortConnections(visibleConnections, currentSortMode);

  tbody.innerHTML = visibleConnections
    .map((c) => {
      const role = classifyRole(c["Position"]);
      const badgeCls =
        {
          "AI / ML": "badge-yellow",
          Manager: "badge-red",
          Frontend: "badge-blue",
          Backend: "badge-green",
          "Full-stack": "badge-green",
          DevOps: "badge-blue",
          Data: "badge-yellow",
          Mobile: "badge-blue",
          Security: "badge-red",
          Product: "badge-purple",
          Design: "badge-pink",
          QA: "badge-teal",
        }[role] || "";
      return `<tr>
      <td style="font-weight:600">${c["First Name"]} ${c["Last Name"]}</td>
      <td style="color:#a09ec8;font-size:12px">${(c["Position"] || "").slice(0, 45)}${(c["Position"] || "").length > 45 ? "…" : ""}</td>
      <td>${c["Company"] ? `<span class="badge badge-blue">${(c["Company"] || "").slice(0, 25)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted)">${c["Connected On"] || ""}</td>
    </tr>`;
    })
    .join("");
}

function processCSV(text) {
  destroyCharts();
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("analysis-page").classList.add("hidden");
  document.getElementById("connections-page").classList.add("hidden");

  setTimeout(() => {
    const connections = parseConnections(text);
    allConnections = connections;
    currentSortMode = "date";
    currentViewMode = "recent";
    currentPage = "analysis";

    renderStats(connections);
    renderRoleChart(connections);
    renderGrowthChart(connections);
    renderCompanyChart(connections);
    renderConnectionsTable(connections);

    document.getElementById("loading").classList.add("hidden");
    document.getElementById("analysis-page").classList.remove("hidden");
    document.getElementById("page-nav").classList.remove("hidden");

    // Hide upload zone and show success area
    document.getElementById("upload-zone").classList.add("hidden");
    document.getElementById("upload-success").classList.remove("hidden");
    document.getElementById("success-count").textContent =
      `${connections.length} connections loaded`;

    // Setup event listeners for controls
    setupConnectionsControls();
    setupPageNavigation();
    setupUploadButton();
  }, 100);
}

function resetApp() {
  destroyCharts();
  allConnections = [];
  currentSortMode = "date";
  currentViewMode = "recent";
  currentPage = "analysis";

  // Show home page
  showHomePage();

  // Reset file input
  document.getElementById("file-input").value = "";
}

function setupUploadButton() {
  const uploadBtn = document.getElementById("btn-upload-new");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      resetApp();
    });
  }
}

function switchPage(pageName) {
  // Hide all pages
  document.getElementById("analysis-page").classList.add("hidden");
  document.getElementById("connections-page").classList.add("hidden");
  document.getElementById("diff-page").classList.add("hidden");

  // Remove active class from all nav buttons
  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));

  // Show the selected page
  document.getElementById(`${pageName}-page`).classList.remove("hidden");

  // Set the nav button as active
  document.querySelector(`[data-page="${pageName}"]`).classList.add("active");

  currentPage = pageName;
}

function showHomePage() {
  // Show home page
  document.getElementById("home-page").classList.remove("hidden");

  // Hide all other pages
  document.getElementById("analysis-page").classList.add("hidden");
  document.getElementById("connections-page").classList.add("hidden");
  document.getElementById("diff-page").classList.add("hidden");
  document.getElementById("upload-zone").classList.add("hidden");
  document.getElementById("upload-success").classList.add("hidden");
  document.getElementById("page-nav").classList.add("hidden");

  currentMode = null;
  currentPage = null;
}

function startAnalysisMode() {
  currentMode = "analysis";

  // Hide home page
  document.getElementById("home-page").classList.add("hidden");

  // Show upload zone
  document.getElementById("upload-zone").classList.remove("hidden");
  document.getElementById("page-nav").classList.add("hidden");
}

function startDiffMode() {
  currentMode = "diff";

  // Hide home page
  document.getElementById("home-page").classList.add("hidden");

  // Hide analysis upload zone
  document.getElementById("upload-zone").classList.add("hidden");
  document.getElementById("upload-success").classList.add("hidden");

  // Show diff page
  document.getElementById("diff-page").classList.remove("hidden");
  document.getElementById("page-nav").classList.add("hidden");

  // Initialize diff tool
  initDiffTool();
}

function setupHomePageButtons() {
  const analysisCard = document.querySelector('[data-mode="analysis"]');
  const diffCard = document.querySelector('[data-mode="diff"]');

  if (analysisCard) {
    analysisCard.addEventListener("click", startAnalysisMode);
  }

  if (diffCard) {
    diffCard.addEventListener("click", startDiffMode);
  }
}

function setupPageNavigation() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageName = btn.dataset.page;
      switchPage(pageName);
      if (pageName === "diff") {
        initDiffTool();
      }
    });
  });
}

function setupConnectionsControls() {
  // Search input
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    const filtered = filterConnections(query);
    renderConnectionsTable(filtered);
  });

  // Sort buttons
  document.querySelectorAll(".btn-sort").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-sort")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSortMode = btn.dataset.sort;

      const query = searchInput.value;
      const filtered = filterConnections(query);
      renderConnectionsTable(filtered);
    });
  });

  // View mode buttons
  document.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-view")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentViewMode = btn.dataset.view;

      const query = searchInput.value;
      const filtered = filterConnections(query);
      renderConnectionsTable(filtered);
    });
  });
}

// ── FILE INPUT ──
const zone = document.getElementById("upload-zone");
const input = document.getElementById("file-input");

zone.addEventListener("click", () => input.click());
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => processCSV(ev.target.result);
  reader.readAsText(file);
  input.value = "";
});

// ── DRAG & DROP ──
zone.addEventListener("dragover", (e) => {
  e.preventDefault();
  zone.classList.add("drag-over");
});
zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
zone.addEventListener("drop", (e) => {
  e.preventDefault();
  zone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (!file || !file.name.endsWith(".csv")) return;
  const reader = new FileReader();
  reader.onload = (ev) => processCSV(ev.target.result);
  reader.readAsText(file);
});

// ── DIFF FUNCTIONALITY ──

// Create unique identifier for a connection
function getConnectionKey(conn) {
  return `${(conn["First Name"] || "").toLowerCase()}__${(conn["Last Name"] || "").toLowerCase()}`;
}

// Compare two CSV files and identify differences
function compareDiffFiles() {
  if (!diffData.file1 || !diffData.file2) return null;

  const connections1 = parseConnections(diffData.file1);
  const connections2 = parseConnections(diffData.file2);

  // Create maps for quick lookup
  const map1 = {};
  const map2 = {};

  connections1.forEach((c) => {
    map1[getConnectionKey(c)] = c;
  });

  connections2.forEach((c) => {
    map2[getConnectionKey(c)] = c;
  });

  // Find added, removed, and modified connections
  const added = [];
  const removed = [];
  const modified = [];

  // Find added and modified
  Object.entries(map2).forEach(([key, conn2]) => {
    if (!map1[key]) {
      added.push(conn2);
    } else {
      const conn1 = map1[key];
      // Check if any field changed
      const positionChanged = conn1["Position"] !== conn2["Position"];
      const companyChanged = conn1["Company"] !== conn2["Company"];
      if (positionChanged || companyChanged) {
        modified.push({ old: conn1, new: conn2 });
      }
    }
  });

  // Find removed
  Object.entries(map1).forEach(([key, conn1]) => {
    if (!map2[key]) {
      removed.push(conn1);
    }
  });

  return { added, removed, modified, connections1, connections2 };
}

// Render diff statistics
function renderDiffStats(diffResult) {
  const { added, removed, modified, connections1, connections2 } = diffResult;
  const total1 = connections1.length;
  const total2 = connections2.length;
  const netChange = total2 - total1;

  const stats = [
    {
      label: "Total (File 1)",
      value: total1,
      note: "connections",
      cls: "purple",
    },
    {
      label: "Total (File 2)",
      value: total2,
      note: "connections",
      cls: "green",
    },
    {
      label: "Added",
      value: added.length,
      note: "new connections",
      cls: "green",
    },
    {
      label: "Removed",
      value: removed.length,
      note: "deleted connections",
      cls: "red",
    },
    {
      label: "Modified",
      value: modified.length,
      note: "updated profiles",
      cls: "yellow",
    },
    {
      label: "Net Change",
      value: netChange > 0 ? `+${netChange}` : netChange,
      note: "overall change",
      cls: netChange > 0 ? "green" : "red",
    },
  ];

  const grid = document.getElementById("diff-stats-grid");
  grid.innerHTML = stats
    .map(
      (s) => `
    <div class="stat-card ${s.cls}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value ${s.cls}">${
        typeof s.value === "number" ? s.value.toLocaleString() : s.value
      }</div>
      <div class="stat-note">${s.note}</div>
    </div>
  `,
    )
    .join("");
}

// Render diff chart
function renderDiffChart(diffResult) {
  const { added, removed, modified } = diffResult;

  charts.diff = new Chart(document.getElementById("diffChart"), {
    type: "doughnut",
    data: {
      labels: ["Added", "Removed", "Modified"],
      datasets: [
        {
          data: [added.length, removed.length, modified.length],
          backgroundColor: [COLORS.green, COLORS.red, COLORS.yellow],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          backgroundColor: "#1c1c27",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
        },
      },
      cutout: "62%",
    },
  });
}

// Render company changes chart
function renderCompanyDiffChart(diffResult) {
  const { added, removed } = diffResult;

  const companyAdded = {};
  const companyRemoved = {};

  added.forEach((c) => {
    const co = (c["Company"] || "").trim();
    if (co) companyAdded[co] = (companyAdded[co] || 0) + 1;
  });

  removed.forEach((c) => {
    const co = (c["Company"] || "").trim();
    if (co) companyRemoved[co] = (companyRemoved[co] || 0) + 1;
  });

  const topAdded = Object.entries(companyAdded)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topRemoved = Object.entries(companyRemoved)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const allCompanies = new Set([...topAdded, ...topRemoved].map((c) => c[0]));
  const labels = Array.from(allCompanies);

  const addedData = labels.map((co) => companyAdded[co] || 0);
  const removedData = labels.map((co) => companyRemoved[co] || 0);

  charts.companyDiff = new Chart(document.getElementById("companyDiffChart"), {
    type: "bar",
    data: {
      labels: labels.slice(0, 8),
      datasets: [
        {
          label: "Added",
          data: addedData.slice(0, 8),
          backgroundColor: COLORS.green,
          borderRadius: 5,
        },
        {
          label: "Removed",
          data: removedData.slice(0, 8),
          backgroundColor: COLORS.red,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          backgroundColor: "#1c1c27",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#7b7a8e",
            font: { size: 10 },
            maxRotation: 45,
          },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
        y: {
          ticks: { color: "#7b7a8e", font: { size: 10 } },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
      },
    },
  });
}

// Render diff results tables
function renderDiffResults(diffResult) {
  const { added, removed, modified } = diffResult;

  // Added table
  const addedTbody = document.getElementById("added-tbody");
  addedTbody.innerHTML = added
    .map(
      (c) => `
    <tr>
      <td style="font-weight:600">${c["First Name"]} ${c["Last Name"]}</td>
      <td style="color:#a09ec8;font-size:12px">${(c["Position"] || "").slice(0, 45)}${(c["Position"] || "").length > 45 ? "…" : ""}</td>
      <td>${c["Company"] ? `<span class="badge badge-green">${(c["Company"] || "").slice(0, 25)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted)">${c["Connected On"] || ""}</td>
    </tr>
  `,
    )
    .join("");

  document.getElementById("added-count").textContent = added.length;

  // Removed table
  const removedTbody = document.getElementById("removed-tbody");
  removedTbody.innerHTML = removed
    .map(
      (c) => `
    <tr>
      <td style="font-weight:600">${c["First Name"]} ${c["Last Name"]}</td>
      <td style="color:#a09ec8;font-size:12px">${(c["Position"] || "").slice(0, 45)}${(c["Position"] || "").length > 45 ? "…" : ""}</td>
      <td>${c["Company"] ? `<span class="badge badge-red">${(c["Company"] || "").slice(0, 25)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
      <td style="font-family:var(--mono);font-size:11px;color:var(--muted)">${c["Connected On"] || ""}</td>
    </tr>
  `,
    )
    .join("");

  document.getElementById("removed-count").textContent = removed.length;

  // Modified table
  const modifiedTbody = document.getElementById("modified-tbody");
  modifiedTbody.innerHTML = modified
    .map(
      (m) => `
    <tr>
      <td style="font-weight:600">${m.old["First Name"]} ${m.old["Last Name"]}</td>
      <td style="color:#a09ec8;font-size:12px">${(m.old["Position"] || "").slice(0, 40)}${(m.old["Position"] || "").length > 40 ? "…" : ""}</td>
      <td style="color:#43e97b;font-size:12px">${(m.new["Position"] || "").slice(0, 40)}${(m.new["Position"] || "").length > 40 ? "…" : ""}</td>
      <td>${m.new["Company"] ? `<span class="badge badge-yellow">${(m.new["Company"] || "").slice(0, 25)}</span>` : '<span style="color:var(--muted)">—</span>'}</td>
    </tr>
  `,
    )
    .join("");

  document.getElementById("modified-count").textContent = modified.length;
}

// Setup diff file inputs
function setupDiffFileInputs() {
  const file1Input = document.getElementById("diff-file-1");
  const file2Input = document.getElementById("diff-file-2");
  const zone1 = document.getElementById("diff-upload-zone-1");
  const zone2 = document.getElementById("diff-upload-zone-2");

  // File 1
  zone1.addEventListener("click", () => file1Input.click());
  file1Input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      diffData.file1 = ev.target.result;
      diffData.file1Name = file.name;
      document.getElementById("file-1-name").textContent = file.name;
      checkAndRunDiff();
    };
    reader.readAsText(file);
  });

  // File 2
  zone2.addEventListener("click", () => file2Input.click());
  file2Input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      diffData.file2 = ev.target.result;
      diffData.file2Name = file.name;
      document.getElementById("file-2-name").textContent = file.name;
      checkAndRunDiff();
    };
    reader.readAsText(file);
  });

  // Drag and drop zone 1
  zone1.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone1.classList.add("drag-over");
  });
  zone1.addEventListener("dragleave", () =>
    zone1.classList.remove("drag-over"),
  );
  zone1.addEventListener("drop", (e) => {
    e.preventDefault();
    zone1.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      diffData.file1 = ev.target.result;
      diffData.file1Name = file.name;
      document.getElementById("file-1-name").textContent = file.name;
      checkAndRunDiff();
    };
    reader.readAsText(file);
  });

  // Drag and drop zone 2
  zone2.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone2.classList.add("drag-over");
  });
  zone2.addEventListener("dragleave", () =>
    zone2.classList.remove("drag-over"),
  );
  zone2.addEventListener("drop", (e) => {
    e.preventDefault();
    zone2.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith(".csv")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      diffData.file2 = ev.target.result;
      diffData.file2Name = file.name;
      document.getElementById("file-2-name").textContent = file.name;
      checkAndRunDiff();
    };
    reader.readAsText(file);
  });
}

// Check if both files are loaded and run diff
function checkAndRunDiff() {
  if (diffData.file1 && diffData.file2) {
    const diffResult = compareDiffFiles();
    if (diffResult) {
      destroyCharts();
      renderDiffStats(diffResult);
      renderDiffChart(diffResult);
      renderCompanyDiffChart(diffResult);
      renderDiffResults(diffResult);
      document.getElementById("diff-results").classList.remove("hidden");
    }
  }
}

// Reset diff tool
function resetDiffTool() {
  diffData = { file1: null, file2: null, file1Name: "", file2Name: "" };
  document.getElementById("diff-file-1").value = "";
  document.getElementById("diff-file-2").value = "";
  document.getElementById("file-1-name").textContent = "";
  document.getElementById("file-2-name").textContent = "";
  document.getElementById("diff-results").classList.add("hidden");
  destroyCharts();

  // Show home page
  showHomePage();
}

// Setup diff reset button
function setupDiffResetButton() {
  const resetBtn = document.getElementById("btn-reset-diff");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => resetDiffTool());
  }
}

// Initialize diff tool when page loads
function initDiffTool() {
  setupDiffFileInputs();
  setupDiffResetButton();
}

// Initialize app on page load
document.addEventListener("DOMContentLoaded", () => {
  showHomePage();
  setupHomePageButtons();
});
