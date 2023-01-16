
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import useProyectos from '../hooks/useProyectos'
import useAdmin from '../hooks/useAdmin'
// import useAuth from '../hooks/useAuth'
import { io } from "socket.io-client";

import { Tarea, Alerta, Colaborador, ModalFormularioTarea, ModalEliminarTarea, ModalEliminarColaborador } from '../components'


let socket;

const Proyecto = () => {


    const params = useParams()
    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, acualizarTareaProyecto, cambiarEstadoTarea } = useProyectos()
    const admin = useAdmin();

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
        socket.emit('abrir proyecto', params.id)
    }, [])

    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
            // console.log(tareaNueva);
        })

        socket.on('tarea eliminada', tareaEliminada => {
            if (tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        })

        socket.on('tarea actualizada', tareaActualizada => {
            if (tareaActualizada.proyecto._id === proyecto._id) {
                acualizarTareaProyecto(tareaActualizada)
            }
        })

        socket.on('nuevo estado', nuevoEstadoTarea => {
            if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })


    const { nombre } = proyecto;

    if (cargando) return 'Cargando...'

    const { msg } = alerta

    return (
        msg && alerta.error ? <Alerta alerta={alerta} /> : (
            <>
                <div className="flex flex-col items-center sm:flex-row md:justify-between">
                    <h1 className="font-semibold text-2xl sm:text-4xl  p-4">{nombre}</h1>

                    {admin && (

                        <div className='flex items-center gap-2 text-gray-400 hover:text-gray-500 mr-4 transition-all' >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hover:-rotate-90 transition-all">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>

                            <Link
                                to={`/proyectos/editar/${params.id}`}
                                className='font-semibold'
                            >Editar</Link>
                        </div>
                    )}
                </div>

                {admin && (

                    <div className="flex items-center justify-center md:justify-start sm:ml-4">
                        <button
                            onClick={handleModalTarea}
                            type='button'
                            className='flex items-center justify-between gap-4 bg-sky-200 hover:bg-sky-300 transition-colors text-sm p-2 mt-4 w-auto rounded-lg font-semibold '>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 hover:translate-x-2 hover:rotate-45 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Nueva Tarea
                        </button>
                    </div>
                )}

                <p className="font-semibold text-xl m-4">Tareas del Proyecto</p>

                <div className="flex justify-center">
                    <div className="md:w-1/3 lg:w-1/4">
                        {msg && <Alerta alerta={alerta} />}
                    </div>
                </div>


                <div className="bg-white shadow-md hover:shadow-none transition-shadow m-6 rounded-lg p-4">
                    {proyecto.tareas?.length ? proyecto.tareas?.map(tarea => (
                        <Tarea
                            key={tarea._id}
                            tarea={tarea}
                        />
                    )) : <p className='text-center p-4'>No hay tareas en este proyecto</p>}
                </div>

                {admin && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p className="font-semibold text-xl m-4">Colaboradores</p>
                            <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                                className='text-gray-400 hover:text-gray-500  transition-colors font-semibold mr-4'
                            >
                                Añadir
                            </Link>
                        </div>

                        <div className="bg-white shadow-md hover:shadow-none transition-shadow m-6 rounded-lg p-4">
                            {proyecto.colaboradores?.length ? proyecto.colaboradores?.map(colaborador => (
                                <Colaborador
                                    key={colaborador._id}
                                    colaborador={colaborador}
                                />
                            )) : <p className='text-center p-4'>No hay colaboradores en este proyecto</p>}
                        </div>
                    </>
                )}



                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>
        )
    )


}

export default Proyecto