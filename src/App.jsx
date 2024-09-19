import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);


  const handleMouseDown = (e)=>{
    setDrawing(true);
    console.log(`mouse pos ${e.clientX}, ${e.clientY}`);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop);
  }

  const handleMouseMove = (e)=>{
    if (!drawing){
      return
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop);
    ctx.stroke();
  }

  const handleMouseUp = ()=>{
    setDrawing(false);
  }

  return (
   <div>
    <canvas ref={canvasRef} width="800px" height="800px"  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
   </div>
  )
}

export default App
