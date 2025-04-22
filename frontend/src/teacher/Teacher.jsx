import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SubjectIcon from "@mui/icons-material/Subject";
import ExplicitIcon from "@mui/icons-material/Explicit";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ClassIcon from "@mui/icons-material/Class";
import HomeIcon from "@mui/icons-material/Home";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  background: "linear-gradient(to right, #3f51b5, #5a55ae)",
  color: "#fff",
  zIndex: theme.zIndex.drawer + 1,
  borderRadius: "20px", // All four corners rounded
  marginTop: "10px",
  marginLeft: open
    ? `calc(${drawerWidth}px + 24px)`
    : `calc(${theme.spacing(7)} + 32px)`,
  marginRight: "16px", // <-- Added right margin
  width: open
    ? `calc(100% - ${drawerWidth}px - 40px)` // Adjusted width (24px left + 16px right)
    : `calc(100% - ${theme.spacing(7)} - 48px)`, // Adjusted width (32px left + 16px right)
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      borderTopRightRadius: "20px",
      borderBottomRightRadius: "20px",
      marginTop: "10px",
      marginBottom: "10px",
      marginLeft: "8px",
      marginRight: "16px", // Added right margin to drawer
      height: "calc(100% - 20px)",
      boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderTopRightRadius: "20px",
      borderBottomRightRadius: "20px",
      marginTop: "10px",
      marginBottom: "10px",
      marginLeft: "8px",
      marginRight: "16px", // Added right margin to drawer (even collapsed)
      height: "calc(100% - 20px)",
      boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
    },
  }),
}));

export default function Teacher() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navArr = [
    { link: "/homeout", component: "Home", icon: HomeIcon },
    { link: "/teacher", component: "Your Details", icon: DashboardIcon },
    { link: "/teacher/notes", component: "Notes", icon: DocumentScannerIcon },
    { link: "/teacher/notice", component: "Notice", icon: NotificationsIcon },
    {
      link: "/teacher/examinations",
      component: "Examinations",
      icon: ExplicitIcon,
    },
    { link: "/teacher/schedule", component: "Schedule", icon: EventIcon },
    {
      link: "/teacher/attendance",
      component: "Attendance",
      icon: RecentActorsIcon,
    },
    { link: "/logout", component: "Log Out", icon: LogoutIcon },
  ];

  const handleNavigation = (link) => {
    navigate(link);
  };

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#f5f7fa", minHeight: "100vh" }}
    >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            UIET - CONNECT
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          {navArr.map((navItem, index) => {
            const isActive = location.pathname === navItem.link;
            return (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "12px",
                    m: 0.5,
                    backgroundColor: isActive ? "#e3f2fd" : "transparent",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                    },
                  }}
                  onClick={() => handleNavigation(navItem.link)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? "#1976d2" : "inherit",
                    }}
                  >
                    {<navItem.icon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={navItem.component}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
