import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Container,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

const DoctorHomePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const doctorId = localStorage.getItem("doctor_id");
    if (!doctorId) {
      setError("Doctor ID not found. Please login again.");
      return;
    }

    api.get(`/doctors/${doctorId}/appointments/today`)
      .then((res) => {
        const data = res.data;
        setAppointments(Array.isArray(data) ? data : []);
      })
      .catch((e) => setError(e.response?.data?.error || "Failed to load appointments."));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Today’s Appointments</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Appointment ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No appointments today.</TableCell>
            </TableRow>
          ) : (
            appointments.map((a) => {
              const time = a.appointmentDateTime?.split("T")?.[1]?.slice(0, 5) || "-";
              return (
                <TableRow key={a.appointmentId}>
                  <TableCell>{time}</TableCell>
                  <TableCell>{a.patientFullName || "-"}</TableCell>
                  <TableCell>{a.status || "-"}</TableCell>
                  <TableCell>{a.appointmentId}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Container>
  );
};

export default DoctorHomePage;
