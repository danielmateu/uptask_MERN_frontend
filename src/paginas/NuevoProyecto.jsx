import { FormularioProyecto } from "../components/FormularioProyecto"


const NuevoProyecto = () => {


    return (
        <>
            <h1 className="text-4xl p-4 font-semibold">Crear Proyecto</h1>

            <div className="mt-4 flex justify-center">
                <FormularioProyecto/>
            </div>
        </>
    )
}

export default NuevoProyecto