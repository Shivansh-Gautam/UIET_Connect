import { useEffect, useState, useContext } from "react";
import { Box, Typography, Card, CardContent, CardHeader, Divider } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";
import { AuthContext } from "../../../context/AuthContext";

export default function NoticeTeacher() {
  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem("authToken");
  const [notices, setNotices] = useState([]);

  // Helper to handle axios errors, logout on 401
  const handleAxiosError = (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired or unauthorized. Please login again.");
      logout();
    } else {
      console.error(error);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${baseApi}/notice/teacher`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(response.data.data || []);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
      {notices.length === 0 ? (
        <Typography variant="h6" align="center">No notice found</Typography>
      ) : (
        notices.map((notice) => (
          <Card
            key={notice._id}
            variant="outlined"
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              transition: "box-shadow 0.3s ease",
              "&:hover": { boxShadow: 6 },
              position: "relative",
            }}
          >
            <CardHeader
              title={<Typography variant="h6" sx={{ fontWeight: "bold" }}>{notice.title}</Typography>}
              subheader={
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">Audience: {notice.audience}</Typography>
                  {notice.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {notice.message}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
