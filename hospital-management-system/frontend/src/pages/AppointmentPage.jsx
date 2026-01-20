import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getPoliclinics, getCities, fetchDoctors, bookAppointment } from "../services/appointmentService";


const TIME_SLOTS = [
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00",
];

function RatingChip({ value }) {
  const v = value ?? "—";
  return <Chip size="small" label={`Rating: ${v}`} variant="outlined" />;
}

export default function AppointmentPage({ goBack }) {
  // ---- filter options from API ----
  const [policlinics, setPoliclinics] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // ---- selected filters ----
  const [policlinic, setPoliclinic] = React.useState("");
  const [city, setCity] = React.useState("");
  const [minRating, setMinRating] = React.useState("");
  const [maxRating, setMaxRating] = React.useState("");

  // ---- results ----
  const [doctors, setDoctors] = React.useState([]);

  // ---- popup state ----
  const [open, setOpen] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState(null);
  const [selectedSlot, setSelectedSlot] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(""); // "YYYY-MM-DD"

const [submitting, setSubmitting] = React.useState(false);
const [toast, setToast] = React.useState({ open: false, severity: "success", message: "" });
  // Fetch filter options on mount
  React.useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      try {
        const [policlinicsRes, citiesRes] = await Promise.all([
          getPoliclinics(),
          getCities(),
        ]);

        if (policlinicsRes.success && policlinicsRes.data) {
          setPoliclinics(policlinicsRes.data);
          if (policlinicsRes.data.length > 0) {
            setPoliclinic(policlinicsRes.data[0]);
          }
        }

        if (citiesRes.success && citiesRes.data) {
          setCities(citiesRes.data);
          if (citiesRes.data.length > 0) {
            setCity(citiesRes.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const clampRating = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    const n = Number(val);
    if (Number.isNaN(n)) return "";
    return String(Math.min(5, Math.max(1, n)));
  };

  const handleMinChange = (e) => setMinRating(clampRating(e.target.value));
  const handleMaxChange = (e) => setMaxRating(clampRating(e.target.value));

  const handleFind = async () => {
    const request = {
      policlinicName: policlinic,
      cityName: city,
      minRating,
      maxRating,
    };

    const response = await fetchDoctors(request);

    if (response.success && response.data) {
      // Map backend DoctorSearchResponse fields to frontend format
      const mappedDoctors = response.data.map((doc) => ({
        id: doc.doctorId,
        fullName: doc.doctorFullName,
        gender: doc.doctorGender,
        rating: doc.doctorRating,
        department: policlinic,
        hospital: city,
        slots: TIME_SLOTS
      }));
      setDoctors(mappedDoctors);
    } else {
      setDoctors([]);
      console.error("Error fetching doctors:", response.error);
    }
  };

  const openDoctorDialog = (doc) => {
  setSelectedDoctor(doc);
  setSelectedSlot("");
  setSelectedDate("");
  setOpen(true);
};

  const closeDialog = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setSelectedSlot("");
  };


  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedSlot) return;

    // Get patient SSN from localStorage (set during login)
    const patientSSN = localStorage.getItem("patientSSN");
    if (!patientSSN) {
      setToast({ open: true, severity: "error", message: "Please login first." });
      return;
    }

    setSubmitting(true);
    try {
      const [year, month, day] = selectedDate.split("-");
      const [hour, minute] = selectedSlot.split(":");

      const request = {
        patientSSN: Number(patientSSN),
        doctorID: selectedDoctor.id,
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
      };

      const response = await bookAppointment(request);

      if (response.success && response.data?.appointmentCreated) {
        setToast({ open: true, severity: "success", message: response.data.message || "Appointment confirmed!" });
        closeDialog();
      } else {
        setToast({
          open: true,
          severity: "error",
          message: response.data?.message || response.error || "Selected date & slot is not available.",
        });
      }
    } catch (e) {
      setToast({ open: true, severity: "error", message: e.message || "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "#EEF3F9",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#EEF3F9", minHeight: "100vh", p: 3 }}>
      {/* Sayfa ortalama container */}
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            sx={{ borderRadius: 2 }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h6" fontWeight={900}>
            Appointment Page
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {/* FILTERS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                  Filter Doctors
                </Typography>

                <Grid container spacing={2} alignItems="stretch">
                  {/* Policlinic */}
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      select
                      fullWidth
                      label="Select Policlinic"
                      value={policlinic}
                      onChange={(e) => setPoliclinic(e.target.value)}
                    >
                      {policlinics.map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* City */}
                  <Grid item xs={12} md={6} lg={3}>
                    <TextField
                      select
                      fullWidth
                      label="Select City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {cities.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Min rating */}
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField
                      fullWidth
                      label="Min Rating (1-5)"
                      value={minRating}
                      onChange={handleMinChange}
                      placeholder="e.g. 3"
                      inputProps={{ inputMode: "numeric" }}
                    />
                  </Grid>

                  {/* Max rating */}
                  <Grid item xs={12} md={6} lg={2}>
                    <TextField
                      fullWidth
                      label="Max Rating (1-5)"
                      value={maxRating}
                      onChange={handleMaxChange}
                      placeholder="e.g. 5"
                      inputProps={{ inputMode: "numeric" }}
                    />
                  </Grid>

                  {/* Button: aynı satır hizası */}
                  <Grid item xs={12} lg={2} sx={{ display: "flex" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<SearchOutlinedIcon />}
                      sx={{ borderRadius: 2 }}
                      onClick={handleFind}
                    >
                      Find Doctors
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* DOCTORS */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>
                  Available Doctors
                </Typography>

                {doctors.length === 0 ? (
                  <Box
                    sx={{
                      border: "1px dashed rgba(0,0,0,0.18)",
                      borderRadius: 3,
                      p: 4,
                      bgcolor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56 }}>
                      <PersonOutlineOutlinedIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={900}>No doctors listed yet</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Set filters and click "Find Doctors".
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {doctors.map((d) => (
                      <Card
                        key={d.id}
                        variant="outlined"
                        sx={{
                          borderRadius: 3,
                          bgcolor: "#fff",
                          borderColor: "rgba(0,0,0,0.10)",
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={9}>
                              <Stack spacing={0.5}>
                                <Typography fontWeight={900}>{d.fullName}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {d.department} • {d.hospital}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                  <LocalHospitalOutlinedIcon fontSize="small" />
                                  <RatingChip value={d.rating} />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    icon={<AccessTimeOutlinedIcon />}
                                    label={
                                      d.slots?.length
                                        ? `Next: ${d.slots.slice(0, 3).join(" • ")}`
                                        : "No slots preview"
                                    }
                                  />
                                </Stack>
                              </Stack>
                            </Grid>

                            <Grid item xs={12} md={3}>
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent={{ xs: "flex-start", md: "flex-end" }}
                              >
                                <Button
                                  variant="contained"
                                  sx={{ borderRadius: 2 }}
                                  onClick={() => openDoctorDialog(d)}
                                >
                                  Select
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* POPUP: Slot seç + onay */}
        <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ pr: 6 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar>
                <PersonOutlineOutlinedIcon />
              </Avatar>
              <Box>
                <Typography fontWeight={900}>
                  {selectedDoctor?.fullName || "Select Doctor"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDoctor?.department || "—"} • {selectedDoctor?.hospital || "—"}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={closeDialog}
              sx={{ position: "absolute", right: 12, top: 12 }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          
<DialogContent dividers>
  <Typography fontWeight={800} sx={{ mb: 1 }}>
    Select day
  </Typography>

  <TextField
    fullWidth
    label="Appointment Date"
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    InputLabelProps={{ shrink: true }}
    inputProps={{ min: new Date().toISOString().slice(0, 10) }} // geçmiş günleri kapat
    sx={{ mb: 2 }}
  />

  <Typography fontWeight={800} sx={{ mb: 1 }}>
    Select slot
  </Typography>

  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
    {TIME_SLOTS.map((s) => (
      <Chip
        key={s}
        label={s}
        clickable
        onClick={() => setSelectedSlot(s)}
        color={selectedSlot === s ? "primary" : "default"}
        variant={selectedSlot === s ? "filled" : "outlined"}
        sx={{ borderRadius: 2 }}
      />
    ))}
  </Stack>

  <Divider sx={{ my: 2 }} />

  <Stack spacing={0.5}>
    <Typography variant="body2" color="text.secondary">
      Selected
    </Typography>
    <Typography fontWeight={900}>
      {selectedDate ? `${selectedDate} ` : ""}{selectedSlot || "—"}
    </Typography>
  </Stack>
</DialogContent>


          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDialog} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
           <Button
  onClick={handleConfirm}
  variant="contained"
  sx={{ borderRadius: 2 }}
  disabled={!selectedDoctor || !selectedDate || !selectedSlot || submitting}
>
  {submitting ? "Confirming..." : "Confirm Appointment"}
</Button>

            
          </DialogActions>
        </Dialog>

        {/* Toast notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setToast({ ...toast, open: false })}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
