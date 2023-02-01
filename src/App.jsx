import { Navbar, Hero, Tasks, FileUpload, CommentsForm, Footer } from './components';

const App = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <FileUpload/>
        <Tasks/>
        <CommentsForm/>
        <Footer/>
    </div>
  )
}

export default App;