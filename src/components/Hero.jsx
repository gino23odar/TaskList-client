import {logo} from '../assets';

const Hero = () => {
  return (
    <section id='start' >
      <div className='logo-space'>
        <div className='logo-base'>
          <div className='upper-block'></div>
          <div className='lower-block'></div>
        </div>
        <img src={logo} alt='logo' className='imageLogo'/>
      </div>
    </section>
  )
}

export default Hero