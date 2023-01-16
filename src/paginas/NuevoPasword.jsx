import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Alerta } from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"



export const NuevoPasword = () => {

    const [tokenValido, setTokenValido] = useState(false)
    const [alerta, setAlerta] = useState('')
    const [password, setPassword] = useState('')
    const [passwordModificado, setPasswordModificado] = useState(false)

    const params = useParams();
    const { token } = params;

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                
                await clienteAxios(`/usuarios/olvide-password/${token}`);
                setTokenValido(true);

            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        comprobarToken();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setAlerta({
                msg: 'El password debe contener al menos 6 caracteres',
                error: true
            })
            return
        }

        try {
            const url = `/usuarios/olvide-password/${token}`

            const { data } = await clienteAxios.post(url, { password })
            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-400 text-6xl font-semibold my-10">Reestablece tu password y no pierdas el acceso a tus {' '}<span className="text-slate-400">proyectos</span>
            </h1>

            {
                msg && <Alerta alerta={alerta} />
            }

            {
                tokenValido && (
                    <form
                        action=""
                        className="my-10 bg-white rounded-lg shadow-md p-10 "
                        onSubmit={handleSubmit}
                    >

                        <div className="my-5">
                            <label htmlFor="password" className="text-gray-600 block">Nuevo password</label>
                            <input
                                id='password'
                                type="password"
                                placeholder="Escribe tu password"
                                className="w-full mt-3 p-3 rounded-xl"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>


                        <input type="submit" value='Nuevo password' className="bg-sky-400 p-4 rounded-xl shadow-md hover:shadow-none transition-all font-semibold text-white hover:cursor-pointer hover:text-gray-500 w-full mb-5" />
                    </form>
                )
            }

            {passwordModificado && (
                <Link
                    className="block text-center my-4 text-slate-500 hover:text-slate-600"
                    to='/'
                >
                    Inicia sesión
                </Link>
            )}

        </>
    )
}
