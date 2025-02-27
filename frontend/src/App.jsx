import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Department from "./department/department";
import AttendanceStudentsList from "./department/components/attendance/AttendanceStudentsList";
import Examinations from "./department/components/examinations/Examinations";
import Notice from "./department/components/notice/Notice";
import Teachers from "./department/components/teachers/Teachers";
import Students from "./department/components/students/Students";
import Dashboard from "./department/components/dashboard/Dashboard";
import Class from "./department/components/class/Class";
import Schedule from "./department/components/schedule/Schedule";
import Subjects from "./department/components/subjects/Subjects";
import Register from "./client/components/register/Register";
import Login from "./client/components/login/Login";
import Home from "./client/components/home/Home";
import Client from "./client/Client";
import Teacher from "./teacher/Teacher";
import TeacherDetails from "./teacher/components/teacher details/TeacherDetails";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import ExaminationsTeacher from "./teacher/components/examinations/ExaminationsTeacher";
import NoticeTeacher from "./teacher/components/notice/NoticeTeacher";
import ScheduleTeacher from "./teacher/components/schedule/ScheduleTeacher";
import Student from "./student/Student";
import StudentDetails from "./student/components/student details/StudentDetails";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import ExaminationsStudent from "./student/components/examinations/ExaminationsStudent";
import NoticeStudent from "./student/components/notice/NoticeStudent";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import ProtectedRoute from "./guard/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LogOut from "./client/components/logout/LogOut";
import Notes from "./student/components/notes/Notes";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* department route */}
          <Route
            path="department"
            element={
              <ProtectedRoute allowedRoles={["DEPARTMENT"]}>
                <Department />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<AttendanceStudentsList />} />
            <Route path="class" element={<Class />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="notice" element={<Notice />} />
            <Route path="examinations" element={<Examinations />} />
          </Route>
          {/* student */}
          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <Student />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDetails />} />
            <Route path="attendance" element={<AttendanceStudent />} />
            <Route path="notes" element={<Notes />} />
            <Route path="examinations" element={<ExaminationsStudent />} />
            <Route path="notice" element={<NoticeStudent />} />
            <Route path="schedule" element={<ScheduleStudent />} />
          </Route>
          {/* teacher */}
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]}>
                <Teacher />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDetails />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="examinations" element={<ExaminationsTeacher />} />
            <Route path="notice" element={<NoticeTeacher />} />
            <Route path="schedule" element={<ScheduleTeacher />} />
          </Route>
          {/* client */}

          <Route path="/" element={<Client />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<LogOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
