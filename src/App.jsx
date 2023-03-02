import { useEffect, useState } from 'react';
import { Auth, Navbar, Hero, Tasks, FileUpload, CommentsForm, Footer } from './components';
import { app, database } from './firebaseConfig';
import Cookies from 'universal-cookie';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const cookies = new Cookies();
const auth = getAuth();

const App = () => {
  //insecure ==> check Firebase for improvement
  let authToken = cookies.get('idToken');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

   const handlelogout = () => {
     signOut(auth).then(() =>{
       console.log('signed out');
       cookies.remove('idToken');
       cookies.remove('name');
       setUser(null);
       authToken = false;
       window.location.reload();
     })
     .catch((err) => {
       console.log(err)
     })
   }


  //if(!authToken) return <Auth authID={auth} />
  if(!user) return <Auth authID={auth} />

  const uid = user.uid;

  return (
    <div>
      <Navbar/>
      <button className='bg-gray-300 h-10 w-20 rounded' onClick={handlelogout}>Salir</button>
      <Hero/>
      <FileUpload uid={uid} />
      <Tasks/>
      <CommentsForm/>
      <Footer/>
    </div>
  )
}

export default App;