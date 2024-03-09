import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Textarea,
  Tooltip,
  useDisclosure,
  Select,
  SelectItem,
  Accordion,
  AccordionItem,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../axiosconf";
// import { set } from "date-fns";

export default function AgregarData({ type = "agregar", updateDataGeneral }) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [placa, setPlaca] = useState("");
  const [estate, setEstate] = useState("");
  const [estado, setEstado] = useState("P");
  // const [detalle, setDetalle] = useState("");
  const [operacion, setOperacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [galones, setGalones] = useState("");
  const [documento, setDocumento] = useState("");
  const [precio, setPrecio] = useState("");
  const [total, setTotal] = useState("");
  const [Kilometraje, setKilometraje] = useState("");
  // const [origen, setOrigen] = useState("");
  // const [carga, setCarga] = useState("");
  // const [peso, setPeso] = useState("");
  // const [destino, setDestino] = useState("");
  const [selectedCamion, setSelectedCamion] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedGrifo, setSelectedGrifo] = useState(null);
  const [selectedBanco, setSelectedBanco] = useState(null);
  const [camiones, setCamiones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [grifos, setGrifos] = useState([]);
  const [operacionCompleta, setOperacionCompleta] = useState("");
  const [banco, setBancos] = useState([]);
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
    console.log(precio);
    setGalones(value);

    // Calcular y actualizar el total
    calcularTotal(value, precio);
  };

  const calcularTotal = (galones, precio) => {
    const totalCalculado = galones * precio;
    setTotal(totalCalculado.toFixed(2)); // Redondear a 2 decimales y actualizar el estado
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

        const url = `${API_BASE_URL}/DataGeneral/`;

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
          estado_rendimiento: false,
          estado_omitir: estate,
          // origen: origen,
          // destino: destino,
          // carga: carga,
          // peso: peso,
        };
        console.log("enviar:", data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.post(url, data, { headers }), {
          loading: "Registrando...",
          success: "Data general Registrado",
          error: "Error al registrar data general! Verifique los campos",
        });
      }
      // Luego de editar el usuario, llama a la función de actualización
      updateDataGeneral();
      onClose();
      handlelimpiar();
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  const validateField = (value, fieldName) => {
    if (value.trim() === "") {
      // Si el campo está vacío, mostrar el mensaje de error
      setError(true);
      toast.error(`Ingrese el ${fieldName} correctamente`);
      return false;
    }
    // Limpiar el mensaje de error si el campo es válido
    setError(false);
    return true;
  };

  const handlelimpiar = () => {
    setPlaca("");
    setSelectedCamion(null); // Reiniciar el camion seleccionado
    setEstado("P"); // Reiniciar el estado a "Pendiente"
    setOperacion(""); // Reiniciar el número de operación
    setDescripcion(""); // Reiniciar la descripción
    setGalones(""); // Reiniciar los galones
    setDocumento(""); // Reiniciar el documento
    setPrecio(""); // Reiniciar el precio
    setTotal(""); // Reiniciar el total
    setKilometraje(""); // Reiniciar el kilometraje
    setSelectedProducto(null); // Reiniciar el producto seleccionado
    setSelectedGrifo(null); // Reiniciar el grifo seleccionado
    setSelectedBanco(null); // Reiniciar el banco seleccionado
    setOperacionCompleta(""); // Reiniciar la operación completa
    setEstate("");
    setFechaCreacion(new Date()); // Restablecer la fecha de creación
    setError(false); // Restablecer el estado de error a falso
    onClose(); // Cerrar el modal
  };

  // Lista de bancos
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
        console.error("Error al obtener la lista de Banco:", error);
      }
    };

    obtenerListaBancos();
  }, []);

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
  // Lista de grifo
  useEffect(() => {
    const obtenerListaGrifos = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/grifo_activos/`, {
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
    setPrecio(selectedGrifo.precio);
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

  const handleBancoChange = (event) => {
    const selectedBancoId = event.target.value;
    const selectedBanco = banco.find(
      (banco) => banco.id === parseInt(selectedBancoId)
    );
    setSelectedBanco(selectedBanco);
    if (operacion) {
      setOperacionCompleta(`${selectedBanco.abreviatura} - ${operacion}`);
    }
  };

  return (
    <>
      {type === "agregar" ? (
        <Tooltip content="Agregar Data general">
          <Button
            style={{ paddingTop: "10px", color: "green" }}
            className="bg-transparent"
            startContent={
              <PlusCircleIcon className="w-6 -m-1 text-default-750" />
            }
            size="sm"
            onPress={onOpen}
            ml="auto"
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Editar data general"></Tooltip>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "agregar"
                  ? "Agregar data general"
                  : "Editar data general"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative grid grid-cols-1 md:grid-cols-2  gap-1">
                  <Input
                    type="date"
                    value={fechaCreacion.toISOString().split("T")[0]} // Establecer el valor del Input con la fecha actual
                    onChange={handleFechaCreacionChange} // Manejar el cambio en la fecha
                  />

                  <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
                    <Select
                      items={camiones}
                      label="Selecciona un camion"
                      variant="bordered"
                      onChange={handleCamionChange}
                    >
                      {(camion) => (
                        <SelectItem
                          key={camion.id}
                          textValue={`${camion.placa} ____ ${camion.nombre_apellido_conductor}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{camion.placa}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>

                    {/* Muestra información sobre el conductor seleccionado */}
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
                          textValue={`${grifo.nombre} ___ S/. ${grifo.precio}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{grifo.nombre}</span>
                            <span>S/. {grifo.precio}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="flex relative grid grid-cols-1 md:grid-cols-1  gap-1 ">
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
                        items={banco}
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
