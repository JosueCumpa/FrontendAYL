import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tooltip,
  Textarea,
  useDisclosure,
  Select,
  SelectItem,
  Accordion,
  AccordionItem,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";

export default function EditarData({
  DataGeneral,
  type = "edit",
  updateDataGeneral,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [placa, setPlaca] = useState("");
  const [operacion, setOperacion] = useState("");
  const [galones, setGalones] = useState("");
  const [producto, setProducto] = useState("");
  const [conductor, setConductor] = useState("");
  const [estate, setEstate] = useState("");
  const [estado, setEstado] = useState("");
  const [documento, setDocumento] = useState("");
  const [precio, setPrecio] = useState("");
  const [total, setTotal] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [Kilometraje, setKilometraje] = useState("");
  // const [origen, setOrigen] = useState("");
  // const [carga, setCarga] = useState("");
  // const [peso, setPeso] = useState("");
  // const [destino, setDestino] = useState("");
  const [operacionCompleta, setOperacionCompleta] = useState("");
  const [grifo, setGrifo] = useState("");
  const [selectedCamion, setSelectedCamion] = useState(null);
  const [selectedBanco, setSelectedBanco] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [selectedGrifo, setSelectedGrifo] = useState(null);
  const [camiones, setCamiones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [grifos, setGrifos] = useState([]);
  const [Bancos, setBancos] = useState([]);
  const [fechaCreacion, setFechaCreacion] = useState(new Date());
  const [error, setError] = useState(false);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-.]+/g, " ");
    if (value.length > 100) {
      value = value.substring(0, 100);
    }
    fieldSetter(value);
  };

  const handleGalonesChange = (e) => {
    const value = e.target.value;
    setGalones(value);

    // Calcular y actualizar el total
    calcularTotal(value, precio);
  };

  const handlePrecioChange = (e) => {
    const value = e.target.value;
    setPrecio(value);

    // Calcular y actualizar el total
    calcularTotal(galones, value);
  };

  const calcularTotal = (galones, precio) => {
    const totalCalculado = galones * precio;
    setTotal(totalCalculado.toFixed(2)); // Redondear a 2 decimales y actualizar el estado
  };

  const handleSubmit = async () => {
    // Validar campos
    const fechaParaEnviar = new Date(fechaCreacion).toISOString();
    try {
      if (type === "edit") {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const headers = {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/DataGeneral/${DataGeneral?.id}/`;
        const data = {
          fecha_creacion: fechaParaEnviar,
          placa: selectedCamion.id,
          conductor: selectedCamion.conductor_id,
          galones: galones,
          producto: selectedProducto.id,
          documento: documento,
          precio: precio,
          total: total,
          kilometraje: Kilometraje,
          grifo: selectedGrifo.id,
          estado: estado,
          detalle: operacionCompleta,
          observacion: descripcion,
          estado_omitir: estate,
          // origen: origen,
          // destino: destino,
          // carga: carga,
          // peso: peso,
        };
        console.log(data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.patch(url, data, { headers }), {
          loading: "Actualizando...",
          success: "Data General actualizado",
          error: "Error al actualizar Data General! Verifique los campos",
        });
      }

      // Luego de editar el camion, llama a la función de actualización
      updateDataGeneral();
      onClose();
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };
  // Lista de conductores
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
        console.error("Error al obtener la lista de conductores:", error);
      }
    };

    obtenerListaCamiones();
  }, []);

  const handleCamionChange = (event) => {
    const selectedCamionId = event.target.value;

    // Busca el conductor seleccionado en la lista de conductores
    const selectedCamion = camiones.find(
      (camion) => camion.id === parseInt(selectedCamionId)
    );

    // Actualiza el estado con el conductor seleccionado
    setSelectedCamion(selectedCamion);
  };

  const handleFechaCreacionChange = (event) => {
    const nuevaFecha = event.target.value;

    // Actualizar el estado con la nueva fecha
    setFechaCreacion(new Date(nuevaFecha));
  };

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

  const handleProductoChange = (event) => {
    const selectedProductoId = event.target.value;

    // Busca el conductor seleccionado en la lista de conductores
    const selectedProducto = productos.find(
      (producto) => producto.id === parseInt(selectedProductoId)
    );

    // Actualiza el estado con el conductor seleccionado
    setSelectedProducto(selectedProducto);
  };

  // Lista de grifos
  useEffect(() => {
    const obtenerListaGrifos = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/Grifo/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setGrifos(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de grifos:", error);
      }
    };

    obtenerListaGrifos();
  }, []);

  const handleGrifoChange = (event) => {
    const selectedGrifoId = event.target.value;

    // Busca el conductor seleccionado en la lista de conductores
    const selectedGrifo = grifos.find(
      (grifo) => grifo.id === parseInt(selectedGrifoId)
    );

    // Actualiza el estado con el conductor seleccionado
    setSelectedGrifo(selectedGrifo);
  };

  // Lista de Bancos
  useEffect(() => {
    const obtenerListaBancos = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/Banco/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setBancos(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de Bancos:", error);
      }
    };

    obtenerListaBancos();
  }, []);

  useEffect(() => {
    // Configurar el estado inicial al abrir el modal
    if (type === "edit" && DataGeneral) {
      setPlaca(DataGeneral.placa);
      setGalones(DataGeneral.galones);
      setProducto(DataGeneral.producto);
      setConductor(DataGeneral.conductor);
      setDocumento(DataGeneral.documento);
      setPrecio(DataGeneral.precio);
      setTotal(DataGeneral.total);
      setKilometraje(DataGeneral.kilometraje);
      setGrifo(DataGeneral.grifo);
      setDescripcion(DataGeneral.observacion);
      setOperacionCompleta(DataGeneral.detalle);
      setEstado(DataGeneral.estado);
      setEstate(DataGeneral.estado_omitir);
      // setOrigen(DataGeneral.origen);
      // setDestino(DataGeneral.destino);
      // setCarga(DataGeneral.carga);
      // setPeso(DataGeneral.peso);
      // Configurar el conductor seleccionado
      const selectedCamion = camiones.find(
        (camion) => camion.id === DataGeneral.placa
      );
      setSelectedCamion(selectedCamion);

      // Configurar el producto seleccionado
      const selectedProducto = productos.find(
        (producto) => producto.id === DataGeneral.producto
      );
      setSelectedProducto(selectedProducto);

      // Configurar el grifo seleccionado
      const selectedGrifo = grifos.find(
        (grifo) => grifo.id === DataGeneral.grifo
      );
      setSelectedGrifo(selectedGrifo);
    }
  }, [type, DataGeneral, camiones, productos, grifos]);

  const handleClose = () => {
    onClose();
  };

  const handleBancoChange = (event) => {
    const selectedBancoId = event.target.value;
    const selectedBanco = Bancos.find(
      (banco) => banco.id === parseInt(selectedBancoId)
    );
    setSelectedBanco(selectedBanco);
    if (operacion) {
      setOperacionCompleta(`${selectedBanco.abreviatura} - ${operacion}`);
    }
  };

  const handleOperacionChange = (e) => {
    const value = e.target.value;
    setOperacion(value);
    if (selectedBanco) {
      setOperacionCompleta(`${selectedBanco.abreviatura} - ${value}`);
    }
  };

  useEffect(() => {
    if (selectedBanco && operacion) {
      setOperacionCompleta(`${selectedBanco.abreviatura} - ${operacion}`);
    }
  }, [selectedBanco, operacion]);

  // Función de manejo de cambios para el RadioGroup
  const handleEstadoChange = (event) => {
    const selectedEstado = event.target.value;
    console.log("Estado seleccionado:", selectedEstado);
    setEstado(selectedEstado);
  };

  return (
    <>
      {type === "edit" ? (
        <Tooltip content="Editar Data General">
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
                  ? "Editar Data general"
                  : "Agregar Data general"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative grid grid-cols-1 md:grid-cols-2  gap-1">
                  <Input
                    type="date"
                    value={fechaCreacion.toISOString().split("T")[0]} // Establecer el valor del Input con la fecha actual
                    onChange={handleFechaCreacionChange} // Manejar el cambio en la fecha
                  />

                  <div>
                    <Select
                      items={camiones}
                      label="Selecciona un camion"
                      variant="bordered"
                      onChange={handleCamionChange}
                    >
                      {(camion) => (
                        <SelectItem
                          key={camion.id}
                          textValue={`${camion.placa}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{camion.placa}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>

                    {/* Muestra información sobre el conductor seleccionado */}
                    {selectedCamion && (
                      <div>
                        <h3>Camion Seleccionado:</h3>
                        {/* <p>ID: {selectedCamion.id}</p> */}
                        <p>
                          Conductor: {selectedCamion.nombre_apellido_conductor}
                        </p>
                        {/* Añade más propiedades según la estructura de tu modelo de conductor */}
                      </div>
                    )}
                  </div>
                  <div>
                    <Select
                      items={grifos}
                      label="Selecciona un grifo"
                      variant="bordered"
                      onChange={handleGrifoChange}
                    >
                      {(grifo) => (
                        <SelectItem
                          key={grifo.id}
                          textValue={`${grifo.nombre}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{grifo.nombre}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>

                    {/* Muestra información sobre el conductor seleccionado */}
                    {selectedGrifo && (
                      <div>
                        <h3>grifo Seleccionado:</h3>
                        {/* <p>ID: {selectedGrifo.id}</p> */}
                        <p> {selectedGrifo.nombre}</p>
                        {/* Añade más propiedades según la estructura de tu modelo de conductor */}
                      </div>
                    )}
                  </div>
                  <div>
                    <Select
                      items={productos}
                      label="Selecciona un producto"
                      variant="bordered"
                      onChange={handleProductoChange}
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
                    {selectedProducto && (
                      <div>
                        <h3>Producto Seleccionado:</h3>
                        {/* <p>ID: {selectedProducto.id}</p> */}
                        <p> {selectedProducto.nombre}</p>
                        {/* Añade más propiedades según la estructura de tu modelo de conductor */}
                      </div>
                    )}
                  </div>
                  <Input
                    label="documento"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el documento correctamente"}
                    value={documento}
                    onChange={(e) => handleNameChange(e, setDocumento)}
                  ></Input>
                  <Input
                    label="galones"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el galon correctamente"}
                    value={galones}
                    onChange={handleGalonesChange}
                  ></Input>
                  <Input
                    label="precio S/."
                    isInvalid={error}
                    errorMessage={error && "Ingrese el precio correctamente"}
                    value={precio}
                    onChange={handlePrecioChange}
                  ></Input>
                  {/* Campo de total calculado */}
                  <div className="flex gap-2 items-center">
                    <span>Total:</span>
                    <span>{total}</span>
                  </div>
                  <Input
                    label="kilometraje"
                    isInvalid={error}
                    errorMessage={
                      error && "Ingrese el kilometraje correctamente"
                    }
                    value={Kilometraje}
                    onChange={(e) => handleNameChange(e, setKilometraje)}
                  ></Input>
                  {/* <Input
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
                  /> */}
                  <Switch defaultSelected={estate} onValueChange={setEstate}>
                    Omitir
                  </Switch>
                </div>

                <Accordion variant="light">
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Datos pago"
                  >
                    <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
                      <Select
                        items={Bancos}
                        label="Selecciona un Banco"
                        variant="bordered"
                        onChange={handleBancoChange}
                      >
                        {(banco) => (
                          <SelectItem
                            key={banco.id}
                            textValue={`${banco.nombre} : ${banco.abreviatura}`}
                          >
                            <div className="flex gap-2 items-center">
                              <span>{banco.nombre}</span>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                      <Input
                        label="N° operacion"
                        isInvalid={error}
                        errorMessage={
                          error && "Ingrese el N° de operacion correctamente"
                        }
                        value={operacion}
                        onChange={handleOperacionChange}
                      ></Input>

                      <p> Operacion : {operacionCompleta}</p>

                      <RadioGroup
                        label="Selecciona el estado"
                        orientation="horizontal"
                        defaultValue={estado}
                        // Asigna el valor seleccionado al RadioGroup
                        onChange={handleEstadoChange} // Utiliza la función de manejo de cambios
                      >
                        <Radio value="P">Pendiente</Radio>
                        <Radio value="C">Cancelado</Radio>
                        <Radio value="CP">Cancelado Parcialmente</Radio>
                      </RadioGroup>
                      <Textarea
                        label="Descripcion"
                        placeholder="Ingrese sus descripcion"
                        className="w-full"
                        value={descripcion}
                        onChange={(e) => handleNameChange(e, setDescripcion)}
                      />
                    </div>
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => handleClose()}
                >
                  Cancelar
                </Button>
                <Button color="success" onClick={() => handleSubmit()}>
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
