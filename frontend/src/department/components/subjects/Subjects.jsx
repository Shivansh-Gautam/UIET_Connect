import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";
import SnackbarAlert from "../../../basic utility components/snackbar/SnackbarAlert";


export default function Subjects() {
  const token = localStorage.getItem("authToken"); // Fetch token
  const [subject, setSubject] = useState([]);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchSubject = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubject(response.data.data);
    } catch (error) {
      console.error("Error fetching subject:", error);
    }
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  const formik = useFormik({
    initialValues: { subject_name: "", subject_codename: "" },
    validationSchema: subjectSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editId) {
          await axios.patch(`${baseApi}/subject/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAlert({ open: true, message: "subject updated successfully", severity: "success" });
        } else {
          await axios.post(`${baseApi}/subject/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAlert({ open: true, message: "subject added successfully", severity: "success" });
        }
        resetForm();
        setEditId(null);
        fetchSubject();
      } catch (error) {
        setAlert({ open: true, message: "Error processing request", severity: "error" });
        console.error("Error:", error);
      }
    },
  });

  const handleEdit = (subject) => {
    setEditId(subject._id);
    formik.setValues({ subject_name: subject.subject_name, subject_codename: subject.subject_codename });
  };

  const handleDelete = async (id) => {
    try {
      await axios.get(`${baseApi}/subject/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ open: true, message: "subject deleted successfully", severity: "success" });
      fetchSubject();
    } catch (error) {
      setAlert({ open: true, message: "Error deleting subject", severity: "error" });
      console.error("Error deleting subject:", error);
    }
  };

  return (
    <>
      <SnackbarAlert {...alert} onClose={handleAlertClose} />

      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onSubmit={formik.handleSubmit}>
        <Typography variant="h3" sx={{ textAlign: "center", fontWeight: 700 }}>
          {editId ? "Edit subject" : "Add New subject"}
        </Typography>
        <TextField
         label="Subject Name"
          fullWidth
          variant="outlined"
          {...formik.getFieldProps("subject_name")}
          error={formik.touched.subject_name && Boolean(formik.errors.subject_name)}
          helperText={formik.touched.subject_name && formik.errors.subject_name}
          
        />
        <TextField
          fullWidth
          label="Subject Code"
          variant="outlined"
          {...formik.getFieldProps("subject_codename")}
          error={formik.touched.subject_codename && Boolean(formik.errors.subject_codename)}
          helperText={formik.touched.subject_codename && formik.errors.subject_codename}
        />
        <Button fullWidth variant="contained" color="primary" type="submit">
          {editId ? "Update" : "Submit"}
        </Button>
      </Box>

      <Box component="div" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
        {subject.length === 0 ? (
          <Typography variant="h6">No subject found</Typography>
        ) : (subject.map((x) => (
          <Box key={x._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography>Subject: {x.subject_name} ({x.subject_codename})</Typography>
            <Box>
              <IconButton color="primary" onClick={() => handleEdit(x)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(x._id)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        )))}
      </Box>
    </>
  );
}
