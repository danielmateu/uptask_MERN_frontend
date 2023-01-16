
import { useEffect, useState } from "react"
import { useParams, Link } from 'react-router-dom'

import { Alerta } from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"


export const ConfirmarCuenta = () => {

    const [alerta, setAlerta] = useState({})
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

    const params = useParams();
    const { id } = params;


    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                
                const url = `/usuarios/confirmar/${id}`
                const { data } = await clienteAxios(url)

                setAlerta({
                    msg: data.msg,
                    error: false,
                })

                setCuentaConfirmada(true)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }

        confirmarCuenta()
    }, [])

    const { msg } = alerta;


    return (
        <>
            <h1 className="text-sky-400 text-6xl font-semibold">Confirma tu cuenta y comienza a crear tus {' '}<span className="text-slate-400">proyectos</span>
            </h1>

            <div className="mt-10 md:mt-5 shadow-md px-5 py-10 rounded-xl bg-white">
                {msg && <Alerta alerta={alerta} />}

                {cuentaConfirmada && (
                    <Link
                        className="block text-center my-4 text-slate-500 hover:text-slate-600"
                        to='/'
                    >
                        Inicia sesión
                    </Link>
                )}
            </div>
        </>
    )
}
