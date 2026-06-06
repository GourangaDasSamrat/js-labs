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

const ROLE_KEYWORDS = {
  "AI / ML":
    /AI|Machine Learning|Artificial Intelligence|LLM|Deep Learning|Computer Vision|NLP|Data Scien/i,
  Frontend: /Frontend|Front-end|React|Vue|Angular|UI Developer|Web Developer/i,
  Backend: /Backend|Back-end|Node|Python Dev|Java Dev|Spring|Laravel|Django/i,
  "Full-stack": /Full.?stack|Fullstack/i,
  DevOps: /DevOps|SRE|Cloud Eng|Infrastructure|Platform Eng/i,
  Mobile: /Mobile|iOS|Android|Flutter|React Native/i,
  Data: /Data Engineer|Data Analyst|BI |Analytics/i,
  Manager: /Manager|Director|Head of|VP |CTO|CEO|Lead|Principal|Staff/i,
};

const BIGTECH =
  /Google|Microsoft|Amazon|Meta|Apple|Netflix|GitHub|IBM|Oracle|Salesforce|Adobe|Atlassian/i;

let charts = {};
let allConnections = [];
let currentSortMode = "date";
let currentViewMode = "recent";
let currentPage = "analysis";

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

  // Show upload zone and hide success area
  document.getElementById("upload-zone").classList.remove("hidden");
  document.getElementById("upload-success").classList.add("hidden");
  document.getElementById("analysis-page").classList.add("hidden");
  document.getElementById("connections-page").classList.add("hidden");
  document.getElementById("page-nav").classList.add("hidden");

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

function setupPageNavigation() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageName = btn.dataset.page;
      switchPage(pageName);
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
