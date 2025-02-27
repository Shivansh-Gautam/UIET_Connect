import { useState, useEffect } from "react";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { baseApi } from "../../../environment";
import axios from "axios";
import { useFormik } from "formik";
import { Box, MenuItem, TextField, Button } from "@mui/material";

export default function ScheduleEvent({ selectedSemester }) {
  const periods = [
    { id: 1, label: "Period 1 (10:00 AM - 11:00 AM)", startTime: "10:00", endTime: "11:00" },
    { id: 2, label: "Period 2 (11:00 AM - 12:00 PM)", startTime: "11:00", endTime: "12:00" },
    { id: 3, label: "Period 3 (12:00 PM - 1:00 PM)", startTime: "12:00", endTime: "1:00" },
    { id: 4, label: "Lunch Break (1:00 PM - 2:00 PM)", startTime: "1:00", endTime: "2:00" },
    { id: 5, label: "Period 4 (2:00 PM - 3:00 PM)", startTime: "2:00", endTime: "3:00" },
    { id: 6, label: "Period 5 (3:00 PM - 4:00 PM)", startTime: "3:00", endTime: "4:00" },
    { id: 7, label: "Period 6 (4:00 PM - 5:00 PM)", startTime: "4:00", endTime: "5:00" },
  ];

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (selectedSemester) {
      fetchData();
    }
  }, [selectedSemester]); // Runs whenever selectedSemester changes

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Fetch Teachers
      const teacherResponse = await axios.get(`${baseApi}/teacher/fetch-with-query`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch Subjects based on semester
      const subjectResponse = await axios.get(`${baseApi}/subject/fetch-with-query`, {
        params: { student_class: selectedSemester },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Subjects Response:", subjectResponse.data); // Debugging log

      setTeachers(teacherResponse.data.teachers);
      setSubjects(subjectResponse.data.subjects); // Ensure array format
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      teacher: "",
      subject: "",
      period: "",
      date: "",
    },
    validationSchema: periodSchema,
    onSubmit: async (values) => {
      let date = new Date(values.date);
      let [startTime, endTime] = values.period.split(",");

      const scheduleData = {
        teacher: values.teacher,
        subject: values.subject,
        semester: selectedSemester, 
        startTime: new Date(date.setHours(startTime.split(":")[0], startTime.split(":")[1])),
        endTime: new Date(date.setHours(endTime.split(":")[0], endTime.split(":")[1])),
      };

      console.log("Sending Schedule Data:", scheduleData); 

      try {
        const response = await axios.post(`${baseApi}/schedule/create`, scheduleData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        console.log("Response:", response.data);
      } catch (error) {
        console.error("Error saving schedule:", error.response?.data || error);
      }
    },
  });

  return (
    <>
      <h1>Schedule Event</h1>
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onSubmit={formik.handleSubmit}>
        <TextField
          select
          fullWidth
          label="Teacher"
          variant="outlined"
          {...formik.getFieldProps("teacher")}
          error={formik.touched.teacher && Boolean(formik.errors.teacher)}
          helperText={formik.touched.teacher && formik.errors.teacher}
        >
          {teachers.map((x) => (
            <MenuItem key={x._id} value={x._id}>
              {x.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Subject"
          variant="outlined"
          {...formik.getFieldProps("subject")}
          error={formik.touched.subject && Boolean(formik.errors.subject)}
          helperText={formik.touched.subject && formik.errors.subject}
        >
          {subjects.length > 0 ? (
            subjects.map((x) => (
              <MenuItem key={x._id} value={x._id}>
                {x.subject_name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No subjects available</MenuItem>
          )}
        </TextField>

        <TextField
          select
          fullWidth
          label="Period"
          variant="outlined"
          {...formik.getFieldProps("period")}
          error={formik.touched.period && Boolean(formik.errors.period)}
          helperText={formik.touched.period && formik.errors.period}
        >
          {periods.map((x) => (
            <MenuItem key={x.id} value={`${x.startTime},${x.endTime}`}>
              {x.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Date"
          variant="outlined"
          {...formik.getFieldProps("date")}
          error={formik.touched.date && Boolean(formik.errors.date)}
          helperText={formik.touched.date && formik.errors.date}
          InputLabelProps={{ shrink: true }}
        />

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </>
  );
}
