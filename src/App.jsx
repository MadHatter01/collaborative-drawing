import { useState, useRef, useEffect } from 'react'
import './App.css'
import { HexColorPicker } from "react-colorful";
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL
const socket = io(SERVER_URL);

function App() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(4);
  const [brushType, setBrushType] = useState('solid');
  const [brushOpacity, setBrushOpacity] = useState(1);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [brushColor, setBrushColor] = useState("#ffffff");

  const [room, setRoom] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');


  const handleMouseDown = (e) => {
    setDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    lastPosRef.current = { x: offsetX, y: offsetY };
  }

  const draw = (x0, y0, x1, y1, size, type, opacity, color, emit) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalAlpha = opacity;
    if (type === 'solid') {
      ctx.setLineDash([]);
    }
    else if (type === 'dashed') {
      ctx.setLineDash([15, 15]);
    }
    else if (type === 'dotted') {
      ctx.setLineDash([2, 8]);
    }

    ctx.lineWidth = size;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();

    if (emit) {
      socket.emit('draw', { room, x0, y0, x1, y1, size, type, opacity, color });

    }
  }

  const handleMouseMove = (e) => {

    if (!drawing) {
      return
    }
    const { offsetX, offsetY } = e.nativeEvent;
    const x0 = lastPosRef.current.x;
    const y0 = lastPosRef.current.y;

    draw(x0, y0, offsetX, offsetY, brushSize, brushType, brushOpacity, brushColor, true);
    lastPosRef.current = { x: offsetX, y: offsetY };
  }


  const handleMouseUp = () => {
    setDrawing(false);
  }

  const handleBrushSize = (e) => {
    setBrushSize(Number(e.target.value));
  }

  const handleBrushType = (e) => {
    setBrushType(e.target.value);
  }

  const handleBrushOpacity = (e) => {
    setBrushOpacity(Number(e.target.value) / 10);
  }

  const joinRoom = () => {
    socket.emit('joinRoom', room);
    setInRoom(true);
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    socket.emit('clearCanvas');
  }

  useEffect(() => {

    socket.on('connect_error', ()=>{
      setServerOnline(false);
      setErrorMessage("I wish I had infinite money, but sadly, I don’t! 💸 The server’s offline for now, but please check back later!");
    })

    socket.on('history', (history) => {
      history.forEach(data => {
        const { x0, y0, x1, y1, size, type, opacity, color } = data;
        draw(x0, y0, x1, y1, size, type, opacity, color, false);
      });
    })
    socket.on('draw', (data) => {
      const { x0, y0, x1, y1, size, type, opacity, color } = data;
      draw(x0, y0, x1, y1, size, type, opacity, color, false);
    });

    socket.on('clearCanvas', () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    })

    return () => {
      socket.off('history');
      socket.off('draw');
      socket.off('clearCanvas');
    };
  }, [socket]);

      

  return (
    

    <div className='container'>
  {!serverOnline ? ( <div className='error-message'>{errorMessage}</div>):(<>

      {!inRoom ?  (<div className='roomSelection'>
        <input type="text" placeholder="Enter room name" value={room} onChange={(e) => setRoom(e.target.value)} /> <button onClick={joinRoom}>Join Room</button>
      </div>):(



      <div className='drawingBoard'>
        <div className='canvasActions'>

          <div className='form-element'>
            <label htmlFor="brushOpacity">Brush Opacity</label><input type="range" id="brushOpacity" name="brushOpacity" min="1" max="10" value={brushOpacity * 10} onChange={handleBrushOpacity} /><span>{brushOpacity}</span>
          </div>
          <div className='form-element'>
            <HexColorPicker className='color-picker' color={brushColor} onChange={setBrushColor} />
          </div>
          <div className='form-element'>
            <label htmlFor="brushSize">Brush Size</label><input type="range" id="brushSize" name="brushSize" min="1" max="50" value={brushSize} onChange={handleBrushSize} /><span>{brushSize}</span>
          </div>
          <div className='form-element'>
            <label htmlFor="brushType">Brush Type</label><select id="brushType" name="brushType" value={brushType} onChange={handleBrushType}> <option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select>
          </div>
          <div className='form-element'>
            <button onClick={clearCanvas}>Clear Canvas</button>
          </div>
        </div>
        <canvas ref={canvasRef} width="800px" height="800px" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />
      </div>
      )}
      </>)}
    </div>
  )
}

export default App
