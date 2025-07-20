import {Routes, Route, Link} from 'react-router-dom'
import './App.css'
import Intro from './compoments/home'
import DSI from './compoments/double-slit-interference'
import WaveSketch from './compoments/wave'
import LinearMotion from './compoments/linear-motion'
import ProjectileMotion from './compoments/horizontal-projectile-motion'

function App(){
  return(
    <>
      <nav className='top-nav'>
          <Link to='/'>首頁</Link>
          <Link to='/double-slit-interference'>雙狹縫干涉實驗</Link>
          <Link to='/wave'>會動的波</Link>
          <Link to='linear-motion'>一維直線運動</Link>
          <Link to='projectile-motion'>平拋運動</Link>
      </nav>

      <Routes>
        <Route path='/' element={<Intro />}/>
        <Route path='/double-slit-interference' element={<DSI />}/>
        <Route path='/wave' element={<WaveSketch />}/>
        <Route path='linear-motion' element={<LinearMotion />} />
        <Route path='projectile-motion' element={ <ProjectileMotion />} />
      </Routes>
    </>
  )
}

export default App;
