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
  ListItemButton,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { findAppointments, cancelAppointment } from "../services/appointmentService";
import { listTestResults, deleteTestResult, reviewAppointment , getBloodTestWarning, getDiscountNotification, getEpidemicsWarning, getAbnormalTestNotification} from "../services/patientService";

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
 const [notifications, setNotifications] = React.useState([]);
  

  // -----------------------------
  // ✅ TEST RESULTS (My Reports) FRONTEND INTEGRATION
  // You will fill this from backend later
  // Expected shape:
  // {
  //   testID, testName, value, minRef, maxRef, units, isBetweenRange,
  //   year, month, day, hour, minute, second
  // }
  // -----------------------------
  const [testResults, setTestResults] = React.useState([]); // <-- fill later from backend
  const [openReportDialog, setOpenReportDialog] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const toReportDate = (r) =>
    new Date(
      r?.year ?? 1970,
      (r?.month ?? 1) - 1,
      r?.day ?? 1,
      r?.hour ?? 0,
      r?.minute ?? 0,
      r?.second ?? 0
    );

  const formatReportDate = (r) => {
    const d = toReportDate(r);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  };

  const formatReportDateTime = (r) => {
    const d = toReportDate(r);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const openReport = (r) => {
    setSelectedReport(r);
    setOpenReportDialog(true);
  };

  const closeReport = () => {
    setOpenReportDialog(false);
    setSelectedReport(null);
  };

  const handleDeleteTestResult = async (testID) => {
    const response = await deleteTestResult(testID);
    if (response.success) {
      setTestResults((prev) => prev.filter((r) => r.testID !== testID));
      closeReport();
    } else {
      console.error("Delete failed:", response.error);
    }
  };

  // Review dialog state
  const [openReviewDialog, setOpenReviewDialog] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [reviewRating, setReviewRating] = React.useState(0);
  const [reviewComment, setReviewComment] = React.useState("");

  const openReview = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewRating(0);
    setReviewComment("");
    setOpenReviewDialog(true);
  };

  const closeReview = () => {
    setOpenReviewDialog(false);
    setSelectedAppointment(null);
    setReviewRating(0);
    setReviewComment("");
  };

  const handleSubmitReview = async () => {
    if (!selectedAppointment || reviewRating === 0) return;
    const request = {
      appointmentID: selectedAppointment.appointmentID,
      rating: reviewRating,
      comment: reviewComment,
    };
    const response = await reviewAppointment(request);
    if (response.success) {
      closeReview();
    } else {
      console.error("Review failed:", response.error);
    }
  };

  // Appointments from backend
  const [appointments, setAppointments] = React.useState([]);

  // helper: backend fields -> JS Date
  const toDate = (a) => {
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
    const loadTestResults = async () => {
      if (!ssn) return;
      try{
        const response = await listTestResults(ssn);
        if (response?.success && Array.isArray(response.data)) {
          setTestResults(response.data);
        } else {
          setTestResults([]);
        }
      }
      catch (error) {
        console.error("Error fetching test results:", error);
        setTestResults([]);
      }
    }

    const loadNotifications = async () => {
      if (!ssn) return;
      try {
        const notificationList = [];

        // Blood test warning
        const testRes = await getBloodTestWarning(ssn);
        if (testRes?.success && Array.isArray(testRes.data)) {
          // New format with data array
          testRes.data.forEach((item, idx) => {
            notificationList.push({
              id: item.id || `blood_test_${idx}`,
              text: item.text || "You have not had a blood test in the last 6 months.",
              type: item.type || "warning",
            });
          });
        } else if (testRes) {
          // Old format: {"message text": true/false}
          const keys = Object.keys(testRes).filter(k => k !== 'success' && k !== 'error' && k !== 'message');
          if (keys.length > 0 && testRes[keys[0]] === true) {
            notificationList.push({
              id: "blood_test_warning",
              text: keys[0],
              type: "warning",
            });
          } else {
            notificationList.push({
              id: "blood_test_status",
              text: "Your blood test records are up to date.",
              type: "success",
            });
          }
        }

        const abnormalRes = await getAbnormalTestNotification(ssn);
        if (abnormalRes?.success && Array.isArray(abnormalRes.data)) {
          abnormalRes.data.forEach((item, idx) => {
            notificationList.push({
              id: item.id || `abnormal_test_${idx}`,
              text:
                item.text ||
                "One or more of your recent test results are outside the normal range.",
              type: item.type || "warning",
            });
          });
        }

        // Epidemic warnings
        const epidemicRes = await getEpidemicsWarning();
        if (epidemicRes?.success && Array.isArray(epidemicRes.data)) {
          epidemicRes.data.forEach((item, idx) => {
            // Handle both old format (diagnosis, count) and new format (id, text, type)
            const text = item.text || `Warning: ${item.diagnosis} outbreak detected (${item.count} cases this month)`;
            notificationList.push({
              id: item.id || `epidemic_${idx}`,
              text: text,
              type: item.type || "epidemic",
            });
          });
        }

        // Discount notifications
        const discountRes = await getDiscountNotification(ssn);
        if (discountRes?.success && Array.isArray(discountRes.data)) {
          // New format with data array
          discountRes.data.forEach((item, idx) => {
            notificationList.push({
              id: item.id || `discount_${idx}`,
              text: item.text || "You are eligible for a 20% discount on tests.",
              type: item.type || "info",
            });
          });
        } else if (discountRes?.success && discountRes.message) {
          // Old format with message field
          const isEligible = discountRes.message.toLowerCase().includes("eligible") &&
                            !discountRes.message.toLowerCase().includes("not eligible");
          notificationList.push({
            id: "discount_status",
            text: discountRes.message,
            type: isEligible ? "info" : "neutral",
          });
        }

        setNotifications(notificationList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    }


    loadAppointments();
    loadTestResults();
    loadNotifications();
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
                        subtitle="You're all caught up."
                      />
                    ) : (
                      <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 280 }}>
                        <Stack spacing={1.5}>
                          {notifications.map((n) => {
                            // Define styles based on notification type
                            const typeStyles = {
                              warning: { bg: "#FFF3E0", border: "#FFB74D", icon: "#F57C00", Icon: WarningAmberIcon },
                              epidemic: { bg: "#FFEBEE", border: "#EF5350", icon: "#D32F2F", Icon: CoronavirusIcon },
                              success: { bg: "#E8F5E9", border: "#81C784", icon: "#388E3C", Icon: CheckCircleOutlineIcon },
                              info: { bg: "#E3F2FD", border: "#64B5F6", icon: "#1976D2", Icon: LocalOfferIcon },
                              neutral: { bg: "#F5F5F5", border: "#BDBDBD", icon: "#757575", Icon: InfoOutlinedIcon },
                            };

                            const style = typeStyles[n.type] || typeStyles.neutral;
                            const { bg: bgColor, border: borderColor, icon: iconColor, Icon } = style;

                            return (
                              <Paper
                                key={n.id}
                                elevation={0}
                                sx={{
                                  p: 1.5,
                                  borderRadius: 2,
                                  bgcolor: bgColor,
                                  border: `1px solid ${borderColor}`,
                                }}
                              >
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                  <Avatar
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      bgcolor: "white",
                                      border: `2px solid ${borderColor}`,
                                    }}
                                  >
                                    <Icon sx={{ color: iconColor, fontSize: 20 }} />
                                  </Avatar>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                      sx={{ color: "text.primary", lineHeight: 1.4 }}
                                    >
                                      {n.text}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Paper>
                            );
                          })}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* ✅ MY REPORTS -> TEST RESULTS LIST */}
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
                      title="My Test Results"
                      right={
                        <Chip size="small" label={`${testResults.length}`} variant="outlined" />
                      }
                    />

                    {testResults.length === 0 ? (
                      <EmptyState
                        icon={<InsertDriveFileOutlinedIcon />}
                        title="No test results"
                        subtitle="Your lab test results will appear here."
                      />
                    ) : (
                      <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 250 }}>
                        <List dense disablePadding>
                          {testResults.map((r) => (
                            <ListItem key={r.testID} disablePadding>
                              <ListItemButton
                                onClick={() => openReport(r)}
                                sx={{
                                  py: 1,
                                  borderRadius: 2,
                                  px: 1,
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    <InsertDriveFileOutlinedIcon fontSize="small" />
                                  </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                  primary={
                                    <Typography fontWeight={800} noWrap>
                                      {r.testName || "—"}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary" noWrap>
                                      {formatReportDate(r)}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card sx={{ ...cardSx, height: topCardHeight }}>
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    <SectionHeader
                      icon={<CalendarMonthOutlinedIcon />}
                      title="Make an Appointment"
                    />

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
                                      onClick={() => {
                                        handleCancel(a.appointmentID);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  ) : (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      sx={{ borderRadius: 2 }}
                                      onClick={() => openReview(a)}
                                    >
                                      Review
                                    </Button>
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

        {/*  REPORT DETAIL DIALOG */}
        <Dialog open={openReportDialog} onClose={closeReport} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>
            {selectedReport?.testName || "Test Result"}
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Date
                </Typography>
                <Typography fontWeight={800}>
                  {selectedReport ? formatReportDateTime(selectedReport) : "—"}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Value
                </Typography>
                <Typography fontWeight={900}>
                  {selectedReport?.value ?? "—"} {selectedReport?.units || ""}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Reference Range
                </Typography>
                <Typography fontWeight={800}>
                  {selectedReport?.minRef ?? "—"} - {selectedReport?.maxRef ?? "—"}{" "}
                  {selectedReport?.units || ""}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  size="small"
                  label={selectedReport?.betweenRange ? "Within range" : "Out of range"}
                  color={selectedReport?.betweenRange ? "success" : "error"}
                  variant="outlined"
                />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Test ID
                </Typography>
                <Typography fontWeight={800}>{selectedReport?.testID ?? "—"}</Typography>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="error"
              sx={{ borderRadius: 2 }}
              onClick={() => handleDeleteTestResult(selectedReport?.testID)}
            >
              Delete
            </Button>
            <Button onClick={closeReport} sx={{ borderRadius: 2 }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* REVIEW APPOINTMENT DIALOG */}
        <Dialog open={openReviewDialog} onClose={closeReview} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>
            Review Appointment
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Doctor
                </Typography>
                <Typography fontWeight={800}>
                  {selectedAppointment?.doctorFullName || "—"}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Rating
                </Typography>
                <Rating
                  value={reviewRating}
                  onChange={(_, newValue) => setReviewRating(newValue || 0)}
                  size="large"
                />
              </Stack>

              <TextField
                label="Comment (optional)"
                multiline
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeReview} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleSubmitReview}
              disabled={reviewRating === 0}
            >
              Submit Review
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
