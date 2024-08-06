import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useTempo } from "./hooks/useTempo"
import './App.css'
import useSound from 'use-sound'
import sonido from './assets/sonido.mp3'

function App() {
  const pantallaRef = useRef<HTMLDivElement>()
  const tiempoInicio = useRef(0)
  const tiempofinal = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>()
  const [play, {stop}] = useSound(sonido)
  const [playing, setPlaying] = useState(false)
  const [isConfig, setConfig] = useState(false)
  const [tempo, setTempo] = useState({ horas: 0, minutos: 0, segundos: 0 })
  const {isAtEnd, angulo, tiempo, iniciar, parar } = useTempo({
    tiempoFinal: tiempofinal.current,
    tiempoInicio: tiempoInicio.current
  })


  useEffect(() => {
    if (!pantallaRef.current || !canvasRef.current) return
    pantallaRef.current.textContent = tiempo

    canvasRef.current.width = 300
    canvasRef.current.height = 300

    const ctx = canvasRef.current.getContext("2d") as CanvasRenderingContext2D
    ctx.lineWidth = 12
    ctx.strokeStyle = "#000"
    ctx.beginPath()
    ctx.arc(150, 150, 100, 0, 2*Math.PI, false)
    ctx.stroke()
    ctx.save()

    ctx.lineWidth = 6
    ctx.strokeStyle = "#00ff51d1"
    ctx.beginPath()
    ctx.arc(150, 150, 100, 0, angulo, false)
    ctx.stroke()

    if (isAtEnd) {
      play()
    }

  }, [tiempo, angulo, isAtEnd, play])

  const onIniciar = () => {
    tiempoInicio.current = Date.now()
    iniciar()
    setPlaying(true)
  }

  const onReiniciar = () => {
    parar()
    tiempoInicio.current = 0
    setPlaying(false)
    stop()
  }

  const onConfig = () => {
    setConfig(true)
  }

  const onSave = () => {
    setConfig(false)
    tiempofinal.current = tempo.horas * 59 * 59 * 1000 + tempo.minutos * 59 * 1000 + tempo.segundos * 1000
  }

  const valido = () => {
    const { horas, minutos, segundos } = tempo
    return (horas >= 0 && horas <= 24) && (minutos >= 0 && minutos <= 59) && (segundos >= 0 && segundos <= 59)
  }

  const onChangeTempo = (e: ChangeEvent<HTMLInputElement>) => {

    if (!valido()) {
      return
    }

    setTempo({
      ...tempo,
      [e.target.name]: +e.target.value
    })
  }

  return <div className="app" >
    <header className="header" >
      <h1 className="titulo-principal" > Cuenta regresiva </h1>
        </header>

        < div className = "main" >
          <div className="progreso" onClick = { onConfig } >
            <canvas ref={ canvasRef } />
              < div className = "progreso__texto" ref = { pantallaRef } > </div>
                </div>

                < div className = "control" >
                  <button disabled={playing} className="boton" onClick = { onIniciar } > Iniciar </button>
                    < button className = "boton" onClick = { onReiniciar } > Reiniciar </button>
                      </div>

                      </div>
  {
    isConfig && <div className="config" >
      <h1 className="titulo-secundario" > Editar Temporizador </h1>
        < div className = "config__time" >
          <input min={0} max={24} value={ tempo.horas } name = "horas" onChange = { onChangeTempo } className = "config__input" type = "number" />
            <input  min={0} max={59} value={ tempo.minutos } name = "minutos" onChange = { onChangeTempo } className = "config__input" type = "number" />
              <input min={0} max={59} value={ tempo.segundos } name = "segundos" onChange = { onChangeTempo } className = "config__input" type = "number" />
                </div>
                < button className="boton" onClick = { onSave } > Save </button>
                  </div>
  }
  </div>
}

export default App