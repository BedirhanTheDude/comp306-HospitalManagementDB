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
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";

const drawerWidth = 240;

function StatusChip({ status }) {
  const color =
    status === "Confirmed" ? "success" : status === "Pending" ? "warning" : "default";
  return <Chip size="small" label={status || "—"} color={color} variant="outlined" />;
}

export default function PatientHome() {
  // ---- PLACEHOLDER / EMPTY DATA (sonradan API ile doldur) ----
  const user = { fullName: "John Doe", subtitle: "User summary" };

  const notifications = []; // [{ id, text, timeAgo }]
  const reports = []; // [{ id, title, date }]
  const upcomingAppointments = []; // [{ id, datetime, doctor, department, status }]
  const previousAppointments = []; // same shape

  const healthOverview = {
    bloodPressure: "", // "120/80 mmHg"
    heartRate: "", // "72 bpm"
    weight: "", // "75 kg"
  };

  const [tab, setTab] = React.useState(0);

  const rowsToShow = tab === 0 ? upcomingAppointments : previousAppointments;

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
            <Avatar />
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {user.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.subtitle}
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* İstersen buraya menu eklenir */}
          <Typography variant="caption" color="text.secondary">
            Sidebar (placeholder)
          </Typography>
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
            <Typography variant="h6" fontWeight={800} color="text.primary">
              Patient Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* LEFT COLUMN: Notifications + Reports */}
            <Grid item xs={12} lg={6}>
              <Stack spacing={3}>
                {/* Notifications */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                      <NotificationsNoneIcon />
                      <Typography variant="h6" fontWeight={800}>
                        Notifications
                      </Typography>
                    </Stack>

                    {notifications.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        (No notifications yet)
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {notifications.map((n) => (
                          <ListItem
                            key={n.id}
                            disableGutters
                            secondaryAction={
                              <Typography variant="caption" color="text.secondary">
                                {n.timeAgo}
                              </Typography>
                            }
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

                {/* My Reports */}
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                      <InsertDriveFileOutlinedIcon />
                      <Typography variant="h6" fontWeight={800}>
                        My Reports
                      </Typography>
                    </Stack>

                    {reports.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        (No reports yet)
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {reports.map((r) => (
                          <ListItem
                            key={r.id}
                            disableGutters
                            secondaryAction={
                              <IconButton size="small" aria-label="download">
                                <DownloadOutlinedIcon fontSize="small" />
                              </IconButton>
                            }
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
              </Stack>
            </Grid>

            {/* RIGHT COLUMN: Make Appointment */}
            <Grid item xs={12} lg={6}>
              <Card sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent sx={{ height: "100%" }}>
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Make an Appointment
                  </Typography>

                  <Box
                    sx={{
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: 3,
                      p: 4,
                      height: "calc(100% - 44px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 1.5,
                      bgcolor: "#fff",
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56 }}>
                      <CalendarMonthOutlinedIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={900}>
                      Book New Appointment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      (Placeholder) Book new appointment and tailor it to your needs.
                    </Typography>

                    <Button
                      variant="contained"
                      size="large"
                      sx={{ mt: 2, borderRadius: 2, px: 4 }}
                      startIcon={<CalendarMonthOutlinedIcon />}
                      onClick={() => {
                        // TODO: open modal / navigate
                      }}
                    >
                      Schedule Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* BOTTOM LEFT: Appointments */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} mb={1}>
                    Appointments
                  </Typography>

                  <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 2 }}
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label="Upcoming Appointments" />
                    <Tab label="Previous Appointments" />
                  </Tabs>

                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Date & Time</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Doctor</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {rowsToShow.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Typography variant="body2" color="text.secondary">
                                (No appointments yet)
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          rowsToShow.map((a) => (
                            <TableRow key={a.id} hover>
                              <TableCell>{a.datetime || "—"}</TableCell>
                              <TableCell>{a.doctor || "—"}</TableCell>
                              <TableCell>{a.department || "—"}</TableCell>
                              <TableCell>
                                <StatusChip status={a.status} />
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                    onClick={() => {
                                      // TODO: reschedule
                                    }}
                                  >
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    sx={{ borderRadius: 2 }}
                                    onClick={() => {
                                      // TODO: cancel
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Stack>
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

            {/* BOTTOM RIGHT: Health Overview */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Health Overview
                  </Typography>

                  <Stack spacing={1.5}>
                    <OverviewRow
                      icon={<MonitorHeartOutlinedIcon />}
                      label="Blood Pressure"
                      value={healthOverview.bloodPressure || "—"}
                    />
                    <OverviewRow
                      icon={<FavoriteBorderOutlinedIcon />}
                      label="Heart Rate"
                      value={healthOverview.heartRate || "—"}
                    />
                    <OverviewRow
                      icon={<FitnessCenterOutlinedIcon />}
                      label="Weight"
                      value={healthOverview.weight || "—"}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

function OverviewRow({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "#fff",
      }}
    >
      <Avatar sx={{ width: 36, height: 36 }}>{icon}</Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight={800}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
