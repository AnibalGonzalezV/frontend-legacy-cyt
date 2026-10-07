
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { Maintenance } from '../../components/maintenance';
import { Remove_change } from '../../components/remove_change';
import './style.css'
import 'bootstrap/dist/css/bootstrap.css'
import swal from 'sweetalert';
import FileDownload from "js-file-download";
import ucn from '../../images/ucn.png'
import cii from '../../images/logo-cii.png'
import vct from '../../images/vct.png'
import OpEno from '../../images/OpEno.png'
import Swal from 'sweetalert2';



export const Inputs = () => {
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showRemove_change, setShowRemove_change] = useState(false);
  const [semana, setSemana] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [archivo_pdf, setArchivoPfd]= useState(null);
  const [semanas, setSemanas] = useState([]);
  const navigate = useNavigate(); 

  //---------------------------------------------
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true)

  const handleSwitchChange = () => {
    // Cambia el estado del interruptor al contrario de su estado actual
    console.log(isSwitchEnabled)
    setIsSwitchEnabled(!isSwitchEnabled);
  };

  //---------------------------------------------

  const handleAdd = () => {
    setShowMaintenance(true); 
  };
  const handleClose = () => {
    setShowMaintenance(false); 
  };
  const handleAddRemove = () => {
    setShowRemove_change(true); 
  };
  const handleCloseRemove = () => {
    setShowRemove_change(false); 
  };



  const subirArchivo = e => {
    setArchivo(e);
  }

  const subirArchivoPdf = e => {
    setArchivoPfd (e);
  }

  const insertarArchivos = async () => {
    if (archivo === null /*|| archivo_pdf === null*/) {
      swal({
          icon: 'error',
          title: 'Error',
          text: 'No se ha Ingresado el Programa Vendimia.'
      });
      return;
  }

    const f = new FormData();

    for (let index = 0; index < archivo.length; index++) {
      f.append("myfile", archivo[index]);
    }

    /*for (let index = 0; index < archivo_pdf.length; index++) {
      f.append("mypdf", archivo_pdf[index]);
    }*/

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/postFile`, f)
    .then(response => {
    swal({
      title: "Archivos subidos correctamente",
      icon: "success",
      button: "Aceptar"
    });
    setSemanas(response.data.semanas);
  })
  .catch(error => {
    console.log(error);
    swal({
      title: "Error al subir el archivo",
      text: "Ha ocurrido un error al subir el archivo.",
      icon: "error",
      button: "Aceptar"
    });
  });
    
    
  }


  const download = async (url, filename) => {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
      });
      console.log(response);
      FileDownload(response.data, filename);
    } catch (error) {
        swal({
          icon: 'error',
          title: 'Error',
          text: 'No ha cargado los archivos.'
      });
    }
  };

  const downloadInputFile = async () => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/getFileInput`,
        method: 'GET',
        responseType: 'blob',
      });
      console.log(response);
      FileDownload(response.data, 'Info de día.xlsx');
    } catch (error) {
      console.error('Error al descargar el archivo de entrada:', error);
    }
  };


  const iniciarPlanificacion = async () => {
    try {
      Swal.fire({
        title: 'Generando programación...',
        text: "Espere por favor.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
  
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/iniciarPlanificacion`, {
        isSwitchEnabled: isSwitchEnabled,
      });
  
      console.log('Respuesta del backend:', response.data);
      await download(`${process.env.REACT_APP_BACKEND_URL}/getFileOutputModelo`, 'Planificación del día.pdf');
      console.log('Descarga de getFileOutputModelo realizada con éxito');
      await download(`${process.env.REACT_APP_BACKEND_URL}/getFileOutputResumen`, 'Resumen.xlsx');
      console.log('Descarga de getFileOutputResumen realizada con éxito');
      await download(`${process.env.REACT_APP_BACKEND_URL}/getFileOutputResultadoPlanificacion`, 'Resultados_planificación.xlsx');
      console.log('Descarga de getFileOutputResumen realizada con éxito');
      visualizarPDF()
      //await download(`${process.env.REACT_APP_BACKEND_URL}/deletepdf`);
      Swal.close();
    } catch (error) {
      console.error('Error al llamar al backend:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al llamar al backend. Por favor, inténtalo de nuevo.',
      });
    }
  };

  const visualizarPDF = () => {
    const urlPdf = `${process.env.REACT_APP_BACKEND_URL}/getUrlPlanificacion`;
    let url=(urlPdf);
    window.open(url, '_blank'); 
  };





  const handleSemana = async (e) => {
    e.preventDefault();
    if (semana) {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/obtenerSemana`, {
        semana: semana
      }).catch((error) => {
        if (error.response.status === 400) console.log(error.response.status);
      })
    }

  }
  const handleSubmit = async (data) => {
    navigate('/outputs/' + semana)
  }

  function imprimirMensaje() {
    console.log("Este es un mensaje en la consola.");
  }


  return (
    <div className='background-input'>
      <div className='box-container-input'>
        <div className='box-top-input'>
          <h1 className='top-text-input'>Programación Bodega Lontué</h1>
          <div className='empresa'>
            <img src={vct} className='vct-logo'/>
          </div>
        </div>
        {/*<form className='form-group' autoComplete='off' onSubmit={handleSubmit}>*/}
          <div className='box-down-input'>
            <div className='main-container'>
            
            <div class="input-container1">
              <div class="step-circle">1</div>
              <h2 class="step-title">Carga de archivos</h2>
            </div>

            <div className="col-6">
                <label className='text-input-excel'><h1>Ingresar programa vendimia</h1></label>
                <label className='text-input-bajada' > Solo archivo tipo .xlsx </label>
                <input type='file' className='form-control' style={{ backgroundColor: "#ff5b35", borderColor: "#ff5b35", color: "white", marginBottom: "20px"}} onChange={(e) => subirArchivo(e.target.files)} required></input>
              </div>
            {/*<div className="col-6">
                <label className='text-input-excel'><h1>Ingresar plan Lontué (.pdf)</h1></label>
                <input type='file' className='form-control' style={{ backgroundColor: "#ff5b35", borderColor: "#ff5b35",  color: "white"}} onChange={(e) => subirArchivoPdf(e.target.files)} required></input>
            </div>*/}
            

              
            
              <div className='btn-in'>
                <button className='button-succ' onClick={() => insertarArchivos()}>
                  Cargar
                </button>
              </div>  
              {/* <div className="col-6">    
                  <div className='btn-out'>
                    <button className='button-succ' onClick={(e) =>downloadInputFile(e)}>
                      Descargar
                    </button>
                  </div> 
                </div>
              */}
            </div>
             {/*<div className='semana'>
              <h1 className='semana-h1'>Seleccione la semana en la que requiere hacer la optimización:</h1>
              <select name='semana-select' onChange={(event) => setSemana(event.target.value)} onClick={handleSemana} required>
                <option value="">No definido</option>
                {semanas.map(elemento => (
                  <option value={elemento} key={elemento}>{elemento}</option>
                ))}
              </select>
                </div> */}
              <div className='main-container'>
                <div class="input-container2">
                <div class="step-circle">2</div>
                <h2 class="step-title">Administración de maquinarias</h2>
              </div>
                <div className='container'>
                  <div className='presettings'>
                    <button
                      className='button-maquina'
                      type='button'
                      onClick={handleAdd}
                      disabled={showMaintenance}
                    >
                      Añadir máquina/Habilitar-Deshabilitar
                    </button>
                    {showMaintenance && <Maintenance onClose={handleClose} />}
                  </div>  
                </div>
                <div className='container'>
                  <div className='presettings'>
                    <button
                      className='button-maquina'
                      type='button'
                      onClick={handleAddRemove}
                      disabled={showRemove_change}
                    >
                      Modificar máquina/Eliminar máquina
                    </button>
                    {showRemove_change && <Remove_change onClose={handleCloseRemove} />}
                  </div>  
                </div>


                {/* Switch habiliata SPK
                
                <div className="App">
                  <label className='text-input-SPK'><h1>Restricción SPK </h1></label>
                  <label className={`switch ${isSwitchEnabled ? 'enabled' : 'disabled'}`}>
                    <input type="checkbox" checked={isSwitchEnabled} onChange={handleSwitchChange} />
                    <span className="slider"></span>
                  </label>
                </div> 
                */}
            


              <div className='next'>
                <button className='button-iniciar' onClick={(e) =>iniciarPlanificacion(e)}>
                  Iniciar Programación
                </button>
              </div>

            </div>
            

          </div>
        {/*</form>*/}
        
        <div className='container'>
          <div className='logos'>
            <img src={cii} className='cii-logo'/>
            <img src={OpEno} className='opEno-logo'/>
            <img src={ucn} className='ucn-logo'/>
          </div>
        </div>
      </div>
    </div>
  )
}
