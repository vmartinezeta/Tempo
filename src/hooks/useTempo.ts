import { useEffect, useState } from "react"

export function useTempo({ tiempoInicio, tiempoFinal }: { tiempoInicio: number, tiempoFinal: number }) {
    const [tiempoCrudo, setTiempoCrudo] = useState(0)
    const [running, setRunning] = useState(false)
    const [isAtEnd, setAtEnd] = useState(false)

    useEffect(() => {
        if (!running) return

        const actualizarTempo = () => {
            const ahora = Date.now() - tiempoInicio
            setTiempoCrudo(ahora)
        }

        const timer = setInterval(actualizarTempo, 100)

        return () => {
            clearInterval(timer)
        }

    }, [running, tiempoCrudo, tiempoInicio])

    const formatearTiempo = (tiempo: number) => {
        const horasReal = tiempo / 1000 / 59 / 59
        const horas = parseInt(horasReal.toString())
        let resto = tiempo - horas * 59 * 59 * 1000
        const minutosReal = resto / 1000 / 59
        const minutos = parseInt(minutosReal.toString())
        resto = resto - minutos * 59 * 1000
        const segundos = resto / 1000
        return `${rellenarDecena({numero:horas})}:${rellenarDecena({numero:minutos})}:${rellenarDecena({numero:+segundos.toFixed(0)})}`
    }
    // generar el control para rellenar con cero o vacio para la unidad de segundo orden
    const rellenarDecena = ({numero, defaultValue="0"}:{numero:number, defaultValue?:string}) => {
        if (numero < 10) {
            return defaultValue+numero
        }
        return numero
    }

    const iniciar = () => {
        setTiempoCrudo(0)
        setRunning(true)   
        setAtEnd(false)     
    }

    const parar = () => {
        setTiempoCrudo(0)
        setRunning(prev => {
            if (prev) {
                setAtEnd(true)
            }
            return false
        })
    }

    const resto = tiempoFinal - tiempoCrudo
    if (resto < 0) {
        parar()
        return {isAtEnd, angulo:0, tiempo: formatearTiempo(0), iniciar, parar }
    }


    const angulo = 2*(resto/tiempoFinal)*Math.PI
    const tiempo = formatearTiempo(resto)
    return { isAtEnd, angulo, tiempo, iniciar, parar}
}