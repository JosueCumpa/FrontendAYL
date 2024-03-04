import React from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
  Textarea,
  Switch,
} from "@nextui-org/react";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";

export default function EditarProducto({
  Producto,
  type = "edit",
  updateProducto,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nombre, setNombre] = useState("");
  const [estado, setEstate] = useState(false);
  const [error, setError] = useState(false);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-]+/g, " ");
    if (value.length > 150) {
      value = value.substring(0, 150);
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

  const handleSubmit = async (onClose) => {
    // Validar campos
    const isnombreValid = validateField(nombre, "nombre");

    if (!isnombreValid) {
      return;
    } else {
      // Configurar el encabezado con el token de acceso
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const accessToken = tokens?.access;

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      try {
        if (type === "edit") {
          const url = `${API_BASE_URL}/Producto/${Producto?.id}/`;

          const data = {
            nombre: nombre,
            estado: estado,
          };

          // Agregar el encabezado a la solicitud
          await toast.promise(axios.patch(url, data, { headers }), {
            loading: "Actualizando...",
            success: "Producto actualizado",
            error: "Error al actualizar el Producto! Verifique los campos",
          });
        }
        // Luego de editar el usuario, llama a la función de actualización
        updateProducto();
        onClose();
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    }
  };

  const handleClose = (onClose) => {
    setNombre("");
    setEstate(false);
    onClose();
  };

  const handleOpen = (onOpen) => {
    if (type == "edit") {
      setEstate(Producto.estado);
      setNombre(Producto.nombre);
    }

    onOpen();
  };
  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar Producto">
          <Button
            className="bg-transparent"
            startContent={
              <PlusCircleIcon className="w-6 -m-1 text-default-750" />
            }
            size="sm"
            onPress={() => handleOpen(onOpen)}
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Editar Producto">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => handleOpen(onOpen)}
          >
            <PencilSquareIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "add" ? "Agregar Producto" : "Editar Producto"}
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

                  <Switch defaultSelected={estado} onValueChange={setEstate}>
                    Estado
                  </Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => handleClose(onClose)}
                >
                  Cancelar
                </Button>

                <Button color="success" onClick={() => handleSubmit(onClose)}>
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
