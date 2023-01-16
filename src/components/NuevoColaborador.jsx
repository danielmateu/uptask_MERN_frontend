import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import { FormularioColaborador } from "./FormularioColaborador"


export const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos();
    const params = useParams();

    useEffect(() => {
        obtenerProyecto(params.id)
    }, []);

    if(!proyecto?._id) return <Alerta alerta={alerta}/>

    return (
        <>
            <h1 className="text-xl md:text-4xl md:mt-2 font-semibold mx-6">
                Añadir Colaborador(a) al proyecto: {proyecto.nombre}
            </h1>

            <div className="mt-6 justify-center">
                <FormularioColaborador />
            </div>

            {cargando ? <p className="text-center">cargando...</p> : colaborador?._id && (
                <div className="flex justify-center mt-6">
                    <div className="bg-white p-6 flex flex-col w-full m-4  rounded shadow-lg hover:shadow-sm transition-all">
                        <h2 className="text-center text-2xl font-semibold flex flex-wrap">Resultado: </h2>
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <p className="">{colaborador.nombre}</p>

                            <button 
                                type="button"
                                className="text-semibold text-gray-400 hover:text-gray-500"
                                onClick={() => agregarColaborador({
                                    email: colaborador.email
                                })}
                                >
                                Agregar al proyecto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
