import {socialMedia} from '../constants';

const Footer = () => {
  return (
    <section id='footer'>
      <hr className='border-black border-1 mb-2'/>
      <div className='flex justify-center gap-4'>
        {socialMedia.map((social, index) => (
          <li className='list-none'>
            <div>
              <img
                key={social.id}
                src={social.icon}
                alt={social.id}
                className={`w-[48px] h-[48px] object-contain cursor-pointer mb-2`}
                onClick={() => window.open(social.link)}
                />
            </div> 
          </li>
        ))}
      </div>
    </section>
  )
}

export default Footer