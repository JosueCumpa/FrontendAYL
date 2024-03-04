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
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../axiosconf";

export default function AgregarCamiones({ type = "agregar", updateCamion }) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [placa, setPlaca] = useState("");
  const [estado, setEstado] = useState(false);
  const [conductores, setConductores] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState(null);
  const [error, setError] = useState(false);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-]+/g, " ");
    if (value.length > 7) {
      value = value.substring(0, 8);
    }
    fieldSetter(value);
  };

  const handleSubmit = async () => {
    // Validar campos
    const isnombreValid = validateField(placa, "placa");

    // Verificar si algún campo no es válido
    if (!isnombreValid) {
      return;
    }

    try {
      if (type === "agregar") {
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/Camion/`;

        const data = {
          placa: placa,
          estado: estado,
          conductor_id: selectedConductor.id,
        };
        console.log(data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.post(url, data, { headers }), {
          loading: "Registrando...",
          success: "Camion Registrado",
          error: "Error al registrar Camion! Verifique los campos",
        });
      }

      // Luego de editar el usuario, llama a la función de actualización
      updateCamion();
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
    setEstado(false);
    setPlaca("");
    setSelectedConductor(null); // Reiniciar el conductor seleccionado
    onClose();
  };

  // Lista de conductores
  useEffect(() => {
    const obtenerListaConductores = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/conductores-activos/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        setConductores(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de conductores:", error);
      }
    };

    obtenerListaConductores();
  }, []);

  const handleConductorChange = (event) => {
    const selectedConductorId = event.target.value;

    // Busca el conductor seleccionado en la lista de conductores
    const selectedConductor = conductores.find(
      (conductor) => conductor.id === parseInt(selectedConductorId)
    );

    // Actualiza el estado con el conductor seleccionado
    setSelectedConductor(selectedConductor);
  };
  return (
    <>
      {type === "agregar" ? (
        <Tooltip content="Agregar Camion">
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
        <Tooltip content="Editar Camion"></Tooltip>
      )}

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "agregar" ? "Agregar Camion" : "Editar Camion"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative flex-col gap-4">
                  <Input
                    label="placa"
                    isInvalid={error}
                    errorMessage={error && "Ingrese la placa correctamente"}
                    value={placa}
                    onChange={(e) => handleNameChange(e, setPlaca)}
                  ></Input>
                  <div>
                    <Select
                      items={conductores}
                      label="Selecciona un conductor"
                      variant="bordered"
                      onChange={handleConductorChange}
                    >
                      {(conductor) => (
                        <SelectItem
                          key={conductor.id}
                          textValue={`${conductor.nombre} ${conductor.apellido}`}
                        >
                          <div className="flex gap-2 items-center">
                            <span>{conductor.nombre}</span>
                            <span>{conductor.apellido}</span>
                          </div>
                        </SelectItem>
                      )}
                    </Select>

                    {/* Muestra información sobre el conductor seleccionado */}
                    {selectedConductor && (
                      <div>
                        <h3>Conductor Seleccionado:</h3>
                        <p>ID: {selectedConductor.id}</p>
                        <p>Nombre: {selectedConductor.nombre}</p>
                        <p>Apellido: {selectedConductor.apellido}</p>
                        <p>
                          estado:{" "}
                          {selectedConductor.estado ? "verdadero" : "falso"}
                        </p>
                        {/* Añade más propiedades según la estructura de tu modelo de conductor */}
                      </div>
                    )}
                  </div>

                  <Switch defaultSelected={estado} onValueChange={setEstado}>
                    Estado
                  </Switch>
                </div>
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
