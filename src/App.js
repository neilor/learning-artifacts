import React, { useState, useEffect } from "react";
import "./index.css";
import db from "./db";

const LEARNING_TRACKS = [
  {
    id: "vibe-coding",
    icon: "🎵",
    title: "Vibe Coding Mastery",
    subtitle: "AI-Enhanced Development Flow",
    items: [
      "Claude/Cursor integration with TypeScript/React",
      "AI pair programming for Node.js backends",
      "Automated testing with AI assistance",
      "Code review optimization with AI",
      "Documentation generation workflows",
    ],
  },
  {
    id: "mcp-ecosystem",
    icon: "🔧",
    title: "MCP Ecosystem",
    subtitle: "Model Context Protocol Deep Dive",
    items: [
      "MCP server setup for your tech stack",
      "Custom integrations with BigQuery/MongoDB",
      "Firebase + MCP workflows",
      "Google Cloud AI services connection",
      "Building startup-specific MCP tools",
    ],
  },
  {
    id: "multi-agent",
    icon: "🤖",
    title: "Multi-Agent Systems",
    subtitle: "Orchestrated AI Workflows",
    items: [
      "Agent chains for code deployment",
      "Business intelligence automation",
      "Investor report generation",
      "Startup assessment workflows",
      "Cross-platform mobile/web agents",
    ],
  },
  {
    id: "personal-productivity",
    icon: "📱",
    title: "Personal Productivity",
    subtitle: "CEO Operations Automation",
    items: [
      "Gmail/Calendar AI management",
      "WhatsApp business automation",
      "Task prioritization algorithms",
      "Meeting prep & follow-up systems",
      "Investor communication workflows",
    ],
  },
  {
    id: "ai-product-stack",
    icon: "🛠️",
    title: "AI Product Stack",
    subtitle: "Tool Integration & ROI",
    items: [
      "CodeRabbit for PR automation",
      "Jules for startup operations",
      "Codex for rapid prototyping",
      "Claude for strategic planning",
      "Custom AI tool evaluation framework",
    ],
  },
  {
    id: "data-driven-scaling",
    icon: "📊",
    title: "Data-Driven Scaling",
    subtitle: "BI + AI for Growth",
    items: [
      "Looker + AI insights automation",
      "BigQuery ML for startup metrics",
      "Predictive scaling models",
      "Investor dashboard automation",
      "Technology manager assessment AI",
    ],
  },
];

const WEEKLY_SCHEDULE = [
  {
    day: "Monday",
    focus: "Vibe Coding - 30 min morning",
    trackId: "vibe-coding",
  },
  {
    day: "Tuesday",
    focus: "MCP Setup - 45 min evening",
    trackId: "mcp-ecosystem",
  },
  {
    day: "Wednesday",
    focus: "Multi-Agent - 30 min morning",
    trackId: "multi-agent",
  },
  {
    day: "Thursday",
    focus: "Productivity - 45 min evening",
    trackId: "personal-productivity",
  },
  {
    day: "Friday",
    focus: "AI Products - 30 min morning",
    trackId: "ai-product-stack",
  },
  {
    day: "Saturday",
    focus: "Data/BI - 60 min flexible",
    trackId: "data-driven-scaling",
  },
  {
    day: "Sunday",
    focus: "Review & Plan - 30 min reflection",
    trackId: "review",
  },
];

const TECH_TOOLS = [
  { name: "Node.js + AI", description: "Backend automation & API enhancement" },
  { name: "React + Claude", description: "Frontend development acceleration" },
  { name: "TypeScript + AI", description: "Type-safe AI-assisted development" },
  { name: "Firebase + MCP", description: "Serverless AI-powered backends" },
  { name: "BigQuery + ML", description: "Data-driven startup insights" },
  { name: "Looker + AI", description: "Automated business intelligence" },
];

