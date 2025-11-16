import Banner from "../components/Banner";
import ContactUs from "../components/ContactUs";
import Featured from "../components/Featured";
import PendingRequests from "../components/PendingRequests";
import DonationProcess from "../components/DonationProcess";
import ImpactStatistics from "../components/ImpactStatistics";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <ImpactStatistics></ImpactStatistics>
      <PendingRequests></PendingRequests>
      <DonationProcess></DonationProcess>
      {/* <Featured></Featured>
      <ContactUs></ContactUs> */}
    </>
  );
};

export default Home;
