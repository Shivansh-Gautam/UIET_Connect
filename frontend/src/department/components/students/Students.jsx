import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  CardMedia,
  CardContent,
  Card,
  Grid,
  CardActions,
} from "@mui/material";
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material";
import { useFormik } from "formik";
import axios from "axios";
import SnackbarAlert from "../../../basic utility components/snackbar/SnackbarAlert";
import {
  studentEditSchema,
  studentSchema,
} from "../../../yupSchema/studentSchema";
import { baseApi } from "../../../environment";

const Students = () => {
  const token = localStorage.getItem("authToken");
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [students, setStudents] = useState([]);
  const [params, setParams] = useState({});

  const fetchSemesters = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authorization token missing",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axios.get(`${baseApi}/semester/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(response.data.data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch semesters",
        severity: "error",
      });
    }
  };

  const fetchStudents = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authorization token missing",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axios.get(`${baseApi}/student/fetch-with-query`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch students",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [params]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleSemester = (e) => {
    setParams((prev) => ({
      ...prev,
      student_class: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prev) => ({
      ...prev,
      search: e.target.value || undefined,
    }));
  };

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id);
    const student = students.find((x) => x._id === id);
    formik.setValues({
      name: student.name,
      email: student.email,
      student_class: student.student_class._id,
      gender: student.gender,
      age: student.age,
      student_contact: student.student_contact,
      guardian: student.guardian,
      guardian_phone: student.guardian_phone,
      password: "",
      confirm_password: "",
    });
  };

  const handleDelete = async (id) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Authorization token missing",
        severity: "error",
      });
      return;
    }
    try {
      await axios.delete(`${baseApi}/student/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: "Student deleted successfully!",
        severity: "success",
      });
      fetchStudents();
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete student",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setEdit(false);
    setImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

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
      student_contact: "",
      guardian: "",
      guardian_phone: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: edit ? studentEditSchema : studentSchema,
    onSubmit: async (values) => {
      if (!edit && !image) {
        setSnackbar({
          open: true,
          message: "Please upload an image before registering.",
          severity: "warning",
        });
        return;
      }
      if (!token) {
        setSnackbar({
          open: true,
          message: "Authorization token missing",
          severity: "error",
        });
        return;
      }

      const fd = new FormData();
      if (image) fd.append("image", image, image.name);
      Object.keys(values).forEach((key) => fd.append(key, values[key]));

      try {
        if (edit) {
          await axios.patch(`${baseApi}/student/update/${editId}`, fd, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSnackbar({
            open: true,
            message: "Student updated successfully!",
            severity: "success",
          });
        } else {
          await axios.post(`${baseApi}/student/register`, fd, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSnackbar({
            open: true,
            message: "Registered successfully!",
            severity: "success",
          });
        }
        formik.resetForm();
        setEdit(false);
        setImage(null);
        fetchStudents();
      } catch (error) {
        console.error("Submit error:", error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Operation failed",
          severity: "error",
        });
      }
    },
  });

  return (
    <>
      {/* Form Section */}
      <Container
        maxWidth="sm"
        sx={{ mt: 8, mb: 8, p: 4, borderRadius: 4, boxShadow: 9 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          {edit ? "Edit Student" : "Add New Student"}
        </Typography>

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

          {/* Fields */}
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
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
              formik.touched.student_class && formik.errors.student_class
            }
          >
            {semesters.map((sem) => (
              <MenuItem key={sem._id} value={sem._id}>
                {sem.semester_text} ({sem.semester_num})
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
            helperText={formik.touched.gender && formik.errors.gender}
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
            helperText={formik.touched.age && formik.errors.age}
          />
          <TextField
            fullWidth
            label="Student Contact"
            variant="outlined"
            {...formik.getFieldProps("student_contact")}
            error={
              formik.touched.student_contact &&
              Boolean(formik.errors.student_contact)
            }
            helperText={
              formik.touched.student_contact && formik.errors.student_contact
            }
          />
          <TextField
            fullWidth
            label="Guardian"
            variant="outlined"
            {...formik.getFieldProps("guardian")}
            error={formik.touched.guardian && Boolean(formik.errors.guardian)}
            helperText={formik.touched.guardian && formik.errors.guardian}
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
              formik.touched.guardian_phone && formik.errors.guardian_phone
            }
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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
              formik.touched.confirm_password && formik.errors.confirm_password
            }
          />

          {/* Buttons */}
          <Box sx={{ textAlign: "center" }}>
            <Button
              sx={{ width: "120px", m: 1 }}
              variant="contained"
              color="primary"
              type="submit"
            >
              {edit ? "Update" : "Register"}
            </Button>
            {edit && (
              <Button
                sx={{ width: "120px", m: 1, background: "red" }}
                variant="contained"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>

        <SnackbarAlert
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
        />
      </Container>

      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          mx: 4,
          mb: 4,
        }}
      >
        <TextField
          select
          label="Filter by Semester"
          variant="outlined"
          value={params.student_class || ""}
          onChange={handleSemester}
          sx={{ flex: 1 }}
        >
          <MenuItem value="">All Semesters</MenuItem>
          {semesters.map((sem) => (
            <MenuItem key={sem._id} value={sem._id}>
              {sem.semester_text} ({sem.semester_num})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          onChange={handleSearch}
          sx={{ flex: 2 }}
        />
      </Box>

      {/* Students List */}
      <Grid container spacing={2} sx={{ px: 4, mb: 8 }}>
        {students.map((student) => (
          <Grid item key={student._id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={student?.imageUrl}
                alt={student?.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact: {student.student_contact}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(student._id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(student._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Students;
