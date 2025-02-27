import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, TextField, MenuItem } from "@mui/material"; // ✅ Import MenuItem
import { useState, useEffect } from "react";
import axios from "axios";
import ScheduleEvent from "./ScheduleEvent";
import { baseApi } from "../../../environment";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [newPeriod, setNewPeriod] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(""); // ✅ Initialize as ""
  const token = localStorage.getItem("authToken"); // Fetch auth token from local storage

  const myEventsList = [
    {
      id: 1,
      title: "History Class - Mr. Hamid",
      start: new Date(2025, 1, 26, 11, 30),
      end: new Date(2025, 1, 26, 14, 30),
    },
    {
      id: 2,
      title: "Math Class - Ms. Sarah",
      start: new Date(2025, 1, 27, 9, 0),
      end: new Date(2025, 1, 27, 11, 0),
    },
  ];

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${baseApi}/semester/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(response.data.data);
      setSelectedSemester(response.data.data[0]._id);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <TextField
        select
        fullWidth
        label="Semester"
        variant="outlined"
        value={selectedSemester} // ✅ Ensure it's never null
        onChange={(e) => setSelectedSemester(e.target.value)}
      >
        <MenuItem value="">Select Semester</MenuItem> {/* ✅ Default option */}
        {semesters.map((x) => (
          <MenuItem key={x._id} value={x._id}>
            {x.semester_text} ({x.semester_num})
          </MenuItem>
        ))}
      </TextField>

      <Button onClick={() => setNewPeriod(true)}>Add New Period</Button>

      {newPeriod && <ScheduleEvent selectedSemester={selectedSemester} />}

      <Calendar
        localizer={localizer}
        events={myEventsList}
        defaultView="week"
        views={["week", "day", "agenda"]}
        step={30}
        timeslots={2}
        min={new Date(2025, 1, 26, 8, 0, 0)}
        max={new Date(2025, 1, 26, 20, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        defaultDate={new Date()}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
