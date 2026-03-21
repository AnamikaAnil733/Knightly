import { ProfileUser } from "../../Components/User/Profile";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";

export function Profile() {
  return (
    <>
      <Navbar />
      <ProfileUser />
      <Footer />
    </>
  );
}
