import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | RedDrop</title>
    </Helmet>
  );
};

export default PageTitle;
