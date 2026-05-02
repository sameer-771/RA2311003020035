"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { Log } from "../lib/logger";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
  score?: number;
}

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const TYPE_COLORS: Record<string, "error" | "primary" | "success"> = {
  Placement: "error",
  Result: "primary",
  Event: "success",
};

export default function PriorityPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    void fetchAndRank();
  }, []);

  async function fetchAndRank() {
    setLoading(true);
    await Log("frontend", "info", "page", "Loading priority inbox page");
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      const items = Array.isArray(data.notifications) ? data.notifications : [];
      const scored = items.map((n: Notification) => ({
        ...n,
        score: (TYPE_WEIGHT[n.Type] ?? 0) * 1_000_000 + new Date(n.Timestamp).getTime(),
      }));

      scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      setNotifications(scored);
      await Log(
        "frontend",
        "info",
        "api",
        `Ranked ${scored.length} notifications by priority`
      );
    } catch (err) {
      await Log(
        "frontend",
        "error",
        "api",
        "Failed to fetch notifications for priority inbox"
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (filterType === "All") {
      return notifications;
    }
    return notifications.filter((n) => n.Type === filterType);
  }, [notifications, filterType]);

  const topNotifications = filtered.slice(0, topN);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" sx={{ bgcolor: "#f59e0b" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon />
            <Typography variant="h6" fontWeight="bold">
              Priority Inbox
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
          >
            All Notifications
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label="Show Top N"
            type="number"
            value={topN}
            onChange={(event) => {
              const value = Math.max(1, Number(event.target.value || 1));
              setTopN(value);
              void Log("frontend", "info", "state", `Top N changed to ${value}`);
            }}
            inputProps={{ min: 1, max: 50 }}
            size="small"
            sx={{ width: 140 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="filter-type">Filter Type</InputLabel>
            <Select
              labelId="filter-type"
              value={filterType}
              label="Filter Type"
              onChange={(event) => {
                const value = event.target.value;
                setFilterType(value);
                void Log(
                  "frontend",
                  "info",
                  "state",
                  `Filter changed to ${value}`
                );
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Showing top {topNotifications.length} notifications - Placement &gt; Result &gt; Event
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          topNotifications.map((n, index) => (
            <Card
              key={n.ID}
              sx={{
                mb: 2,
                borderLeft: "4px solid #f59e0b",
                backgroundColor: "#fff7ed",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Rank #{index + 1}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Chip
                      label={n.Type}
                      color={TYPE_COLORS[n.Type] ?? "primary"}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {n.Message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.Timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </Box>
  );
}