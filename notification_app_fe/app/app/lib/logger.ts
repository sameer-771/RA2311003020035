export async function Log(
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg: string,
  message: string
): Promise<void> {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (err) {
    console.error("Logging failed:", err);
  }
}