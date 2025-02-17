import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";
import SnackbarAlert from "../../../basic utility components/snackbar/SnackbarAlert";

export default function Subjects() {
  const token = localStorage.getItem("authToken"); // Fetch token
 
  const [editId, setEditId] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

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
    
    const handleEdit = (subject) => {
      setEditId(subject._id);
      formik.setValues({
        subject_name: subject.subject_name,
        subject_codename: subject.subject_codename,
        student_class: subject.student_class._id,
      });
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.get(`${baseApi}/subject/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlert({
          open: true,
          message: "subject deleted successfully",
          severity: "success",
        });
        fetchSubject();
      } catch (error) {
        setAlert({
          open: true,
          message: "Error deleting subject",
          severity: "error",
        });
        console.error("Error deleting subject:", error);
      }
    };

    const [subject, setSubject] = useState([]);

    const fetchSubject = async () => {
      if (!token) {
        setSnackbar({
          open: true,
          message: "Authorization token missing",
          severity: "error",
        });
        return;
      }
      try {
        const response = await axios.get(`${baseApi}/subject/fetch-with-query`, {
          params,
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubject(response.data.subjects);  // Adjusted based on your backend response
      } catch (error) {
        console.error("Error fetching subject:", error);
        setSnackbar({
          open: true,
          message: "Failed to fetch subjects",
          severity: "error",
        });
      }
    };

  useEffect(() => {
    
    fetchSemesters();
  }, []);

  
  useEffect(() => {
    
    fetchSubject();
  }, [params]);


  const formik = useFormik({
    initialValues: {
      subject_name: "",
      subject_codename: "",
      student_class: "",
    },
    validationSchema: subjectSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editId) {
          await axios.patch(`${baseApi}/subject/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAlert({
            open: true,
            message: "subject updated successfully",
            severity: "success",
          });
        } else {
          await axios.post(`${baseApi}/subject/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAlert({
            open: true,
            message: "subject added successfully",
            severity: "success",
          });
        }
        resetForm();
        setEditId(null);
        fetchSubject();
      } catch (error) {
        setAlert({
          open: true,
          message: "Error processing request",
          severity: "error",
        });
        console.error("Error:", error);
      }
    },
  });

 

  return (
    <>
       <SnackbarAlert {...alert} onClose={handleAlertClose} />
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f9fafb" }}>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onSubmit={formik.handleSubmit}>
          <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700, color: "#1976d2" }}>
            {editId ? "Edit subject" : "Add New subject"}
          </Typography>
          {/* Existing TextFields and Button with some padding, border radius, and hover effects added */}
          <TextField
          select
          fullWidth
          label="Student Class"
          variant="outlined"
          {...formik.getFieldProps("student_class")}
          error={
            formik.touched.student_class && Boolean(formik.errors.student_class)
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
          label="Subject Name"
          fullWidth
          variant="outlined"
          {...formik.getFieldProps("subject_name")}
          error={
            formik.touched.subject_name && Boolean(formik.errors.subject_name)
          }
          helperText={formik.touched.subject_name && formik.errors.subject_name}
        />
        <TextField
          fullWidth
          label="Subject Code"
          variant="outlined"
          {...formik.getFieldProps("subject_codename")}
          error={
            formik.touched.subject_codename &&
            Boolean(formik.errors.subject_codename)
          }
          helperText={
            formik.touched.subject_codename && formik.errors.subject_codename
          }
        />
        <Button fullWidth variant="contained" color="primary" type="submit">
          {editId ? "Update" : "Submit"}
        </Button>
        </Box>
      </Paper>
      <Paper elevation={6} sx={{ mt: 4, p: 4, borderRadius: 3, backgroundColor: "#ffffff" }}>
      <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700, color: "#1976d2" ,marginBottom:"20px"}}>
            Subjects
          </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField select fullWidth label="Student Class" value={params.student_class || ""} variant="outlined" onChange={handleSemester} sx={{ mb: 2 }}>
              <MenuItem value="">All Semesters Subjects</MenuItem>
              {semesters.map((x) => (<MenuItem key={x._id} value={x._id}>{x.semester_text} ({x.semester_num})</MenuItem>))}
            </TextField>
          </Grid>
          {subject.length === 0 ? (
            <Typography variant="h6" color="textSecondary" textAlign="center">No subject found</Typography>
          ) : (
            subject.map((x) => (
              <Grid item xs={12} key={x._id}>
                <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 2, backgroundColor: "#e3f2fd" }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{x.subject_name} ({x.subject_codename})</Typography>
                  <Box>
                    <IconButton color="primary" onClick={() => handleEdit(x)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(x._id)}><Delete /></IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>
      </>
  );
}
