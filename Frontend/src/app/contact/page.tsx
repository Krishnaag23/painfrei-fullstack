import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page for painfrei",
  description: "This is the contact page for painfrei",
  
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="We'd love to hear from you! Whether you have questions, feedback, or need assistance, feel free to reach out using the information below."
      />
      
      <Contact />
    </>
  );
};

export default ContactPage;
