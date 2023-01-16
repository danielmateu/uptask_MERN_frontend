
import { createContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const autenticarUSuario = async () => {
            const token = localStorage.getItem('token')

            if(!token){
                setCargando(false)
                return;
            } 
                

            const config = {
                headers: {
                    "Conent-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
    
            try {
                const {data} = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                if(data._id && location.pathname === '/'){
                    navigate(`/proyectos`);
                }
                // navigate(`/proyectos`);
            } catch (error) {
                setAuth({})
            }finally{
                setCargando(false)
            }
        }
        autenticarUSuario()
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
    }


    return (
        <AuthContext.Provider
            value={{
                // hola
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext
