import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"


export const PreviewProyecto = ({ proyecto }) => {

    const { auth } = useAuth()

    const { nombre, _id, cliente, creador } = proyecto

    return (
        <div className="border p-5 flex flex-col md:flex-row m-5 hover:bg-slate-200 transition-colors rounded-xl justify-between ">
            <div className="flex items-center gap-2 justify">
                <p className="flex-1">{nombre} <span className="text-sm text-gray-400">{cliente}</span></p>

                {auth._id !== creador && (
                    <p className="p-1 text-xs font-semibold uppercase">Colaborador</p>
                )}
            </div>

            <Link to={`${_id}`} className='text-gray-400 hover:text-gray-600 font-semibold '>Ver Proyecto</Link>
        </div>
    )
}
