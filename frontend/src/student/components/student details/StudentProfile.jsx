import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";
import SnackbarAlert from "../../../basic utility components/snackbar/SnackbarAlert";

const StudentProfile = () => {
  const token = localStorage.getItem("authToken");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showDetails, setShowDetails] = useState(false);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchStudentDetails = async () => {
    if (!token) {
      setAlert({
        open: true,
        message: "Authorization token missing",
        severity: "error",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${baseApi}/student/fetch-single`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(response.data.student);
      setFormData(response.data.student);
    } catch (error) {
      console.error("Error fetching student details:", error);
      setAlert({
        open: true,
        message: "Failed to fetch student details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStudentDetails = async () => {
    try {
      setLoading(true);
      await axios.patch(`${baseApi}/student/update/${student._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
      setEditing(false);
      fetchStudentDetails();
    } catch (error) {
      console.error("Error updating student profile:", error);
      setAlert({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDetails) {
      fetchStudentDetails();
    }
  }, [showDetails]);

  const getImageUrl = (filename) => {
    if (!filename) return "";
    return `${baseApi}/student_images/${filename}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SnackbarAlert {...alert} onClose={handleAlertClose} />

      <Typography
        variant="h3"
        sx={{ textAlign: "center", fontWeight: 700, color: "#1976d2", mb: 4 }}
      >
        Student Profile
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4, gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Profile" : "View Profile"}
        </Button>

        {showDetails && !editing && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      {showDetails && (
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#f9fafb",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : student ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              {student?.student_image && (
                <Avatar
                  src={getImageUrl(student.student_image)}
                  alt={student.name}
                  sx={{ width: 120, height: 120 }}
                />
              )}

              {editing ? (
                <>
                  <TextField
                    label="Name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Age"
                    name="age"
                    value={formData.age || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Contact"
                    name="student_contact"
                    value={formData.student_contact || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Guardian"
                    name="guardian"
                    value={formData.guardian || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    label="Guardian Phone"
                    name="guardian_phone"
                    value={formData.guardian_phone || ""}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={updateStudentDetails}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h5">
                    <strong>Name:</strong> {student?.name}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Email:</strong> {student?.email}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Gender:</strong> {student?.gender}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Age:</strong> {student?.age}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Contact:</strong> {student?.student_contact}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Guardian:</strong> {student?.guardian}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Guardian Phone:</strong> {student?.guardian_phone}
                  </Typography>
                </>
              )}
            </Box>
          ) : (
            <Typography variant="h6" color="textSecondary" textAlign="center">
              No student data available.
            </Typography>
          )}
        </Paper>
      )}
    </>
  );
};

export default StudentProfile;
