import useProyectos from "../hooks/useProyectos"


export const Colaborador = ({ colaborador }) => {

    const { nombre, email } = colaborador
    const {handleModalEliminarColaborador} = useProyectos()

    return (
        <div className="border p-4 mb-2 flex justify-between items-center rounded-lg hover:bg-slate-200 transition-colors">
            <div>
                <p>{nombre}</p>
                <p className="text-sm text-gray-600">{email}</p>
            </div>

            <div>
                <button
                    type="button"
                    className="text-red-300 hover:text-red-500 font-semibold"
                    onClick={() => handleModalEliminarColaborador(colaborador)}>
                    Eliminar
                </button>
            </div>
        </div>
    )
}
