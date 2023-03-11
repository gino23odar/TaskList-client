import { useEffect, useState } from 'react';
import { Auth, Navbar, Hero, Tasks, FileUpload, CommentsForm, Footer } from './components';
import { app, database } from './firebaseConfig';
import Cookies from 'universal-cookie';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';

const cookies = new Cookies();
const auth = getAuth();

const App = () => {
  //insecure ==> check Firebase for improvement
  let authToken = cookies.get('idToken');
  const [user, setUser] = useState(null);
  const [allTaskLists, setAllTaskLists] = useState(null);
  const [taskListContainer, setTaskListContainer] = useState(false);
  const [activeTaskList, setActiveTaskList] = useState('');

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
  //if(!user) return <Auth authID={auth} />

  const uid = user?.uid;

  const getUserData = async (uid) => {
    //const usersRef = collection(database, "users");
    //const q = query(usersRef, where("uid", "==", uid));
    const usersRef = collection(database, "users");
    const userDocRef = doc(usersRef, uid);
  
    const querySnapshot = await getDoc(userDocRef, { 
      // use select() to only fetch the taskLists field
      select: ["taskLists"]
    });
    //const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
      console.log('No tienes listas aun.')
    }
  
    let userData = querySnapshot.data().taskLists;
  
    return userData;
  };

  //check if this works.
  useEffect(() => {
    const fetchData = async () => {
      if(uid){
        const userData = await getUserData(uid);
        setAllTaskLists(userData);
      }
    };
    fetchData();
  }, [uid]);

  return (
    <div>
      <Navbar/>
      {taskListContainer ? (
        <Tasks 
        uid={uid} 
        tasks={allTaskLists}
        setTaskListContainer={setTaskListContainer}
        activeTaskList={activeTaskList}
        setActiveTaskList={setActiveTaskList}
        />
      ) : user ? (
        <>
          <button className='bg-gray-300 h-10 w-20 rounded' onClick={handlelogout}>Salir</button>
          <Hero/>
          <FileUpload 
            uid={uid} 
            tasks={allTaskLists}
            setTaskListContainer={setTaskListContainer}
            setActiveTaskList={setActiveTaskList}
          />
          <CommentsForm/>
          <Footer/>
        </>
      ) : (
        <Auth authID={auth} />
      )}
    </div>
  )
}

export default App;