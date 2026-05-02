"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Pagination,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { Log } from "./lib/logger";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

const TABS = ["All", "Placement", "Result", "Event"] as const;

const TYPE_COLORS: Record<string, "error" | "primary" | "success"> = {
  Placement: "error",
  Result: "primary",
  Event: "success",
};

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    void fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    await Log("frontend", "info", "page", "Fetching all notifications");
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      const data = await res.json();
      const items = Array.isArray(data.notifications) ? data.notifications : [];
      setNotifications(items);
      await Log(
        "frontend",
        "info",
        "api",
        `Fetched ${items.length} notifications`
      );
    } catch (err) {
      await Log("frontend", "error", "api", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }

  function markAsRead(id: string) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    void Log("frontend", "info", "state", `Notification ${id} marked as read`);
  }

  const filtered = useMemo(() => {
    if (tab === 0) {
      return notifications;
    }
    return notifications.filter((n) => n.Type === TABS[tab]);
  }, [notifications, tab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const unreadCount = notifications.filter((n) => !readIds.has(n.ID)).length;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
            <Typography variant="h6" fontWeight="bold">
              Campus Notifications
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/priority"
            variant="contained"
            color="warning"
            startIcon={<StarIcon />}
          >
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => {
            setTab(value);
            setPage(1);
            void Log("frontend", "info", "state", `Tab changed to ${TABS[value]}`);
          }}
          sx={{ mb: 3 }}
          variant="scrollable"
        >
          {TABS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {paginated.map((n) => (
              <Card
                key={n.ID}
                sx={{
                  mb: 2,
                  opacity: readIds.has(n.ID) ? 0.6 : 1,
                  borderLeft: readIds.has(n.ID)
                    ? "4px solid #cbd5f5"
                    : "4px solid #1e3a8a",
                  cursor: "pointer",
                }}
                onClick={() => markAsRead(n.ID)}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip
                        label={n.Type}
                        color={TYPE_COLORS[n.Type] ?? "primary"}
                        size="small"
                      />
                      {!readIds.has(n.ID) && (
                        <Chip label="New" size="small" color="info" />
                      )}
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
            ))}

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => {
                    setPage(value);
                    void Log("frontend", "info", "state", `Page changed to ${value}`);
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}