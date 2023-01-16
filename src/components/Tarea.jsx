import { formatearFecha } from "../helpers/formatearFecha"
import useAdmin from "../hooks/useAdmin"
import useProyectos from "../hooks/useProyectos"



export const Tarea = ({ tarea }) => {

    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()
    const admin = useAdmin();

    const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea
    return (

        <div className="border rounded-xl p-4 m-2 xs:flex-col sm:flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="mb-2 text-xl">{nombre}</p>
                <p className="mb-2 text-sm text-gray-400">{descripcion}</p>
                <p className="mb-2 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-2 text-gray-500">Prioridad: {prioridad}</p>
                {/* <p className="text-xl">{nombre}</p> */}
                {
                    estado && <p className="text-xs bg-green-400 rounded-xl p-2 font-semibold">completado por: {tarea.completado.nombre} </p>
                }
            </div>
            <div className="flex gap-2 flex-col sm:flex-row items-center">
                {admin && (
                    <button
                        className='text-sky-400 hover:text-sky-500 transition-colors font-semibold'
                        onClick={() => handleModalEditarTarea(tarea)}
                    >
                        Editar
                    </button>
                )}

                <button className={`${estado ? 'text-green-400 hover:text-green-500' : 'text-gray-400 hover:text-gray-500'} transition-colors font-semibold`}
                        onClick={() => completarTarea(_id)}
                    >{estado ? 'Completa' : 'Incompleta'}</button>
                {   admin && (
                        <button
                            className='text-red-300 hover:text-red-500 transition-colors font-semibold'
                            onClick={() => handleModalEliminarTarea(tarea)}
                        >
                            Eliminar
                        </button>
                    )
                }
            </div>
        </div>
    )
}
