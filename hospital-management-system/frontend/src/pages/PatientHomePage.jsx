// PatientHome.jsx
import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Chip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { findAppointments, cancelAppointment } from "../services/appointmentService";

const drawerWidth = 240;

function StatusChip({ status }) {
  const normalized = (status || "").toLowerCase();
  const color =
    normalized === "confirmed"
      ? "success"
      : normalized === "pending"
      ? "warning"
      : normalized === "cancelled" || normalized === "canceled"
      ? "error"
      : "default";

  return <Chip size="small" label={status || "—"} color={color} variant="outlined" />;
}

function SectionHeader({ icon, title, right }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="h6" fontWeight={900}>
          {title}
        </Typography>
      </Stack>
      {right || null}
    </Stack>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        borderRadius: 3,
        border: "1px dashed rgba(0,0,0,0.18)",
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 48, height: 48 }}>{icon}</Avatar>
      <Box>
        <Typography fontWeight={900}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default function PatientHome({ goToAppointment }) {
  // ---- Get user info from localStorage ----
  const fullName = localStorage.getItem("patientFullName") || "Guest";
  const ssn = localStorage.getItem("patientSSN") || ""; // identityNumber / ssn
  const gender = localStorage.getItem("patientGender") || "";

  const genderDisplay = gender === "M" ? "Male" : gender === "F" ? "Female" : "";

  // Notifications (placeholder)
  const notifications = [
    { id: 1, text: "Your appointment is confirmed.", timeAgo: "Just now" },
  ];

  // Reports (placeholder)
  const reports = []; // [{ id, title, date }]

  // Appointments from backend
  const [appointments, setAppointments] = React.useState([]);

  // helper: backend fields -> JS Date
  const toDate = (a) => {
    // backend month is assumed 1-based, JS month is 0-based
    return new Date(
      a?.year ?? 1970,
      (a?.month ?? 1) - 1,
      a?.day ?? 1,
      a?.hour ?? 0,
      a?.minute ?? 0
    );
  };

  const formatDateTime = (a) => {
    const d = toDate(a);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const genderLabel = (g) => (g === "M" ? "Male" : g === "F" ? "Female" : g || "—");

  React.useEffect(() => {
    const loadAppointments = async () => {
      if (!ssn) return;
      try {
        const response = await findAppointments(ssn);
        if (response?.success && Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    };
    loadAppointments();
  }, [ssn]);

  // Filter appointments into upcoming and previous
  const now = new Date();
  const upcomingAppointments = appointments
    .filter((a) => toDate(a) >= now)
    .sort((a, b) => toDate(a) - toDate(b));

  const previousAppointments = appointments
    .filter((a) => toDate(a) < now)
    .sort((a, b) => toDate(b) - toDate(a));

  const [tab, setTab] = React.useState(0);
  const rowsToShow = tab === 0 ? upcomingAppointments : previousAppointments;

  // UI tuning
  const topCardHeight = 360;

  const cardSx = {
    borderRadius: 3,
    height: "100%",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  };

  const handleCancel = async (appointmentID) => {
    const response = await cancelAppointment(appointmentID);
    if (response.success) {
      // Randevuyu listeden kaldır
      setAppointments((prev) => prev.filter((a) => a.appointmentID !== appointmentID));
    } else {
      console.error("Cancel failed:", response.error);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#EEF3F9", minHeight: "100vh" }}>
      <CssBaseline />

      {/* LEFT SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(0,0,0,0.08)",
            bgcolor: "#fff",
          },
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar>{(fullName || "G").charAt(0).toUpperCase()}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={800}>
                {fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {genderDisplay}
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              SSN
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {ssn || "—"}
            </Typography>
          </Stack>
        </Box>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flexGrow: 1 }}>
        {/* TOP BAR */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Toolbar sx={{ minHeight: 72 }}>
            <Typography variant="h6" fontWeight={900} color="text.primary">
              Patient Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* CENTERED CONTENT */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Grid container spacing={3} alignItems="stretch">
              {/* TOP ROW */}
              <Grid item xs={12} lg={4} sx={{ display: "flex" }}>
                <Card sx={{ ...cardSx, minHeight: topCardHeight, flex: 1 }}>
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    <SectionHeader
                      icon={<NotificationsNoneIcon />}
                      title="Notifications"
                      right={
                        <Chip size="small" label={`${notifications.length}`} variant="outlined" />
                      }
                    />

                    {notifications.length === 0 ? (
                      <EmptyState
                        icon={<NotificationsNoneIcon />}
                        title="No notifications"
                        subtitle="You’re all caught up."
                      />
                    ) : (
                      <List dense disablePadding sx={{ flexGrow: 1 }}>
                        {notifications.map((n) => (
                          <ListItem
                            key={n.id}
                            disableGutters
                            secondaryAction={
                              <Typography variant="caption" color="text.secondary">
                                {n.timeAgo}
                              </Typography>
                            }
                            sx={{ py: 1 }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <NotificationsNoneIcon fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={n.text} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4} sx={{ display: "flex" }}>
                <Card sx={{ ...cardSx, minHeight: topCardHeight, flex: 1 }}>
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    <SectionHeader
                      icon={<InsertDriveFileOutlinedIcon />}
                      title="My Reports"
                      right={<Chip size="small" label={`${reports.length}`} variant="outlined" />}
                    />

                    {reports.length === 0 ? (
                      <EmptyState
                        icon={<InsertDriveFileOutlinedIcon />}
                        title="No reports"
                        subtitle="Your lab reports will appear here."
                      />
                    ) : (
                      <List dense disablePadding sx={{ flexGrow: 1 }}>
                        {reports.map((r) => (
                          <ListItem
                            key={r.id}
                            disableGutters
                            secondaryAction={
                              <IconButton size="small" aria-label="download">
                                <DownloadOutlinedIcon fontSize="small" />
                              </IconButton>
                            }
                            sx={{ py: 1 }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                <InsertDriveFileOutlinedIcon fontSize="small" />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={r.title}
                              secondary={r.date ? String(r.date) : ""}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4} sx={{ display: "flex" }}>
                <Card sx={{ ...cardSx, minHeight: topCardHeight, flex: 1 }}>
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    <SectionHeader icon={<CalendarMonthOutlinedIcon />} title="Make an Appointment" />

                    <Box
                      sx={{
                        flexGrow: 1,
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 3,
                        p: 3,
                        bgcolor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <Avatar sx={{ width: 56, height: 56 }}>
                        <CalendarMonthOutlinedIcon />
                      </Avatar>

                      <Typography variant="h6" fontWeight={950} align="center">
                        Book New Appointment
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ maxWidth: 260 }}
                      >
                        Choose a department, doctor, and time slot.
                      </Typography>

                      <Button
                        variant="contained"
                        size="large"
                        sx={{ mt: 1, borderRadius: 2, px: 4 }}
                        startIcon={<CalendarMonthOutlinedIcon />}
                        onClick={goToAppointment}
                      >
                        Schedule Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* BOTTOM ROW: APPOINTMENTS */}
              <Grid item xs={12}>
                <Card sx={cardSx}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="h6" fontWeight={900}>
                        Appointments
                      </Typography>

                      <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                          minHeight: 36,
                          "& .MuiTab-root": { minHeight: 36, fontWeight: 800 },
                        }}
                      >
                        <Tab label={`Upcoming (${upcomingAppointments.length})`} />
                        <Tab label={`Previous (${previousAppointments.length})`} />
                      </Tabs>
                    </Stack>

                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{ borderRadius: 2, overflow: "hidden" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                            <TableCell sx={{ fontWeight: 900 }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 900 }}>Doctor</TableCell>
                            <TableCell sx={{ fontWeight: 900 }}>Gender</TableCell>
                            <TableCell sx={{ fontWeight: 900 }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 900 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 900 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {rowsToShow.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} sx={{ py: 4 }}>
                                <Stack alignItems="center" spacing={0.5}>
                                  <Typography fontWeight={900}>No appointments yet</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    When you book one, it will show up here.
                                  </Typography>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ) : (
                            rowsToShow.map((a) => (
                              <TableRow key={a.appointmentID ?? a.id} hover>
                                <TableCell>{formatDateTime(a)}</TableCell>
                                <TableCell>{a.doctorFullName || "—"}</TableCell>
                                <TableCell>{genderLabel(a.doctorGender)}</TableCell>
                                <TableCell>
                                  {typeof a.price === "number"
                                    ? `${a.price.toFixed(2)} ₺`
                                    : a.price ?? "—"}
                                </TableCell>
                                <TableCell>
                                  <StatusChip status={a.status} />
                                </TableCell>
                                <TableCell>
                                  {tab === 0 ? (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="error"
                                      sx={{ borderRadius: 2 }}
                                      onClick={() => {handleCancel(a.appointmentID)
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  ) : (
                                    "—"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
