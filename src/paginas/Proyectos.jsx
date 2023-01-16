import { Alerta } from "../components";
import { PreviewProyecto } from "../components/PreviewProyecto";
import useProyectos from "../hooks/useProyectos";
// import { io } from "socket.io-client";
// import { useEffect } from "react";

let socket;



export const Proyectos = () => {

    const {proyectos, alerta} = useProyectos();
    const {msg} = alerta;

    // useEffect(() => {
    //     socket = io(import.meta.env.VITE_BACKEND_URL)
    //     socket.emit('prueba', proyectos)

    //     socket.on('respuesta', (persona) => {
    //         console.log('Desde el frontend', persona)
    //     })
    // })
    
    // console.log(proyectos);
    return (
        <>
            <h1 className="text-4xl font-semibold mt-8 ml-8">Proyectos</h1>
            {msg && <Alerta alerta={alerta}/>}
            <div className="shadow-md hover:shadow-none transition-shadow bg-white mt-2 rounded-lg m-8 p-2">
                {
                    proyectos.length ? 
                    proyectos.map(proyecto => (
                        <PreviewProyecto
                            key={proyecto._id}
                            proyecto={proyecto}
                        />
                    ))
                    : <p className="text-center p-4">No hay proyectos</p>  
                }
            </div>
        </>
    )
}

export default Proyectos;
