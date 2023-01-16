
import { createContext, useState, useEffect } from 'react'
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';


let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({})
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const {auth} = useAuth()

    useEffect(() => {

        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/proyectos', config);
                setProyectos(data)
            } catch (error) {
                console.log(error);
            }
        }

        obtenerProyectos()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])



    const navigate = useNavigate()

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 4000)
    }

    const submitProyecto = async proyecto => {

        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }

        return;

    }

    const editarProyecto = async proyecto => {
        // console.log('Editando')
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config);
            // console.log(data)
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)

            setProyectos(proyectosActualizados);

            //Mostrar la alerta
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })

            //Redireccionar
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);



        } catch (error) {
            console.log(error);
        }
    }

    const nuevoProyecto = async (proyecto) => {
        // console.log('Creando')
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            // console.log(data)
            setProyectos([...proyectos, data])

            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })

            setTimeout(() => {
                navigate('/proyectos')
                setAlerta({});
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async id => {

        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            // console.log(data)
            setProyecto(data)
            setAlerta({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);


        } catch (error) {
            // console.log(error)
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false);
        }
    }

    const eliminarProyecto = async id => {
        // console.log('Eliminando', id)
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            //Sincronizar el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id);

            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {

        const crearTarea = async tarea => {

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios.post('/tareas', tarea, config)
                // console.log(data)

                setAlerta({})
                setModalFormularioTarea(false);

                //SOCKET IO
                socket.emit('nueva tarea', data)

            } catch (error) {
                console.log(error)
            }
        }

        const editarTarea = async tarea => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)


                setAlerta({})
                setModalFormularioTarea(false)

                //Socket
                socket.emit('actualizar tarea', data)

            } catch (error) {
                console.log(error);
            }
        }

        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }

    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true);
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);


            setAlerta({
                msg: data.msg,
                error: false
            })



            setModalEliminarTarea(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000);

            //SOCKET
            socket.emit('eliminar tarea', tarea)
            setTarea({})

        } catch (error) {
            console.log(error);
        }

        console.log(tarea._id)
    }

    const submitColaborador = async (email) => {

        setCargando(true)
        try {
            // console.log('Submiting colaborador...', email)
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config);

            setColaborador(data)
            setAlerta({});
        } catch (error) {
            // console.log(error);
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        } finally {
            setCargando(false);
        }
    }

    const agregarColaborador = async (email) => {

        try {
            // console.log(email);
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);
            setAlerta({
                msg: data.msg,
                error: false
            })

            setColaborador({});
            // setAlerta({});
            setTimeout(() => {
                setAlerta({})
            }, 4000);

        } catch (error) {
            // console.log(error.response)
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        // console.log(colaborador)
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config);

            const proyectoActualizado = { ...proyecto }

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id);

            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            });

            setTimeout(() => {
                setAlerta({})
            }, 4000);

            setColaborador({})
            setModalEliminarColaborador(false)


        } catch (error) {
            console.log(error.response);
        }
    }

    const completarTarea = async id => {

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);

            setTarea({})
            setAlerta({})

            //Socket
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleBuscador = () => {

        setBuscador(!buscador);
        
    }
    //Socket IO
    const submitTareasProyecto = (tarea) => {
        //Agrega la tarea al state
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

        setProyecto(proyectoActualizado);
    }

    const eliminarTareaProyecto = (tarea) => {
        //TODO Actualizar el DOM
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)

        setProyecto(proyectoActualizado)
    }

    const acualizarTareaProyecto = tarea => {
        // Actualizar el DOM
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = (tarea) => {
        //Actualizar DoM
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return (

        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                acualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext
