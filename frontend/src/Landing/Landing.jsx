import React, { useState } from 'react'
import './Landing.css'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import { useContext } from 'react'
import {UserContext} from '../UserContext'
import Footer from '../Footer/Footer'

export default function Landing() {
  const {user} = useContext(UserContext)
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    document.querySelector('#hospital-info').scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Navbar/>

      <main>
        <div className="hero">
            <video className="video-background" autoPlay loop muted>
              <source src="https://res.cloudinary.com/dvbfkbehg/video/upload/v1721619091/hero_wrg6v9.mov" type="video/mp4" />
            </video>
            <div className="hero-content">
              {user ? <p>Welcome {user.username}!</p> : ''}
              <h1 className='hospitalname'>ENO-OBONG MEMORIAL MEDICAL SERVICES</h1>
              <p>Committed to Service Excellence</p>
              <a href="#hospital-info" onClick={handleLearnMoreClick}>Learn More</a>
            </div>
        </div>

        <div id='hospital-info' className='hospital-info'>
          <h1>Explore!</h1>
          <p className="short-text">
            Welcome to Enobong Memorial Medical Services, nestled in the vibrant heart of Ikot Abasi, Akwa Ibom State. We are a premier healthcare institution dedicated to providing top-tier medical services to our community. Established in 2017, we are proudly registered with the Corporate Affairs Commission (CAC) in Abuja, Nigeria, under registration number RC 3207397.
          </p>
          {isExpanded && (
            <p className="more-text">
              At Enobong Memorial Medical Services, we boast a comprehensive team of highly skilled professionals, including experienced doctors, compassionate nurses, proficient laboratory technicians, and other essential ancillary staff. Our clinic is equipped to cater to the medical needs of all demographics—adult males and females, children (pediatrics), and women requiring obstetric and gynecological care.
              Our state-of-the-art facilities include advanced ultrasound scanning and extensive laboratory services, ensuring accurate diagnostics and effective treatment plans. We offer a broad spectrum of general surgical services, including procedures for hernias, appendicitis, lipomas, caesarean sections, and laparotomies. Whether you require outpatient care or need to be admitted for more intensive treatment, we are here to provide exceptional medical attention.
              In light of the ongoing global pandemic, we have implemented rigorous COVID-19 preventive measures to ensure the safety of our patients and staff. Our efforts include regular sanitization, mandatory use of personal protective equipment (PPE), and strict adherence to social distancing protocols within our facility. For the latest updates and comprehensive information on COVID-19, please visit the <Link to="/discover">Discover</Link> page.
              Enobong Memorial Medical Services is committed to delivering excellent healthcare services with a focus on patient-centered care. Our mission is to enhance the health and well-being of our community through compassionate, high-quality medical care. We invite you to experience the exceptional care and dedication that define our clinic. Visit us today and let us partner with you on your journey to better health.
            </p>
          )}
          <button className="read-more" onClick={toggleReadMore}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>

        <div className='vision-and-mission'>
          <div className='vision'>
            <h1>The Vision</h1>
            <p>To be a one stop center for excellent service delivery</p>
          </div>

          <div className='mission'>
            <h1>The Mission</h1>
            <p>To reach the underserved population in particular and indeed everyone with the best of medical care.</p>
          </div>
        </div>

        <div className='affiliations'>
          <div className='inner'>
            <img className='coat-of-arms' src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619109/Federal-Ministry-of-health-coat-of-arms_jbjcyr.webp" alt="coat of arms" />
            <img className='cac' src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619109/corporate-affairs-commission_i5rakf.png" alt="corporate affairs commission" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619111/NMA-AKS-LOGO_bxs4w3.png" alt="nma" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619799/AXA_Logo_vtj5pw.svg" alt="axa" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619902/ibom-power_rkxtuh.png" alt="ipc" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721622938/akwa-ibom_qwvcsi.jpg" alt="akwaibom arise" />

            <img className='coat-of-arms' src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619109/Federal-Ministry-of-health-coat-of-arms_jbjcyr.webp" alt="coat of arms" />
            <img className='cac' src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619109/corporate-affairs-commission_i5rakf.png" alt="corporate affairs commission" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619111/NMA-AKS-LOGO_bxs4w3.png" alt="nma" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619799/AXA_Logo_vtj5pw.svg" alt="axa" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721619902/ibom-power_rkxtuh.png" alt="ipc" />
            <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721622938/akwa-ibom_qwvcsi.jpg" alt="akwaibom arise" />
          </div>
        </div>


        <div className='contact'>
          <div className='physician-brief'>
            <div className='text'>
              <p>"The happiest people don't necessarily have the best of everything, they make the best of everything. So live simply, love generously....."</p>
              <p><strong>Dr. I J Ekanem</strong></p>
            </div>
            <div>
              <img src="https://res.cloudinary.com/dvbfkbehg/image/upload/v1721781458/IMG_5930_qfgcyg.jpg" alt="Dr Ekanem" />
            </div>
          </div>
          <div className='contact-info'>
            <p>Questions or Inquiries? Let's talk</p>
            <p>+2347082210979, +2348173922714</p>
            <p>enoobongmemorial@yahoo.com</p>
          </div>
        </div>

      </main>

      <Footer/>
    </>
  )
}
