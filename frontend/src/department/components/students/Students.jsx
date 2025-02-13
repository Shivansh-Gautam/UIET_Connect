import React, { useState, useEffect } from "react";
import backgroundImage from "../../../assets/Teacher_on_podium.jpeg";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Box,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material";
import { useFormik } from "formik";
import axios from "axios";
import SnackbarAlert from "../../../basic utility components/snackbar/SnackbarAlert";
import { studentSchema } from "../../../yupSchema/studentSchema";
import { baseApi } from "../../../environment";

const Students = () => {
  const token = localStorage.getItem("authToken");

  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSemesters = async () => {
    if (!token) {
      setSnackbar({ open: true, message: "Authorization token missing", severity: "error" });
      return;
    }
    try {
      const response = await axios.get(`${baseApi}/semester/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(response.data.data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setSnackbar({ open: true, message: "Failed to fetch semesters", severity: "error" });
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      student_class: "",
      gender: "",
      age: "",
      guardian: "",
      guardian_phone: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: studentSchema,
    onSubmit: async (values) => {
      if (!image) {
        setSnackbar({
          open: true,
          message: "Please upload an image before registering.",
          severity: "warning",
        });
        return;
      }
      if (!token) {
        setSnackbar({ open: true, message: "Authorization token missing", severity: "error" });
        return;
      }

      const fd = new FormData();
      fd.append("image", image, image.name);
      Object.keys(values).forEach((key) => fd.append(key, values[key]));

      try {
        await axios.post(`${baseApi}/student/register`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({
          open: true,
          message: "Registered Successfully!",
          severity: "success",
        });
        formik.resetForm();
        setImage(null);
      } catch (e) {
        setSnackbar({
          open: true,
          message: e.response?.data?.message || "Registration failed. Try again.",
          severity: "error",
        });
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        marginTop: "30px",
        marginBottom: "30px",
        borderRadius: "40px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        display="flex"
        borderRadius={6}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        width="100%"
        p={2}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          p={5}
          bgcolor="rgba(0, 0, 0, 0.5)"
          borderRadius={6}
          sx={{
            backgroundColor: "black",
            opacity: "70%",
            height: "400px",
            color: "white",
          }}
        >
          <Typography variant="subtitle1" color="primary" gutterBottom>
            UNLOCK YOUR ACADEMIC POTENTIAL
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom>
            Register Student
          </Typography>
          <Typography variant="body1">
            Access your personalized student dashboard, manage your academic
            profile, and stay updated with important notices.
          </Typography>
        </Box>
        <Box
          flex={1}
          p={4}
          borderRadius={6}
          boxShadow={18}
          sx={{ backgroundColor: "white" }}
          mt={{ xs: 4, md: 0 }}
          ml={{ md: 4 }}
        >
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={formik.handleSubmit}
          >
            <Box sx={{ textAlign: "center" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-image"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="upload-image">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<CloudUpload />}
                >
                  Upload Image
                </Button>
              </label>
              {image && (
                <Avatar
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  sx={{ width: 100, height: 100, margin: "10px auto" }}
                />
              )}
            </Box>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors?.name}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors?.email}
            />
            <TextField
              select
              fullWidth
              label="Student Class"
              variant="outlined"
              {...formik.getFieldProps("student_class")}
              error={
                formik.touched.student_class &&
                Boolean(formik.errors.student_class)
              }
              helperText={
                formik.touched.student_class && formik.errors?.student_class
              }
            >
              {semesters.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.semester_text} ({x.semester_num})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Gender"
              variant="outlined"
              {...formik.getFieldProps("gender")}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors?.gender}
            >
              {["Male", "Female", "Other"].map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Age"
              variant="outlined"
              {...formik.getFieldProps("age")}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors?.age}
            />

            <TextField
              fullWidth
              label="Guardian"
              variant="outlined"
              {...formik.getFieldProps("guardian")}
              error={formik.touched.guardian && Boolean(formik.errors.guardian)}
              helperText={formik.touched.guardian && formik.errors?.guardian}
            />

            <TextField
              fullWidth
              label="Guardian Phone"
              variant="outlined"
              {...formik.getFieldProps("guardian_phone")}
              error={
                formik.touched.guardian_phone &&
                Boolean(formik.errors.guardian_phone)
              }
              helperText={
                formik.touched.guardian_phone && formik.errors?.guardian_phone
              }
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors?.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              {...formik.getFieldProps("confirm_password")}
              error={
                formik.touched.confirm_password &&
                Boolean(formik.errors.confirm_password)
              }
              helperText={
                formik.touched.confirm_password &&
                formik.errors?.confirm_password
              }
            />
            <Button fullWidth variant="contained" color="primary" type="submit">
              Register
            </Button>
          </Box>
          <SnackbarAlert
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Students;
