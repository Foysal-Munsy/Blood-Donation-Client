import Banner from "../components/Banner";
import ContactUs from "../components/ContactUs";
import Featured from "../components/Featured";
import PageTitle from "../components/PageTitle";

const Home = () => {
  return (
    <>
      <PageTitle title={"Home"} />
      <Banner></Banner>
      <Featured></Featured>
      <ContactUs></ContactUs>
    </>
  );
};

export default Home;