function App() {
  const [completedItems, setCompletedItems] = useState({});
  const [completedDays, setCompletedDays] = useState({});
  const [completedTools, setCompletedTools] = useState({});
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedItems = await db.loadData("completedItems");
        const savedDays = await db.loadData("completedDays");
        const savedTools = await db.loadData("completedTools");

        setCompletedItems(savedItems);
        setCompletedDays(savedDays);
        setCompletedTools(savedTools);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await db.saveData("completedItems", completedItems);
      } catch (error) {
        console.error("Erro ao salvar itens:", error);
      }
    };

    if (Object.keys(completedItems).length > 0) {
      saveData();
    }
  }, [completedItems]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await db.saveData("completedDays", completedDays);
      } catch (error) {
        console.error("Erro ao salvar dias:", error);
      }
    };

    if (Object.keys(completedDays).length > 0) {
      saveData();
    }
  }, [completedDays]);

  useEffect(() => {
    const saveData = async () => {
      try {
        await db.saveData("completedTools", completedTools);
      } catch (error) {
        console.error("Erro ao salvar ferramentas:", error);
      }
    };

    if (Object.keys(completedTools).length > 0) {
      saveData();
    }
  }, [completedTools]);

  const toggleItemCompletion = (trackId, itemIndex) => {
    const key = `${trackId}-${itemIndex}`;
    setCompletedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleDayCompletion = (dayIndex) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  const toggleToolCompletion = (toolIndex) => {
    setCompletedTools((prev) => ({
      ...prev,
      [toolIndex]: !prev[toolIndex],
    }));
  };

  const getTrackProgress = (trackId) => {
    const track = LEARNING_TRACKS.find((t) => t.id === trackId);
    if (!track) return 0;

    const completedCount = track.items.filter(
      (_, index) => completedItems[`${trackId}-${index}`]
    ).length;

    return Math.round((completedCount / track.items.length) * 100);
  };

  const getTotalProgress = () => {
    const totalItems = LEARNING_TRACKS.reduce(
      (sum, track) => sum + track.items.length,
      0
    );
    const completedCount = Object.values(completedItems).filter(Boolean).length;
    return Math.round((completedCount / totalItems) * 100);
  };

  const getCompletedTracksCount = () => {
    return LEARNING_TRACKS.filter((track) => getTrackProgress(track.id) === 100)
      .length;
  };

  const resetAllProgress = async () => {
    if (
      window.confirm(
        "Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await db.clearAllData();
        setCompletedItems({});
        setCompletedDays({});
        setCompletedTools({});
        console.log("Progresso resetado com sucesso!");
      } catch (error) {
        console.error("Erro ao resetar progresso:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>AI-Powered CEO Learning Framework</h1>
        <div className="roles">
          <div className="role-badge">👨‍💼 CEO</div>
          <div className="role-badge">👨‍💻 Developer</div>
          <div className="role-badge">💰 Investor</div>
          <div className="role-badge">🚀 Startup Scaler</div>
        </div>
        <p>
          Systematic approach to mastering AI tools for technical leadership and
          business growth
        </p>
      </div>

      <div className="progress-section">
        <h2>📈 Your Learning Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{getTotalProgress()}%</span>
            <span className="stat-label">Overall Progress</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{getCompletedTracksCount()}</span>
            <span className="stat-label">Completed Tracks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {Object.values(completedItems).filter(Boolean).length}
            </span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {Object.values(completedDays).filter(Boolean).length}
            </span>
            <span className="stat-label">Days Completed</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="interactive-btn" onClick={resetAllProgress}>
            Reset All Progress
          </button>
        </div>
      </div>

      <div className="framework-grid">
        {LEARNING_TRACKS.map((track) => (
          <div key={track.id} className="learning-track">
            <div className="track-header">
              <div className="track-icon">{track.icon}</div>
              <div>
                <div className="track-title">{track.title}</div>
                <div className="track-subtitle">{track.subtitle}</div>
              </div>
            </div>
            <ul className="learning-items">
              {track.items.map((item, index) => (
                <li
                  key={index}
                  className={`learning-item ${completedItems[`${track.id}-${index}`] ? "completed" : ""}`}
                  onClick={() => toggleItemCompletion(track.id, index)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="progress-section">
        <h2>🎯 Track Progress</h2>
        <div className="progress-grid">
          {LEARNING_TRACKS.map((track) => (
            <div key={track.id} className="progress-item">
              <div className="progress-label">
                <span>{track.title}</span>
                <span className="progress-percentage">
                  {getTrackProgress(track.id)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getTrackProgress(track.id)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="weekly-schedule">
        <h2>📅 Weekly Learning Schedule</h2>
        <p>Optimized for CEO schedule with 30-45 min focused sessions</p>
        <div className="schedule-grid">
          {WEEKLY_SCHEDULE.map((day, index) => (
            <div
              key={index}
              className={`day-card ${completedDays[index] ? "completed" : ""}`}
              onClick={() => toggleDayCompletion(index)}
            >
              <div className="day-name">{day.day}</div>
              <div className="day-focus">{day.focus}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-section">
        <h2>🔗 Your Tech Stack Integration</h2>
        <div className="tools-integration">
          {TECH_TOOLS.map((tool, index) => (
            <div
              key={index}
              className={`tool-card ${completedTools[index] ? "completed" : ""}`}
              onClick={() => toggleToolCompletion(index)}
            >
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
