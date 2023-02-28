import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { app, database } from '../firebaseConfig';

const cookies = new Cookies();

const Auth = () => {
  //is this ok or should i pass auth as a prop?
  const auth = getAuth();
  const collectionRef = collection(database, 'users');

  const [isSpinning, setIsSpinning] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [data, setData] = useState({
    email:'',
    password:'',
    name:''
  });

  const handleInput = (event) =>{
    let newInput = { [event.target.name]: event.target.value };
    setData({...data, ...newInput})
  }

  
  const createUser = (e) =>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((response) =>{
        const idToken = response.user.getIdToken();
        // Store the ID token in a cookie
        cookies.set('idToken', idToken);
        cookies.set('name', data.name);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  const signInUser = (e) =>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((response) =>{
        const idToken = response.user.getIdToken();
        // Store the ID token in a cookie
        cookies.set('idToken', idToken);
        window.location.reload();
      }).catch((err) => {
        alert(err.message)
      })
  }

  const handlelogout = () => {
    signOut(auth).then(() =>{
      cookies.remove('idToken');
      console.log('signed out');
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const switchMode = () =>{
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000);
    setTimeout(() => setIsSignup((prev) => !prev), 400);
    
  }

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if(data){
        console.log("Logged In");
      }
      else {
        console.log('Not Logged In')
      }
    })
  }, [])

  //have the form option div have the same size as the form container div
  // const formCont = document.querySelector('.form-container');
  // const formOpt = document.querySelector('.form-option');

  // formOpt.style.width = formCont.offsetWidth + 'px';
  // formOpt.style.height = formCont.offsetHeight + 'px';

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className={`${isSpinning ? 'form-parent flex justify-center gap-4 rounded-lg overflow-hidden' : 'form-parent flex justify-center gap-4 rounded-lg shadow-lg overflow-hidden'}`}>
        <div className={`form-container p-6 ${isSpinning ? 'spin-animation' : ''}`}>
          <form>
          {!isSignup &&(
            <div className='grid gap-0.5 font-medium'>
              <input name='email' placeholder='Email' onChange={(event) => handleInput(event)}/>
              <input name='password' type='password' placeholder='Password' onChange={(event) => handleInput(event)}/>
              <button onClick={signInUser}>Ingresar</button>
              
            </div>
          )}
          {isSignup &&(
            <div className='grid gap-0.5 font-medium w-full'>
              <input name='name' placeholder='Nombre' onChange={(event) => handleInput(event)} required/>
              <input name='email' placeholder='Email' onChange={(event) => handleInput(event)}/>
              <input name='password' type='password' placeholder='Password' onChange={(event) => handleInput(event)}/>
              <button onClick={createUser}>Registrarse</button>
            </div>
          )}
          </form>
          {/* <div className='flex justify-center'>
            <p className='font-medium italic'>
              {isSignup? "Ya tienes cuenta? " : "Aun sin cuenta? "}
              <span className='cursor-pointer hover:text-sky-700 text-xl' onClick={switchMode}>
                {isSignup? 'Ingresar' : 'Registrarse'}
              </span>
            </p>
          </div> */}
          <button onClick={handlelogout}>Log out</button>
        </div>
        <div className={`form-option p-6 ${isSpinning ? 'spinRev-animation' : ''}`}>
          {isSignup &&(
            <div>
              <h1 className='font-medium text-3xl text-center'>Bienvenido!</h1>
              <p className='mt-6 text-2xl text-center'>Para utilizar la aplicacion por favor registrate con tu informacion personal</p>
            </div>
          )}
          {!isSignup &&(
            <div>
              <h1 className='font-medium text-3xl text-center'>Hola de nuevo!</h1>
              <p className='mt-6 text-2xl text-center'>Por favor utiliza tus credenciales para ingresar</p>
            </div>
          )}
          <div className='flex justify-center mt-8'>
            <p className='font-medium italic mt-5 text-center'>
              {isSignup? "Ya tienes cuenta? " : "Aun sin cuenta? "}
            </p>
          </div>
          <p className='text-center mt-2'>
            <span className='cursor-pointer hover:text-sky-700 text-xl border-2 rounded-xl p-0.5 pb-1' onClick={switchMode}>
              {isSignup? 'Ingresar' : 'Registrarse'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth