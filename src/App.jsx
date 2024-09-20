import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [brushType, setBrushType] = useState('solid');


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
    if (brushType === 'solid'){
      ctx.setLineDash([]);
    }
    else if(brushType === 'dashed'){
      ctx.setLineDash([15,15]);
    }
    else if(brushType === 'dotted'){
      ctx.setLineDash([2,8]);
    }
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.clientX-canvas.offsetLeft, e.clientY-canvas.offsetTop);
    ctx.strokeStyle = '#ffffff'
    ctx.stroke();
  }

  const handleMouseUp = ()=>{
    setDrawing(false);
  }

  const handleBrushSize = (e)=>{
    setBrushSize(Number(e.target.value));
  }

  const handleBrushType = (e)=>{
    setBrushType(e.target.value);
  }
  return (
  
  <div className='container'>

   <div className='canvasActions'>
    <div className='form-element'>
    <label htmlFor={brushSize}>Brush Size</label><input type="range" id="brushSize" name="brushSize" min="1" max="50" value={brushSize} onChange={handleBrushSize} /><span>{brushSize}</span>
    </div>
    <div className='form-element'>
    <label htmlFor={brushType}>Brush Type</label><select id="brushType" name="brushType" value={brushType} onChange={handleBrushType}> <option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select>
    </div>
    </div>
    <canvas ref={canvasRef} width="800px" height="800px"  onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}/>
   </div>
  )
}

export default App
