import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useTempo } from "./hooks/useTempo"
import './App.css'

function App() {
  const pantallaRef = useRef<HTMLDivElement>()
  const tiempoInicio = useRef(0)
  const tiempofinal = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>()

  const [isConfig, setConfig] = useState(false)
  const [tempo, setTempo] = useState({horas:0, minutos:0, segundos:0})
  const {angulo, tiempo, iniciar, parar} = useTempo({
    tiempoFinal: tiempofinal.current,
    tiempoInicio:tiempoInicio.current 
  })

  useEffect(()=> {
    if (!pantallaRef.current) return
    pantallaRef.current.textContent = tiempo
    if (!canvasRef.current) return 
    canvasRef.current.width = 300
    canvasRef.current.height = 300

    const ctx = canvasRef.current.getContext("2d")    
    ctx?.beginPath()
    ctx?.arc(150, 150, 100, 0, angulo, false)
    ctx?.rotate(Math.PI / 2)
    ctx?.stroke()

  }, [tiempo, angulo])

  const onIniciar = () => {
    tiempoInicio.current = Date.now()
    iniciar()
  }

  const onReiniciar = () => {
    parar()
    tiempoInicio.current = 0
  }

  const onConfig = () => {
    setConfig(true)
  }

  const onSave = () => {
    setConfig(false)
    tiempofinal.current = tempo.horas*60*60*1000 + tempo.minutos * 60 * 1000 + tempo.segundos*1000
  }

  const valido = () => {
    const {horas, minutos, segundos} = tempo
    return  (horas>=0 && horas<=24) && (minutos>=0 && minutos <= 59) && (segundos>=0 && segundos<=59)
  }

  const onChangeTempo = (e:ChangeEvent<HTMLInputElement>) => {

    if (!valido()) {
      return 
    }

    setTempo({
      ...tempo,
      [e.target.name]: +e.target.value
    })
  }

  return <div className="app">
  <header className="header">
    <h1 className="titulo-principal" > Cuenta regresiva </h1>
  </header>

  <div className="main">
      <div className="progreso" onClick={onConfig}>
        <canvas ref={canvasRef} />  
        <div className="progreso__texto" ref={ pantallaRef }> </div>
      </div>

      <div className = "control" >
        <button className="boton" onClick={ onIniciar }> Iniciar </button>
        <button className="boton" onClick={ onReiniciar}> Reiniciar </button>
      </div>

    </div>
    { isConfig && <div className="config">
            <h1 className="titulo-secundario">Editar Temporizador</h1> 
            <div className="config__time">
            <input value={tempo.horas} name="horas" onChange={onChangeTempo} className="config__input" type="number" />
            <input value={tempo.minutos} name="minutos" onChange={onChangeTempo} className="config__input" type="number" />
            <input value={tempo.segundos} name="segundos" onChange={onChangeTempo} className="config__input" type="number" />
            </div>
            <button onClick={onSave}>Save</button>
          </div>}
          </div>
        }
        
export default App