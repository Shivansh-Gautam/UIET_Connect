import { Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";

export default function NoticeStudent() {
  const token = localStorage.getItem("authToken");
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${baseApi}/notice/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(response.data.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <Box sx={{ mt: 6, px: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        Student Notices
      </Typography>

      {notices.length === 0 ? (
        <Typography variant="h6" textAlign="center">
          No notices found
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {notices.map((notice) => (
            <Card
              key={notice._id}
              sx={{
                p: 2,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 6,
                },
                backgroundColor: "#f9f9f9",
              }}
            >
              <CardContent>
                <Typography variant="h6" mb={1} color="primary">
                  {notice.title}
                </Typography>
                <Typography variant="body2" mb={1}>
                  <b>Message:</b> {notice.message}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  <b>Audience:</b> {notice.audience}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
