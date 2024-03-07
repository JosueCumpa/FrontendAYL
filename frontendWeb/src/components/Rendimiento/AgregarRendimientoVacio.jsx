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
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function AgregarRendimientoVacio({
  type = "agregar",
  updateRendimiento,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCamion, setSelectedCamion] = useState(null);
  const [origen, setOrigen] = useState("");
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

  const handleDataGeneralChange = (event) => {
    const selectedDataGeneralId = event.target.value;

    // Busca la data general seleccionada en la lista de data general
    const selectedDatageneral = dataGeneral.find(
      (datageneral) => datageneral.id === parseInt(selectedDataGeneralId)
    );

    setSelectedDataGeneralId(selectedDatageneral);
    console.log(selectedDataGeneralId);
  };

  const handleDataGeneralChange2 = (event) => {
    const selectedDataGeneralId2 = event.target.value;

    // Busca la data general seleccionada en la lista de data general
    const selectedDatageneral = dataGeneral.find(
      (datageneral) => datageneral.id === parseInt(selectedDataGeneralId2)
    );

    setSelectedDataGeneralId2(selectedDatageneral);
    console.log(selectedDataGeneralId2);
  };

  // Función para buscar la data general asociada al camión seleccionado
  const handleBuscarDataGeneral = async () => {
    if (selectedCamion) {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(
          `${API_BASE_URL}/listado_datapendiente/?placa=${selectedCamion.placa}`,
          {
            headers: {
              Authorization: `Bearer ${tokens.access}`,
            },
          }
        );
        setDataGeneral(res.data);
      } catch (error) {
        console.error(
          "Error al obtener la lista de Data General pendiente:",
          error
        );
      }
    }
  };

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-.]+/g, " ");
    if (value.length > 100) {
      value = value.substring(0, 100);
    }
    fieldSetter(value);
  };

  // useEffect para cargar la lista de camiones
  useEffect(() => {
    const obtenerListaCamiones = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/listado_camion/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setCamiones(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de camiones:", error);
      }
    };

    obtenerListaCamiones();
  }, []);

  const handleCamionChange = (event) => {
    const selectedCamionId = event.target.value;

    // Busca el camión seleccionado en la lista de camiones
    const selectedCamion = camiones.find(
      (camion) => camion.id === parseInt(selectedCamionId)
    );

    // Actualiza el estado con el camión seleccionado
    setSelectedCamion(selectedCamion);
  };

  const handleSubmit = async () => {
    // Validar campos
    const fechaParaEnviar = new Date(fechaCreacion).toISOString();

    try {
      if (type === "agregar") {
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/Rendimiento/`;

        const data = {
          id_datageneral: selectedDataGeneralId.id,
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
        console.log(selectedDataGeneralId.id);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.post(url, data, { headers }), {
          loading: "Registrando...",
          success: "Rendimiento Registrado",
          error: "Error al registrar Rendimiento! Verifique los campos",
        });

        //     Actualizar el estado de la data general
        const dataGeneralUpdateUrl = `${API_BASE_URL}/DataGeneral/${selectedDataGeneralId.id}/`;
        const dataGeneralUpdateData = {
          estado_rendimiento: true, // Cambiar el estado a true
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

  return (
    <>
      <Tooltip content="Agregar Rendimiento">
        <Button
          style={{ paddingTop: "10px", color: "green" }}
          className="bg-transparent"
          size="sm"
          onPress={onOpen}
          ml="auto"
          startContent={
            <PlusCircleIcon className="w-6 -m-1 text-default-750" />
          }
        >
          Agregar
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {type === "agregar" ? "Agregar Rendimiento" : "Editar data general"}
          </ModalHeader>
          <ModalBody>
            <div className="flex relative grid grid-cols-1 md:grid-cols-2 gap-1">
              <Select
                items={camiones}
                label="Selecciona un camion"
                variant="bordered"
                onChange={handleCamionChange}
              >
                {(camion) => (
                  <SelectItem key={camion.id} textValue={`${camion.placa}`}>
                    <div className="flex gap-2 items-center">
                      <span>{camion.placa}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>

              <Button onClick={handleBuscarDataGeneral}>
                Buscar Data General
              </Button>

              <Select
                items={dataGeneral}
                label="Selecciona un data general 1"
                variant="bordered"
                onChange={handleDataGeneralChange}
              >
                {(datageneral) => (
                  <SelectItem
                    key={datageneral.id}
                    textValue={`${datageneral.id} ___ ${
                      datageneral.placa_nombre
                    } __${
                      datageneral.fecha_creacion &&
                      format(
                        new Date(datageneral?.fecha_creacion),
                        "dd-MM-yyyy"
                      )
                    }_ ${datageneral.conductor_nombre} ${
                      datageneral.conductor_apellido
                    }
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <span>{datageneral.id}</span>
                      <span>{datageneral.placa_nombre}</span>
                      <span>
                        {datageneral.fecha_creacion &&
                          format(
                            new Date(datageneral?.fecha_creacion),
                            "dd-MM-yyyy"
                          )}
                      </span>
                      <span>
                        {datageneral.conductor_nombre}
                        {datageneral.conductor_apellido}
                      </span>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Select
                items={dataGeneral}
                label="Selecciona un data general 2"
                variant="bordered"
                onChange={handleDataGeneralChange2}
              >
                {(datageneral) => (
                  <SelectItem
                    key={datageneral.id}
                    textValue={`${datageneral.id} _ ${
                      datageneral.placa_nombre
                    } _ ${
                      datageneral.fecha_creacion &&
                      format(
                        new Date(datageneral?.fecha_creacion),
                        "dd-MM-yyyy"
                      )
                    }_ ${datageneral.conductor_nombre} ${
                      datageneral.conductor_apellido
                    }
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <span>{datageneral.id}</span>
                      <span>{datageneral.placa_nombre}</span>
                      <span>
                        {datageneral.fecha_creacion &&
                          format(
                            new Date(datageneral?.fecha_creacion),
                            "dd-MM-yyyy"
                          )}
                      </span>
                      <span>
                        {datageneral.conductor_nombre}
                        {datageneral.conductor_apellido}
                      </span>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <span>
                {selectedDataGeneralId && (
                  <>
                    ID: {selectedDataGeneralId.id}, Placa:{" "}
                    {selectedDataGeneralId.placa_nombre},
                    {selectedDataGeneralId.galones}, Fecha de Creación:{" "}
                    {selectedDataGeneralId.fecha_creacion &&
                      format(
                        new Date(selectedDataGeneralId.fecha_creacion),
                        "dd-MM-yyyy"
                      )}
                  </>
                )}
              </span>
              <span>
                {selectedDataGeneralId2 && (
                  <>
                    ID: {selectedDataGeneralId2.id}, Placa:{" "}
                    {selectedDataGeneralId2.placa_nombre},
                    {selectedDataGeneralId2.galones}, Fecha de Creación:{" "}
                    {selectedDataGeneralId2.fecha_creacion &&
                      format(
                        new Date(selectedDataGeneralId2.fecha_creacion),
                        "dd-MM-yyyy"
                      )}
                  </>
                )}
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
            </div>
            <Accordion variant="light">
              <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title="Datos pago"
              >
                <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
                  <p>hola</p>
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
        </ModalContent>
      </Modal>
    </>
  );
}
