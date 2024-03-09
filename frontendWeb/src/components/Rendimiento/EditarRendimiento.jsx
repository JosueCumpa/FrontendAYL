import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
  Select,
  SelectItem,
  Input,
  Switch,
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function EditarRendimiento({
  Rendimiento,
  type = "edit",
  updateRendimiento,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCamion, setSelectedCamion] = useState(null);
  const [origen, setOrigen] = useState("");
  const [estado, setEstate] = useState(false);
  const [carga, setCarga] = useState("");
  const [peso, setPeso] = useState("");
  const [destino, setDestino] = useState("");
  const [camiones, setCamiones] = useState([]);
  const [fechaCreacion, setFechaCreacion] = useState(new Date());
  const [dataGeneral, setDataGeneral] = useState([]);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [error, setError] = useState(false);
  const [selectedDataGeneralId, setSelectedDataGeneralId] = useState(null);
  const [selectedDataGeneralId2, setSelectedDataGeneralId2] = useState(null);
  const [maxKilometraje, setMaxKilometraje] = useState(null);
  const [diferenciaKilometraje, setDiferenciaKilometraje] = useState(null);
  const [rendimientokmxgalon, setRendimientoxgalon] = useState(null);
  const [rendimientoEsperado, setRendimientoEsperado] = useState("");
  const [rendimientoCalculado, setRendimientoCalculado] = useState(null);
  const [excesoReal, setExcesoReal] = useState(null);

  // const handleDataGeneralChange = (event) => {
  //   const selectedDataGeneralId = event.target.value;

  //   // Busca la data general seleccionada en la lista de data general
  //   const selectedDatageneral = dataGeneral.find(
  //     (datageneral) => datageneral.id === parseInt(selectedDataGeneralId)
  //   );

  //   setSelectedDataGeneralId(selectedDatageneral);
  //   console.log(selectedDataGeneralId);
  // };

  // const handleDataGeneralChange2 = (event) => {
  //   const selectedDataGeneralId2 = event.target.value;

  //   // Busca la data general seleccionada en la lista de data general
  //   const selectedDatageneral = dataGeneral.find(
  //     (datageneral) => datageneral.id === parseInt(selectedDataGeneralId2)
  //   );

  //   setSelectedDataGeneralId2(selectedDatageneral);
  //   console.log(selectedDataGeneralId2);
  // };

  // // Función para buscar la data general asociada al camión seleccionado
  // const handleBuscarDataGeneral = async () => {
  //   if (selectedCamion) {
  //     try {
  //       const tokens = JSON.parse(localStorage.getItem("tokens"));
  //       const res = await axios.get(
  //         `${API_BASE_URL}/listado_datapendiente/?placa=${selectedCamion.placa}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${tokens.access}`,
  //           },
  //         }
  //       );
  //       setDataGeneral(res.data);
  //     } catch (error) {
  //       console.error(
  //         "Error al obtener la lista de Data General pendiente:",
  //         error
  //       );
  //     }
  //   }
  // };

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-.]+/g, " ");
    if (value.length > 100) {
      value = value.substring(0, 100);
    }
    fieldSetter(value);
  };

  // // useEffect para cargar la lista de camiones
  // useEffect(() => {
  //   const obtenerListaCamiones = async () => {
  //     try {
  //       const tokens = JSON.parse(localStorage.getItem("tokens"));
  //       const res = await axios.get(`${API_BASE_URL}/listado_camion/`, {
  //         headers: {
  //           Authorization: `Bearer ${tokens.access}`,
  //         },
  //       });
  //       setCamiones(res.data);
  //     } catch (error) {
  //       console.error("Error al obtener la lista de camiones:", error);
  //     }
  //   };

  //   obtenerListaCamiones();
  // }, []);

  // const handleCamionChange = (event) => {
  //   const selectedCamionId = event.target.value;

  //   // Busca el camión seleccionado en la lista de camiones
  //   const selectedCamion = camiones.find(
  //     (camion) => camion.id === parseInt(selectedCamionId)
  //   );

  //   // Actualiza el estado con el camión seleccionado
  //   setSelectedCamion(selectedCamion);
  // };

  const handleSubmit = async () => {
    // Validar campos
    const fechaParaEnviar = new Date(fechaCreacion).toISOString();

    try {
      if ((type === "agregar" && excesoReal === 0) || excesoReal === null) {
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/Rendimiento/${Rendimiento.id}/`;

        const data = {
          id_datageneral: Rendimiento.id_data_general,
          fecha_tanqueo: fechaParaEnviar,
          origen: origen,
          destino: destino,
          carga: carga,
          peso: peso,
          km_recorrido: diferenciaKilometraje,
          rend_kmxglp: rendimientokmxgalon,
          gl_esperado: rendimientoCalculado,
          ren_esperado: rendimientoEsperado,
          exceso_real: excesoReal,
        };
        console.log("enviar:", data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.patch(url, data, { headers }), {
          loading: "Actualizando...",
          success: "Rendimiento Actualizado",
          error: "Error al registrar Actualizado! Verifique los campos",
        });
      } else {
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/Rendimiento/${Rendimiento.id}/`;

        const data = {
          id_datageneral: Rendimiento.id_data_general,
          fecha_tanqueo: fechaParaEnviar,
          origen: origen,
          destino: destino,
          carga: carga,
          peso: peso,
          km_recorrido: diferenciaKilometraje,
          rend_kmxglp: rendimientokmxgalon,
          gl_esperado: rendimientoCalculado,
          ren_esperado: rendimientoEsperado,
          exceso_real: excesoReal,
        };
        console.log("enviar:", data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.patch(url, data, { headers }), {
          loading: "Actualizando...",
          success: "Rendimiento Actualizando",
          error: "Error al Actualizar Rendimiento! Verifique los campos",
        });

        //     Actualizar el estado de la data general
        const dataGeneralUpdateUrl = `${API_BASE_URL}/DataGeneral/${Rendimiento.id_data_general}/`;
        const dataGeneralUpdateData = {
          estado_rendimiento: estado, // Cambiar el estado a true
        };

        // Enviar la solicitud para actualizar la data general
        await axios.patch(dataGeneralUpdateUrl, dataGeneralUpdateData, {
          headers,
        });
      }

      // Luego de editar el usuario, llama a la función de actualización
      updateRendimiento();
      onClose();
      handlelimpiar();
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  const handlelimpiar = () => {
    setFechaCreacion(new Date()); // Restablecer la fecha de creación
    setError(false); // Restablecer el estado de error a falso
    onClose(); // Cerrar el modal
  };

  const handleFechaCreacionChange = (event) => {
    const nuevaFecha = event.target.value;

    // Actualizar el estado con la nueva fecha
    setFechaCreacion(new Date(nuevaFecha));
  };

  // Función para calcular la diferencia de kilometraje
  // const calcularDiferenciaKilometraje = () => {
  //   const diferencia =
  //     selectedDataGeneralId2.kilometraje - selectedDataGeneralId.kilometraje;
  //   // const rendimiento = diferencia / selectedDataGeneralId.galones;
  //   setDiferenciaKilometraje(diferencia.toFixed(1));
  //   // setRendimientoxgalon(rendimiento.toFixed(2));
  // };
  const calcularValores = () => {
    const rendimiento = diferenciaKilometraje / Rendimiento.galones;
    setRendimientoxgalon(rendimiento.toFixed(2));
  };

  // Función para manejar cambios en el campo "Rendimiento esperado"
  const handleRendimientoEsperadoChange = (e) => {
    const value = e.target.value;
    setRendimientoEsperado(value);
  };

  // Función para calcular el rendimiento esperado
  const calcularRendimientoEsperado = () => {
    if (rendimientoEsperado && diferenciaKilometraje !== null) {
      const division = diferenciaKilometraje / parseFloat(rendimientoEsperado);
      const exceso = Rendimiento.galones - division;
      setRendimientoCalculado(division.toFixed(2));
      setExcesoReal(exceso.toFixed(2));
    } else {
      setRendimientoCalculado(null);
      setExcesoReal(null);
    }
  };

  useEffect(() => {
    // Configurar el estado inicial al abrir el modal
    if (type === "edit" && Rendimiento) {
      setFechaCreacion(new Date(Rendimiento.fecha_rendimiento));
      setEstate(Rendimiento.estado_rendimiento);
      setOrigen(Rendimiento.origen);
      setDestino(Rendimiento.destino);
      setCarga(Rendimiento.carga);
      setPeso(Rendimiento.peso);
      setDiferenciaKilometraje(Rendimiento.km_recorrido);
      setExcesoReal(Rendimiento.exceso_real);
      setRendimientoCalculado(Rendimiento.gl_esperado),
        setRendimientoxgalon(Rendimiento.rend_kmxglp);
      setRendimientoEsperado(Rendimiento.ren_esperado);
    }
  }, [type, Rendimiento]);

  return (
    <>
      {type === "edit" ? (
        <Tooltip content="Editar Rendimiento">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => onOpen()}
          >
            <PencilSquareIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "edit"
                  ? "Editar Rendimineto"
                  : "Agregar Data general"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative grid grid-cols-1 md:grid-cols-2 gap-1">
                  <span> ID: {Rendimiento.id}</span>
                  <span> Camion: {Rendimiento.placa_nombre}</span>
                  <span>
                    {" "}
                    conductor: {Rendimiento.conductor_nombre}{" "}
                    {Rendimiento.conductor_apellido}
                  </span>
                  <Input
                    type="date"
                    value={fechaCreacion.toISOString().split("T")[0]} // Establecer el valor del Input con la fecha actual
                    onChange={handleFechaCreacionChange} // Manejar el cambio en la fecha
                  />

                  <Input
                    label="Origen"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el Origen correctamente"}
                    value={origen}
                    onChange={(e) => handleNameChange(e, setOrigen)}
                  ></Input>
                  <Input
                    label="Destino"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el Destino correctamente"}
                    value={destino}
                    onChange={(e) => handleNameChange(e, setDestino)}
                  ></Input>
                  <Input
                    label="Carga"
                    isInvalid={error}
                    errorMessage={error && "Ingrese la carga correctamente"}
                    value={carga}
                    onChange={(e) => handleNameChange(e, setCarga)}
                    className="mb-2"
                  />
                  <Input
                    label="Peso"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el peso correctamente"}
                    value={peso}
                    onChange={(e) => handleNameChange(e, setPeso)}
                    className="mb-2"
                  />
                  <Switch defaultSelected={estado} onValueChange={setEstate}>
                    Estado
                  </Switch>
                </div>
                <Accordion variant="light">
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Datos rendimiento"
                  >
                    <div className="flex relative grid grid-cols-1 md:grid-cols-2  gap-1 ">
                      {/* <Button
                        color="success"
                        onClick={calcularDiferenciaKilometraje}
                        className="mb-2"
                      >
                        Calcular Diferencia Kilometraje
                      </Button> */}
                      <Input
                        type="text"
                        label="KM-Recorridos"
                        value={diferenciaKilometraje}
                        onChange={(e) =>
                          handleNameChange(e, setDiferenciaKilometraje)
                        }
                        className="mb-2"
                      />
                      <Button
                        color="success"
                        onClick={calcularValores}
                        className="mb-2"
                      >
                        Calcular valor km x gl
                      </Button>
                      <Input
                        isDisabled
                        type="text"
                        label="Rendimiento KM x GL"
                        value={rendimientokmxgalon}
                      />
                      <Button
                        color="success"
                        onClick={calcularRendimientoEsperado}
                        className="mb-2"
                      >
                        Calcular rendimiento
                      </Button>
                      <Input
                        label="Rendimiento esperado"
                        value={rendimientoEsperado}
                        onChange={handleRendimientoEsperadoChange}
                        className="mb-2"
                      />
                      {/* Mostrar el rendimiento calculado */}
                      {rendimientoCalculado !== null && (
                        <p className="mb-2">
                          GL esperado: {rendimientoCalculado}
                        </p>
                      )}
                      <Input
                        isDisabled
                        type="text"
                        label="Exceso Real"
                        value={
                          excesoReal !== null ? excesoReal : "Calculando..."
                        }
                        className={
                          excesoReal !== null
                            ? excesoReal > 0
                              ? "text-red-500"
                              : "text-blue-500"
                            : ""
                        }
                      />
                    </div>
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onClick={() => handlelimpiar()}
                >
                  Cancelar
                </Button>

                <Button color="success" onClick={handleSubmit}>
                  Guardar
                </Button>
                <Toaster />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
