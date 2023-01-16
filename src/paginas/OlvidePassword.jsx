
import { useState } from "react"
import { Link } from "react-router-dom"
import { Alerta } from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";


export const OlvidePassword = () => {

    const [email, setEmail] = useState('');
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(email===''|| email.length < 6){
            setAlerta({
                msg: 'El email es obligatorio',
                error: true
            })

            return;
        }

        try {
            const {data} = await clienteAxios.post(`/usuarios/olvide-password`, {email});
            
            setAlerta({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
        }
    }


    const {msg} = alerta

    return (
        <>
            <h1 className="text-sky-400 text-6xl font-semibold mb-5">Recupera tu acceso y no pierdas tus {' '}<span className="text-slate-400">proyectos</span>
            </h1>

            {
                msg && <Alerta alerta={alerta}/>
            }

            <form
                action=""
                className="my-10 bg-white rounded-lg shadow-md p-10 "
                onSubmit={handleSubmit}
            >
                {/* <div className="my-5">
                    <label htmlFor="nombre" className="text-gray-600 block">Nombre</label>
                    <input id='nombre' type="text" placeholder="Nombre de usuario" className="w-full mt-3 p-3 rounded-xl" />
                </div> */}
                <div className="my-5">
                    <label htmlFor="email" className="text-gray-600 block">Email</label>
                    <input
                        id='email'
                        type="email"
                        placeholder="Email de registro" 
                        className="w-full mt-3 p-3 rounded-xl" 
                        value={email}
                        onChange={ e => setEmail(e.target.value)}
                    />
                </div>

                <input type="submit" value='Enviar instrucciones' className="bg-sky-400 p-4 rounded-xl shadow-md hover:shadow-none transition-all font-semibold text-white hover:cursor-pointer hover:text-gray-500 w-full mb-5"  />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-4 text-slate-500 hover:text-slate-600"
                    to='/'
                >
                ¿Ya estás registrado? Inicia sesión
                </Link>
                
                <Link
                    className="block text-center my-4 text-slate-500 hover:text-slate-600"
                    to='/registrar'
                >
                ¿No tienes una cuenta? Regístrate
                </Link>

            </nav>
        </>
    )
}
