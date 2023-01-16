import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useProyectos from "../hooks/useProyectos"
import Buscador from './Buscador'


export const Header = () => {

    const {handleBuscador, cerrarSesionProyectos} = useProyectos()

    const { cerrarSesionAuth } = useAuth()

    const handleCerrarSesion = () => {
        cerrarSesionAuth()
        cerrarSesionProyectos()
        localStorage.removeItem('token');
    }

    return (
        <header className="px-4 py-6 bg-white border-b md:flex md:justify-between">
            <h2 className="text-4xl text-sky-400 hover:text-sky-500 transition-colors cursor-pointer font-semibold text-center ">
                <Link to={'/proyectos'}>
                    Uptask
                </Link>
            </h2>
            <div className="flex items-center justify-center mt-6 md:mt-0">

                <button
                    onClick={handleBuscador}
                    type="button"
                    className=" rounded-lg p-2 border bg-slate-200 hover:bg-slate-300 transition-colors"
                >Buscar proyecto</button>
            </div>

            <div className="flex flex-col md:flex-row my-6 md:my-0 items-center gap-4 justify-center">
                <Link
                    to='/proyectos'
                    className="font-semibold text-gray-400 hover:text-gray-800 transition-colors"
                >
                    Proyectos
                </Link>
                <button
                onClick={handleCerrarSesion}
                    type="button"
                    className="text-black hover:text-gray-800 text-sm bg-red-200 hover:bg-red-400 p-2 rounded font-semibold transition-all"
                >
                    Cerrar Sesión
                </button>

            <Buscador/>
            </div>


        </header>
    )
}
