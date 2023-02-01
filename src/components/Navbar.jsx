import { useState } from "react";
import {navLinks} from '../constants';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState(false);
  return (
    <div>
      <div className={`${toggle? 'nav-toggle clicked' : 'nav-toggle'}`} onClick={() => setToggle((prevState)=>!prevState)}>
        <span> </span>
      </div>
      <nav className={`${toggle? 'nav-in' :'nav-out'}`}>
        <ul className='nav-list'>
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={
                `${active === nav.title ? "text-blue-500" : "text-purple-700"}
                 ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar