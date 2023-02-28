import { Auth, Navbar, Hero, Tasks, FileUpload, CommentsForm, Footer } from './components';
import { app, database } from './firebaseConfig';
import Cookies from 'universal-cookie';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const cookies = new Cookies();
const auth = getAuth();

const App = () => {
  //insecure ==> check Firebase for improvement
  let authToken = cookies.get('idToken');

   const handlelogout = () => {
     signOut(auth).then(() =>{
       console.log('signed out');
       cookies.remove('idToken');
       authToken = false;
       window.location.reload();
     })
     .catch((err) => {
       console.log(err)
     })
   }


  if(!authToken) return <Auth/>

  return (
    <div>
      <Navbar/>
      <button className='bg-gray-300 h-10 w-20 rounded' onClick={handlelogout}>Salir</button>
      <Hero/>
      <FileUpload/>
      <Tasks/>
      <CommentsForm/>
      <Footer/>
    </div>
  )
}

export default App;