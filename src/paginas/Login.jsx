import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { Alerta } from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"


export const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    const { setAuth } = useAuth();

    const navigate = useNavigate()

    // console.log(auth);
    // console.log(cargando);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            return
        }

        try {
            const { data } = await clienteAxios.post('/usuarios/login', { email, password })
            setAlerta('');
            localStorage.setItem('token', data.token);
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            console.log(error)
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-400 text-6xl font-semibold mb-10">Inicia Sesion y administra tus {' '}<span className="text-slate-400">proyectos</span>
            </h1>

            <form
                action=""
                className="my-10 bg-white rounded-lg shadow-md p-10 "
                onSubmit={handleSubmit}
            >
                <div className="my-5">
                    <label htmlFor="email" className="text-gray-600 block">Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder="Email de registro"
                        className="w-full mt-3 p-3 rounded-xl"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="my-5">
                    <label htmlFor="password" className="text-gray-600 block">Password</label>
                    <input
                        id='password'
                        type="password"
                        placeholder="Password de registro"
                        className="w-full mt-3 p-3 rounded-xl"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <input type="submit" value='Iniciar Sesión' className="bg-sky-400 p-4 rounded-xl shadow-md hover:shadow-none transition-all font-semibold text-white hover:cursor-pointer hover:text-gray-500 w-full mb-5" />

                {
                    msg && <Alerta alerta={alerta} />
                }
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-4 text-slate-500 hover:text-slate-600"
                    to='/registrar'
                >
                    ¿No tienes una cuenta? Regístrate
                </Link>
                <Link
                    className="block text-center my-4 text-slate-500 hover:text-slate-600"
                    to='/olvide-password'
                >
                    Olvidé mi Password
                </Link>

            </nav>
        </>
    )
}
