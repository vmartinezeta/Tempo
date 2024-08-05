import { useEffect, useState } from "react"

export function useTempo({ tiempoInicio, tiempoFinal }: { tiempoInicio: number, tiempoFinal: number }) {
    const [tiempoCrudo, setTiempoCrudo] = useState(0)
    const [running, setRunning] = useState(false)


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
        return `${ponerAusenciaDecenaCero(horas)}:${ponerAusenciaDecenaCero(minutos)}:${ponerAusenciaDecenaCero(+segundos.toFixed(0))}`
    }

    const ponerAusenciaDecenaCero = (numero: number) => {
        if (numero < 10) {
            return `0${numero}`
        }
        return numero
    }

    const iniciar = () => {
        setTiempoCrudo(0)
        setRunning(true)        
    }

    const parar = () => {
        setTiempoCrudo(0)
        setRunning(false)
    }

    const resto = tiempoFinal - tiempoCrudo
    if (resto < 0) {
        parar()
        return {angulo:0, tiempo: formatearTiempo(0), iniciar, parar }
    }


    const angulo = 2*(resto/tiempoFinal)*Math.PI
    const tiempo = formatearTiempo(resto)
    return { angulo, tiempo, iniciar, parar}
}