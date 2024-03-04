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
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";

export default function EditarCamiones({
  Camion,
  type = "edit",
  updateCamiones,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [placa, setPlaca] = useState("");
  const [estado, setEstado] = useState(false);
  const [conductores, setConductores] = useState([]);
  const [selectedConductor, setSelectedConductor] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Llenar la lista de conductores al cargar el componente
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

  useEffect(() => {
    // Configurar el estado inicial al abrir el modal
    if (type === "edit" && Camion) {
      setPlaca(Camion.placa);
      setEstado(Camion.estado);
      setSelectedConductor({
        id: conductores.id,
        nombre: conductores.nombre,
        apellido: conductores.apellido,
      });
    }
  }, [type, Camion]);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-]+/g, " ");
    if (value.length > 7) {
      value = value.substring(0, 8);
    }
    fieldSetter(value);
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

  const handleSubmit = async () => {
    // Validar campos
    const isPlacaValid = validateField(placa, "placa");

    if (!isPlacaValid) {
      return;
    }

    try {
      if (type === "edit") {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const headers = {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/Camion/${Camion?.id}/`;
        const data = {
          placa: placa,
          estado: estado,
          conductor_id: selectedConductor.id,
        };
        console.log(data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.patch(url, data, { headers }), {
          loading: "Actualizando...",
          success: "Camion actualizado",
          error: "Error al actualizar Camion! Verifique los campos",
        });
      }

      // Luego de editar el camion, llama a la función de actualización
      updateCamiones();
      onClose();
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  const handleClose = () => {
    setEstado(false);
    setPlaca("");
    const handleConductorChange = (event) => {
      const selectedConductorId = event.target.value;

      // Busca el conductor seleccionado en la lista de conductores
      const selectedConductor = conductores.find(
        (conductor) => conductor.id === parseInt(selectedConductorId)
      );

      // Actualiza el estado con el conductor seleccionado
      setSelectedConductor(selectedConductor);
    };
    setSelectedConductor(null);
    onClose();
  };

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
      {type === "edit" ? (
        <Tooltip content="Editar Camion">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => onOpen()}
          >
            <PencilSquareIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "edit" ? "Editar Camion" : "Agregar Camion"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative flex-col gap-4">
                  <Input
                    label="Placa"
                    isInvalid={error}
                    errorMessage={error && "Ingrese la placa correctamente"}
                    value={placa}
                    onChange={(e) => handleNameChange(e, setPlaca)}
                  />
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
                  <Switch defaultSelected={estado} onValueChange={setEstado}>
                    Estado
                  </Switch>
                </div>
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
