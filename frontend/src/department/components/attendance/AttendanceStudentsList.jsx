import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
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
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
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

const AttendanceStudentsList = () => {
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

  const [params, setParams] = useState({});

  const handleSemester = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
  };

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };

  // const handleEdit = (id) => {
  //   setEdit(true);
  //   setEditId(id);
  //   const student = students.find((x) => x._id === id);
  //   formik.setValues({
  //     name: student.name,
  //     email: student.email,
  //     student_class: student.student_class._id,
  //     gender: student.gender,
  //     age: student.age,
  //     student_contact: student.student_contact,
  //     guardian: student.guardian,
  //     guardian_phone: student.guardian_phone,
  //     password: "",
  //     confirm_password: "",
  //   });
  // };

  // const handleDelete = async (studentId) => {
  //   if (!token) {
  //     setSnackbar({ open: true, message: "Authorization token missing", severity: "error" });
  //     return;
  //   }
  //   try {
  //     await axios.delete(`${baseApi}/student/delete/${studentId}`, { headers: { Authorization: `Bearer ${token}` } });
  //     setSnackbar({ open: true, message: "Student deleted successfully!", severity: "success" });
  //     fetchStudents();
  //   } catch (error) {
  //     setSnackbar({ open: true, message: "Failed to delete student", severity: "error" });
  //   }
  // };

  // const handleCancel = ()=>{
  //   formik.resetForm();
  //   setEdit(false)
  // }

  const [students, setStudents] = useState([]);

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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // const formik = useFormik({
  //   initialValues: {
  //     name: "",
  //     email: "",
  //     student_class: "",
  //     gender: "",
  //     age: "",
  //     student_contact: "",
  //     guardian: "",
  //     guardian_phone: "",
  //     password: "",
  //     confirm_password: "",
  //   },
  //   validationSchema:edit?studentEditSchema:studentSchema,
  //   onSubmit: async (values) => {
  //     if (!edit && !image) { // Only check for image on new registration
  //       setSnackbar({
  //         open: true,
  //         message: "Please upload an image before registering.",
  //         severity: "warning",
  //       });
  //       return;
  //     }
  //     if (!token) {
  //       setSnackbar({
  //         open: true,
  //         message: "Authorization token missing",
  //         severity: "error",
  //       });
  //       return;
  //     }

  //     const fd = new FormData();
  //     if (image) fd.append("image", image, image.name); // Only append image if present
  //     Object.keys(values).forEach((key) => fd.append(key, values[key]));

  //     try {
  //       if (edit) {
  //         await axios.patch(`${baseApi}/student/update/${editId}`, fd, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         setSnackbar({ open: true, message: "Student updated successfully!", severity: "success" });
  //       } else {
  //         await axios.post(`${baseApi}/student/register`, fd, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         setSnackbar({ open: true, message: "Registered Successfully!", severity: "success" });
  //       }
  //       formik.resetForm();
  //       setEdit(false);
  //       setImage(null);
  //       fetchStudents();
  //     } catch (e) {
  //       setSnackbar({ open: true, message: e.response?.data?.message || "Operation failed.", severity: "error" });
  //     }
  //   },
  // });

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setImage(file);
  //   }
  // };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
      >
        Student Attendance
      </Typography>
      <SnackbarAlert {...snackbar} onClose={handleCloseSnackbar} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Student Class"
              value={params.student_class || ""}
              onChange={handleSemester}
            >
              <MenuItem value="">Select Semester</MenuItem>
              {semesters.map((x) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.semester_text} ({x.semester_num})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Search"
              value={params.search || ""}
              onChange={handleSearch}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Age
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Gender
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Guardian
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Semester
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    Percentage
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    View
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student._id}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell>{student.name}</TableCell>
                    <TableCell align="right">{student.age}</TableCell>
                    <TableCell align="right">{student.gender}</TableCell>
                    <TableCell align="right">{student.guardian}</TableCell>
                    <TableCell align="right">
                      {student.student_class.semester_num}
                    </TableCell>
                    <TableCell align="right">"Percentage"</TableCell>
                    <TableCell align="right">"View"</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttendanceStudentsList;
