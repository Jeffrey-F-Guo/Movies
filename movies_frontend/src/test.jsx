import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Card = ( {title} ) => {
  const [hasLiked, setHasLiked] = useState(false)
  const [count, setCount] = useState(0);

  // comms with server
  useEffect( ()=> {
    console.log(`${title} has been liked: ${hasLiked}`)
  }, [hasLiked]);

  // single time on initial load
  useEffect(()=> {
    console.log("Card Rendered!")
  }, []);

  return (
    <div onClick={() => setCount(count+1)}>
      <h2>
        {title} - {count}
      </h2>
      <button onClick={() => setHasLiked(!hasLiked)}>
        <h2>{hasLiked? "Liked":"Like"}</h2>
      </button>
    </div>
  )
}

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello! This will be a movies DB app!
      </h1>
      <Card title="Lion King"/>
      <Card title="React is so easy"/>
    </div>
  )
}

export default App
