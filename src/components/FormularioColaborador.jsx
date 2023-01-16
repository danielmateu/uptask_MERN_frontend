import { useState } from "react"
import useProyectos from "../hooks/useProyectos"
import { Alerta } from "./Alerta"



export const FormularioColaborador = () => {
    
    const [email, setEmail] = useState('')

    const { mostrarAlerta, alerta, submitColaborador } = useProyectos()

    

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(email === '' ){
            mostrarAlerta({ 
                msg: 'El email es necesario',
                error: true
            })
            return;
        }

        submitColaborador(email)
    }

    const {msg} = alerta;

    return (
        <form
            className="bg-white py-10 px-4 m-4 shadow-lg hover:shadow-none transition-all rounded-lg"
            onSubmit={handleSubmit}
        >
            <div className="mb-5">
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className='text-gray-400 font-semibold text-sm'
                    >Email del colaborador</label>
                    <input
                        type="email"
                        id='email'
                        placeholder='Email del nuevo colaborador'
                        className='border-2 w-full p-2 placeholder-gray-400 rounded mb-4'
                        value={email}
                        onChange={e => setEmail(e.target.value)}

                    />

                    <input
                        type="submit"
                        className='bg-sky-200 hover:bg-sky-300 w-full transition-colors p-2 rounded-lg mb-4 hover:shadow font-semibold cursor-pointer text-sm'
                        value='Buscar colaborador'
                    />

                    {msg && <Alerta alerta={alerta}/>}
                </div>
            </div>
        </form>
    )
}
