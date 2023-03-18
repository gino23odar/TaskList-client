import { useState } from "react";
import {navLinks} from '../constants';

const Navbar = ({taskListContainer, setTaskListContainer}) => {
  const [toggle, setToggle] = useState(false);
  //could make active a prop from app.jsx to fix Tareas 
  //not being highlighted when entering through fileupload 
  const [active, setActive] = useState(false);

  const handleClick = (title) =>{
    setActive(title);
    if(taskListContainer){
      setTaskListContainer(false);
    } else if(title == 'Tareas'){
      setTaskListContainer(true);
    }
  }

  return (
    <div>
      <div className={`${toggle? 'nav-toggle clicked' : 'nav-toggle'}`} onClick={() => setToggle((prevState)=>!prevState)}>
        <span> </span>
      </div>
      <nav className={`${toggle? 'nav-in patternBackground' :'nav-out'}`}>
        <ul className='nav-list'>
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={
                `${active === nav.title ? "text-rose-500" : "text-slate-500"}
                 ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
              onClick={() => handleClick(nav.title)}
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