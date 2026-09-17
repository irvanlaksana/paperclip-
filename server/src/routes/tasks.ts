import express from "express";

export const tasksRouter = express.Router();

// In real Paperclip: tasks are ticket-based, with goal ancestry, blockers, etc.
interface Task {
  id: string;
  title: string;
  goal: string;
  status: "open" | "in_progress" | "done";
  agent: string;
  companyId: string;
  createdAt: string;
}

let tasks: Task[] = [
  {
    id: "task_1",
    title: "Buat listing SEO untuk Saklar Tunggal Anti-Korslet",
    goal: "Menaikkan penjualan marketplace",
    status: "done",
    agent: "seo",
    companyId: "company_default",
    createdAt: new Date().toISOString()
  }
];

tasksRouter.get("/", (_req, res) => {
  res.json({ ok: true, tasks, total: tasks.length });
});

tasksRouter.post("/", (req, res) => {
  const task: Task = {
    id: `task_${Date.now()}`,
    title: req.body.title || "Untitled task",
    goal: req.body.goal || "Mendukung misi company",
    status: "open",
    agent: req.body.agent || "seo",
    companyId: req.body.companyId || "company_default",
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  res.json({ ok: true, task });
});

tasksRouter.get("/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json({ ok: true, task });
});
