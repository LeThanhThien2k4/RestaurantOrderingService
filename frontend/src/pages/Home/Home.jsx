import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Banner from '../../components/Banner/Banner'
import SpecialOffer from '../../components/SpecialOffer/SpecialOffer'
import AboutHome from '../../components/AboutHome/AboutHome'
import OurHomeMenu from '../../components/OurHomeMenu/OurHomeMenu'
import Footer from '../../components/Footer/Footer'
import ChatBox from '../../components/ChatBox/ChatBox';


const Home = () => {
  const userId = '123456abc';
  return (
    <>
        
        <Navbar />
        <Banner />
        <SpecialOffer />
        <AboutHome/>
        <OurHomeMenu />
        <Footer />
        <ChatBox userId={userId} />
    </>
  )
}

export default Home