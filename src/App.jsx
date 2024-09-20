import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  


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
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop);
    ctx.stroke();
  }

  const handleMouseUp = ()=>{
    setDrawing(false);
  }

  const handleBrushSize = (e)=>{
    setBrushSize(Number(e.target.value));
  }

  return (
  
  <div className='container'>
   <div className='canvasActions'>
    <label htmlFor={brushSize}>Brush Size</label><input type="range" id="brushSize" name="brushSize" min="1" max="50" value={brushSize} onChange={handleBrushSize} />
    </div>
    <canvas ref={canvasRef} width="800px" height="800px"  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
   </div>
  )
}

export default App
