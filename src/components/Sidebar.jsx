import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"


export const Sidebar = () => {

    const {auth} = useAuth();
    const nombre = auth.nombre;

    return (
        <aside className="md:w-1/3 lg:w-1/5 xl:w:1/6 px-5 py-4">
            <p className="text-xl font-semibold mt-8 capitalize">Hola: {nombre}</p>

            <Link
                to='crear-proyecto'
                className="bg-green-200 hover:bg-green-400 w-full p-3 text-black hover:text-gray-800 font-semibold block mt-5 rounded transition-all text-center
                "
            >Nuevo Proyecto</Link>
        </aside>
    )
}
