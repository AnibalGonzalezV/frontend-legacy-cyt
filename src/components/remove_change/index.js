import React, {useState, useEffect} from 'react'
import './style.css'
import axios from 'axios';
import { TimePicker } from '@material-ui/pickers';
import swal from 'sweetalert';
/*import Swal from 'sweetalert2';*/


export const Remove_change = ({ onClose }) => {

    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [tiempoProcesado, setTiempoProcesado]= useState(1);
    const [tarea, setTarea]= useState();
    const [capacidadMaxima, setCapacidadMaxima]= useState(0);
    const [maquinasHabilitadas, setMaquinasHabilitadas] = useState([]);
    const [maquinasDeshabilitadas, setMaquinasDeshabilitadas] = useState([]);
    const [tipoTareaSeleccionado, setTipoTareaSeleccionado] = useState('');
    const [maquinaSeleccionada, setMaquinaSeleccionada] = useState('');
    const [tareasDisponibles, setTareasDisponibles] = useState([]);
    const [listaSeleccionada, setListaSeleccionada] = useState('habilitadas');
    const [tipoTareaSeleccionadoEliminar, setTipoTareaSeleccionadoEliminar] = useState('');

    useEffect(() => {
        carga_datos()
        }, []);


    const carga_datos = () =>{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/getListas_habilitar`)
            .then((response) => {
                if (response.status === 200) {
                    const { habilitado, deshabilitado } = response.data;
                    setMaquinasHabilitadas(habilitado);
                    setMaquinasDeshabilitadas(deshabilitado);
                    const tareasHabilitadas = [...new Set(habilitado.map(item => item[2]))];
                    const tareasDeshabilitadas = [...new Set(deshabilitado.map(item => item[2]))];
                    const tareas = [...new Set([...tareasHabilitadas, ...tareasDeshabilitadas])];

                    setTareasDisponibles(tareas);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    const handleListaChange = (e) => {
        setListaSeleccionada(e.target.value);
        setTipoTareaSeleccionado('');
        setMaquinaSeleccionada('');
    };

    const handleTipoTareaChange = (e) => {
        const selectedTask = e.target.value;
        setTipoTareaSeleccionado(selectedTask);
        setMaquinaSeleccionada('');
    };
    const handleTipoTareaElimnarChange = (e) => {
        const selectedTask = e.target.value;
        setTipoTareaSeleccionadoEliminar(selectedTask);
        setMaquinaSeleccionada('');
    };

    const handleMaquinaChange = (e) => {
        const selectedMachine = e.target.value;
        setMaquinaSeleccionada(selectedMachine);
    };

    

    const cambiarEstadoMaquinaBackend = async () => {
        
        if (maquinaSeleccionada === '') {
            swal({
                icon: 'error',
                title: 'Error',
                text: 'Existen valores que no han sido especificados. Por favor, ingrese valores válidos.'
            });
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/eliminar_maquina`, {
                maquina: maquinaSeleccionada,
            });
    
            if (response.status === 200) {
                // Mostrar la respuesta del servidor
                console.log(response.data);
                carga_datos()
                swal({
                    title: "Máquina se ha eliminado corréctamente",
                    icon: "success",
                    button: "Aceptar"
                }).then(() => {
                    setTipoTareaSeleccionado('');
                    setMaquinaSeleccionada('');
                    setListaSeleccionada('habilitadas');
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                swal({
                    title: "No se pudo eliminar la máquina",
                    icon: "error",
                    button: "Aceptar"
                });
            }
        }
    };
    
    const maquinasMostrar = listaSeleccionada === 'habilitadas' ? maquinasHabilitadas : maquinasDeshabilitadas;

    {/*const handlerCargarId = function(e){
        const opcion = e.target.value;
        setIdMachine(machines[opcion].id_maquina);
        setTipo(machines[opcion].tipo)
    }*/}

    const handleAgregarMaquina = async () => {
        // Validación de valores
        if (tiempoProcesado === 'Seleccione una velocidad' || capacidadMaxima === 0 ||  tipoTareaSeleccionado === 'Seleccione una opción') {
            swal({
                icon: 'error',
                title: 'Error',
                text: 'Existen valores que no han sido especificados. Por favor, ingrese valores válidos.'
            });
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/setModificarParametros`, {
                tipoTareaSeleccionado: tarea,
                maquinaSeleccionada: maquinaSeleccionada,
                capacidadMaxima: capacidadMaxima,
                tiempoProcesado: tiempoProcesado
                
            });
    
            if (response.status === 200) {
                // Mostrar la respuesta del servidor
                console.log(response.data);
                
                swal({
                    title: "Parametros de la máquina modificados correctamente",
                    icon: "success",
                    button: "Aceptar"
                }).then(() => {
                    setTiempoProcesado('1');
                    setTarea('Seleccione una opción');
                    setCapacidadMaxima(0);
                    setTipoTareaSeleccionado('');
                    setMaquinaSeleccionada('');
                    setListaSeleccionada('habilitadas');
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                swal({
                    title: "No se pudo modificara parametros de la máquina",
                    icon: "error",
                    button: "Aceptar"
                });
            }
        }
    };
    

    const handleEliminarFormulario = () => {
        // Oculta el formulario
        setMostrarFormulario(false);
    };

    const opcionesVelocidad = {
        'Despalillado': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs'],
        'Prensado': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs'],
        'Pre-flotación': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs'],
        'Flotación': ['1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs','6 hrs','7 hrs','8 hrs','9 hrs','10 hrs','11 hrs','12 hrs']
    };

    const opcionescapacidadMaxima = {
        'Despalillado': ['10.000 Kilos', '20.000 Kilos', '30.000 Kilos', '40.000 Kilos', '50.000 Kilos','60.000 Kilos','70.000 Kilos','80.000 Kilos','90.000 Kilos','100.000 Kilos'],
        'Prensado': ['10.000 Kilos', '20.000 Kilos', '30.000 Kilos', '40.000 Kilos', '50.000 Kilos','60.000 Kilos','70.000 Kilos','80.000 Kilos','90.000 Kilos','100.000 Kilos'],
        'Pre-flotación': ['10.000 litros', '20.000 litros', '30.000 litros', '40.000 litros', '50.000 litros','60.000 litros','70.000 litros','80.000 litros','90.000 litros','100.000 litros'],
        'Flotación': ['10.000 litros', '20.000 litros', '30.000 litros', '40.000 litros', '50.000 litros','60.000 litros','70.000 litros','80.000 litros','90.000 litros','100.000 litros'],
        'Fermentación': ['10.000 litros', '20.000 litros', '30.000 litros', '40.000 litros', '50.000 litros','60.000 litros','70.000 litros','80.000 litros','90.000 litros','100.000 litros']

    };

    const obtenerDigito = (opcion, tarea) => {
        if (tarea === 'Despalillado' || tarea === 'Prensado'){
            const numeroPunto = opcion.split(' ')[0];
            return numeroPunto.split('.')[0];
        }
        else{
            const numeroPunto = opcion.split(' ')[0];
            return numeroPunto.split('.').join('');
        }
    };
    
    

    
    const handleClose = () => {
        onClose(); // Llama a la función onClose para cerrar la tabla de ingreso
    };

    


    return (
        <div>
            {mostrarFormulario && (
                <div className='main-container'>
                    <div className="container">
                        <div className='bob'>
                        <button  onClick={handleClose}>
                        &#10006; {/* Carácter Unicode para la "X" */}
                        </button>
                        </div>
                    
                    </div>
                    <div className="container px-4 text-center">
                        <div className='tittle-container'>
                            <label htmlFor="title" className='custom-label'>Modificar especificaciones de la máquina:</label>
                        </div>
                            <div className='row'>
                                <div className='maintenance'>
                                    <div className='contenedor'>
                                        <label htmlFor="lista">Estado:</label>
                                        <select id="lista" onChange={handleListaChange} value={listaSeleccionada}>
                                            <option value="seleccione">Selecione el estado de la máquina...</option>
                                            <option value="habilitadas">Máquinas Habilitadas</option>
                                            <option value="deshabilitadas">Máquinas Deshabilitadas</option>
                                        </select>
                                    </div>
                                    
                                </div>
                                {listaSeleccionada && (
                                    <div className='maintenance'>
                                        <div className='contenedor'>
                                        <label htmlFor="tipoTarea">Nombre del proceso:</label>
                                        <select id="tipoTarea" onChange={handleTipoTareaChange} value={tipoTareaSeleccionado}>
                                            <option value="">Seleccione el proceso...</option>
                                            {tareasDisponibles.map((tarea, index) => (
                                                <option key={index} value={tarea}>{tarea}</option>
                                            ))}
                                        </select>
                                        </div>
                                        {tipoTareaSeleccionado && (
                                            <div className='contenedor'>
                                                <label htmlFor="maquina">Id máquina:</label>
                                                <select id="maquina" onChange={handleMaquinaChange} value={maquinaSeleccionada}>
                                                    <option value="">Selecciona una máquina</option>
                                                    {maquinasMostrar
                                                        .filter(item => item[2] === tipoTareaSeleccionado)
                                                        .map((maquina, index) => (
                                                            <option key={index} value={maquina[0]}>{maquina[0]}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        )}

                                        

                                        
                                    </div>
                                )}
                            </div> 
                            <div className='row'>
                                
                                <div className='col-6'>
                                    <div className='contenedor'>
                                        <label htmlFor="Capmax">Capacidad máxima:</label>
                                        <select
                                            id='Capmax'
                                            onChange={(event) => {
                                                const capacidadMaxima = obtenerDigito(event.target.value, tipoTareaSeleccionado);
                                                setCapacidadMaxima(capacidadMaxima);
                                            }}
                                            value={capacidadMaxima}
                                            disabled={tipoTareaSeleccionado === 'Seleccione capacidad máxima:' || !opcionescapacidadMaxima[tipoTareaSeleccionado]}
                                        >
                                            <option value=''>Seleccione capacidad máxima:</option>
                                            {tipoTareaSeleccionado !== 'Seleccione capacidad máxima:' && opcionescapacidadMaxima[tipoTareaSeleccionado] && (
                                                opcionescapacidadMaxima[tipoTareaSeleccionado].map((opcion, index) => {
                                                    const capacidad = obtenerDigito(opcion, tipoTareaSeleccionado);
                                                    return (
                                                        <option key={index} value={capacidad}>
                                                            {opcion}
                                                        </option>
                                                    );
                                                })
                                            )}
                                        </select>
                                    </div>

                                </div>

                                <div className='col-6'>
                                {tipoTareaSeleccionado !== 'Fermentación' && ( // Mostrar el segundo contenedor solo si no es "Fermentación"
                                    <div className='maintenance'>
                                        <div className='contenedor'>
                                        <label htmlFor="Velocidad">  Tiempo de procesado:</label>
                                        <select
                                            id='Velocidad'
                                            onChange={(event) => {
                                            const velocidad = obtenerDigito(event.target.value, tipoTareaSeleccionado);
                                            setTiempoProcesado(velocidad);
                                            }}
                                            value={tiempoProcesado}
                                            disabled={tipoTareaSeleccionado === 'Seleccione una opción' || !opcionesVelocidad[tipoTareaSeleccionado]}
                                        >
                                            <option value=''>Seleccione tiempo de procesado</option>
                                            {tipoTareaSeleccionado !== 'Seleccione una opción' && opcionesVelocidad[tipoTareaSeleccionado] && (
                                            opcionesVelocidad[tipoTareaSeleccionado].map((opcion, index) => (
                                                <option key={index} value={obtenerDigito(opcion,tipoTareaSeleccionado)}>
                                                {opcion}
                                                </option>
                                            ))
                                            )}
                                        </select>
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>                   
                            
                        
                       
                        <div className="container">
                            <div className="bob">
                                <button className='button-maintenance' onClick={handleAgregarMaquina }>Modificar</button>
                            </div>
                        </div>       
                           
                        <div className="row">
                            <div>
                                <label htmlFor="title" className='custom-label'>Eliminar máquina:</label>
                            </div>
                            <div className='row'>
                                <div className='maintenance'>
                                    <div className='contenedor'>
                                        <label htmlFor="lista">Estado:</label>
                                        <select id="lista" onChange={handleListaChange} value={listaSeleccionada}>
                                            <option value="seleccione">Selecione el estado de la máquina...</option>
                                            <option value="habilitadas">Máquinas Habilitadas</option>
                                            <option value="deshabilitadas">Máquinas Deshabilitadas</option>
                                        </select>
                                    </div>
                                    
                                </div>
                                {listaSeleccionada && (
                                    <div className='maintenance'>
                                        <div className='contenedor'>
                                        <label htmlFor="tipoTarea">Nombre del proceso:</label>
                                        <select id="tipoTarea" onChange={handleTipoTareaElimnarChange} value={tipoTareaSeleccionadoEliminar}>
                                            <option value="">Seleccione el proceso...</option>
                                            {tareasDisponibles.map((tarea, index) => (
                                                <option key={index} value={tarea}>{tarea}</option>
                                            ))}
                                        </select>
                                        </div>
                                        {tipoTareaSeleccionadoEliminar && (
                                            <div className='contenedor'>
                                                <label htmlFor="maquina">Id máquina:</label>
                                                <select id="maquina" onChange={handleMaquinaChange} value={maquinaSeleccionada}>
                                                    <option value="">Selecciona una máquina</option>
                                                    {maquinasMostrar
                                                        .filter(item => item[2] === tipoTareaSeleccionadoEliminar)
                                                        .map((maquina, index) => (
                                                            <option key={index} value={maquina[0]}>{maquina[0]}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        )}

                                        

                                        
                                    </div>
                                )}
                            </div>      
                            <div className="container">
                                <div className="bob">
                                    <button className='button-maintenance' onClick={cambiarEstadoMaquinaBackend}>
                                    Eliminar máquina
                                </button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )} 
        </div>   
    );
    
}