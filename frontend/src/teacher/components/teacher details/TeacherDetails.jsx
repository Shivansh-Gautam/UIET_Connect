import Greeting from "../../../basic utility components/Greeting";

const TeacherDetails = () => {
  return (
    <>
      <Greeting role={"teacher"} apiEndpoint={"teacher/fetch-single"} />
    </>
  );
};

export default TeacherDetails;
