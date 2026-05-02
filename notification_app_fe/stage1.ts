const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZTM0NjNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTk5NSwiaWF0IjoxNzc3NzAxMDk1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTdhMzFhNTctN2JmYy00Y2RhLThjNWItNzdjMjVlZjlhY2ZlIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FtZWVyIHJhamEgZSIsInN1YiI6ImQ2YTZhZDAwLWU0YjAtNGJmNS04ZTFhLWYwNWM1YWJhNjA0ZSJ9LCJlbWFpbCI6InNlMzQ2M0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6InNhbWVlciByYWphIGUiLCJyb2xsTm8iOiJyYTIzMTEwMDMwMjAwMzUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJkNmE2YWQwMC1lNGIwLTRiZjUtOGUxYS1mMDVjNWFiYTYwNGUiLCJjbGllbnRTZWNyZXQiOiJNbUFhRWtncVhVcHFkVGZhIn0.tdUHYslFjc6pxur9E6aa1OosCSOdDUCo-CCTshQzgdA";

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

async function getTopNotifications(n: number = 10) {
  console.log("Fetching notifications...");

  const res = await fetch(
    "http://20.207.122.201/evaluation-service/notifications",
    {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    }
  );

  const data = await res.json();
  const notifications: Notification[] = data.notifications;

  console.log(`Total notifications fetched: ${notifications.length}`);

  // Score each notification
  const scored = notifications.map((n) => ({
    ...n,
    score:
      (TYPE_WEIGHT[n.Type] ?? 0) * 1_000_000 +
      new Date(n.Timestamp).getTime(),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, n);

  console.log(`\n=== TOP ${n} PRIORITY NOTIFICATIONS ===\n`);
  top.forEach((notif, i) => {
    console.log(
      `${i + 1}. [${notif.Type}] "${notif.Message}" — ${notif.Timestamp}`
    );
  });
}

getTopNotifications(10);