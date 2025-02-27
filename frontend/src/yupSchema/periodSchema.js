import * as yup from "yup";

export const periodSchema = yup.object({
  teacher: yup.string().required("teacher field is required"),
  subject: yup.string().required("subject field is required"),
  period: yup.string().required("period field is required"),
  date: yup.date().required("subject field is required"),
});
