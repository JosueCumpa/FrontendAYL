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
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../axiosconf";

export default function AgregarCiudad({ type = "agregar", updateCiudades }) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [estado, setEstado] = useState(false);
  const [error, setError] = useState(false);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;

    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9]+/g, " ");

    if (value.length > 150) {
      value = value.substring(0, 150);
    }

    fieldSetter(value);
  };

  const handleSubmit = async () => {
    // Validar campos
    const isFirstnameValid = validateField(nombre, "nombre");

    // Verificar si algún campo no es válido
    if (!isFirstnameValid) {
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

        const url = `${API_BASE_URL}/ciudad/`;

        const data = {
          nombre: nombre,
          estado: estado,
        };

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.post(url, data, { headers }), {
          loading: "Registrando...",
          success: "Ciudad Registrado",
          error: "Error al registrar Ciudad! Verifique los campos",
        });
      }
      // Luego de editar el usuario, llama a la función de actualización
      updateCiudades();
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

  const handlelimpiar = (onClose) => {
    setEstado(false);
    setError(false);
    setNombre("");
    onClose();
  };

  return (
    <>
      {type === "agregar" ? (
        <Tooltip content="Agregar ciudad">
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
        <Tooltip content="Editar Banco"></Tooltip>
      )}

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "agregar" ? "Agregar Banco" : "Editar Banco"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative flex-col gap-4">
                  <Input
                    label="Nombre"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el nombre correctamente"}
                    value={nombre}
                    onChange={(e) => handleNameChange(e, setNombre)}
                  ></Input>

                  <Switch defaultSelected={estado} onValueChange={setEstado}>
                    Estado
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onClick={onClose}>
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
