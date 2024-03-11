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
  const [productos, setProductos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [selectedCiudad2, setSelectedCiudad2] = useState(null);
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

  useEffect(() => {
    const obtenerListaCiudades = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/ciudad/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setCiudades(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de ciudades:", error);
      }
    };
    obtenerListaCiudades();
  }, []);

  const handleCiudadChange = (event) => {
    const selectedCiudadId = event.target.value;

    // Busca el camión seleccionado en la lista de camiones
    const selectedCiudad = ciudades.find(
      (ciudad) => ciudad.id === parseInt(selectedCiudadId)
    );

    // Actualiza el estado con el camión seleccionado
    setSelectedCiudad(selectedCiudad);
    setOrigen(selectedCiudad.nombre);
  };

  const handleCiudadChange2 = (event) => {
    const selectedCiudadId = event.target.value;

    // Busca el camión seleccionado en la lista de camiones
    const selectedCiudad2 = ciudades.find(
      (ciudad) => ciudad.id === parseInt(selectedCiudadId)
    );

    // Actualiza el estado con el camión seleccionado
    setSelectedCiudad2(selectedCiudad2);
    setDestino(selectedCiudad2.nombre);
  };

  // useEffect para cargar la lista de Productos
  useEffect(() => {
    const obtenerListaProductos = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/Producto/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setProductos(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
      }
    };

    obtenerListaProductos();
  }, []);

  const handleProductosChange = (event) => {
    const selectedProductoId = event.target.value;

    // Busca el camión seleccionado en la lista de camiones
    const selectedProducto = productos.find(
      (producto) => producto.id === parseInt(selectedProductoId)
    );

    // Actualiza el estado con el camión seleccionado
    setSelectedProducto(selectedProducto);
    setCarga(selectedProducto.nombre);
    if (selectedProducto.nombre === "VACIO") {
      // Si el nombre del producto está vacío, establece setPeso como 0
      setPeso("0");
    } else {
      // De lo contrario, deja que el usuario ingrese un valor
      setPeso("");
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
    setFechaCreacion(new Date());
    setRendimientoEsperado("");
    setRendimientoCalculado(null);
    setCarga("");
    setOrigen("");
    setDestino("");

    setPeso("");
    setSelectedDataGeneralId(null); // Aquí debes establecer el valor de selectedDataGeneralId como null
    setDiferenciaKilometraje("");
    setMaxKilometraje("");
    setExcesoReal(null);
    setError(false);
    onClose(); // Cerrar el modal // Cerrar el modal
  };

  const handleFechaCreacionChange = (event) => {
    const selectedDate = new Date(event.target.value);
    // Ajustar la fecha según la zona horaria local
    const adjustedDate = new Date(
      selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60000
    );
    setFechaCreacion(adjustedDate);
  };

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
      setCarga(Rendimiento.carga);
      setOrigen(Rendimiento.origen);
      setDestino(Rendimiento.destino);
      setPeso(Rendimiento.peso);
      setDiferenciaKilometraje(Rendimiento.km_recorrido);
      setExcesoReal(Rendimiento.exceso_real);
      setRendimientoCalculado(Rendimiento.gl_esperado);
      setRendimientoxgalon(Rendimiento.rend_kmxglp);
      setRendimientoEsperado(Rendimiento.ren_esperado);
      console.log(selectedCiudad);
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

                  <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
                    <Select
                      items={ciudades}
                      label="Selecciona ciudad de origen"
                      variant="bordered"
                      onChange={handleCiudadChange}
                    >
                      {(ciudad) => (
                        <SelectItem
                          key={ciudad.id}
                          textValue={`${ciudad.nombre}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{ciudad.nombre}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                    <span>Ciudad seleccionada: {origen}</span>
                  </div>
                  <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
                    <Select
                      items={ciudades}
                      label="Selecciona ciudad de Destino"
                      variant="bordered"
                      onChange={handleCiudadChange2}
                    >
                      {(ciudad) => (
                        <SelectItem
                          key={ciudad.id}
                          textValue={`${ciudad.nombre}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{ciudad.nombre}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                    <span>Ciudad seleccionada: {destino}</span>
                  </div>
                  {/* <Input
                label="Destino"
                isInvalid={error}
                errorMessage={error && "Ingrese el Destino correctamente"}
                value={destino}
                onChange={(e) => handleNameChange(e, setDestino)}
              ></Input> */}
                  {/* <Input
                label="Carga"
                isInvalid={error}
                errorMessage={error && "Ingrese la carga correctamente"}
                value={carga}
                onChange={(e) => handleNameChange(e, setCarga)}
                className="mb-2"
              /> */}
                  <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
                    <Select
                      items={productos}
                      label="Selecciona carga"
                      variant="bordered"
                      onChange={handleProductosChange}
                    >
                      {(producto) => (
                        <SelectItem
                          key={producto.id}
                          textValue={`${producto.nombre}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{producto.nombre}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                    <span>Producto seleccionado: {carga}</span>
                  </div>
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
