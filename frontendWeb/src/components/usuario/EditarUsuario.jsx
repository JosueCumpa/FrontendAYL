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
} from "@nextui-org/react";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { EyeFilledIcon } from "../../assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../assets/EyeSlashFilledIcon";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";

export default function EditarUsuario({
  usuario,
  type = "edit",
  updateUsuarios,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState(false);
  const [superuser, setSuperuser] = useState(false);
  const [staff, setStaff] = useState(false);
  const [error, setError] = useState(false);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;

    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9]+/g, " ");

    if (value.length > 50) {
      value = value.substring(0, 50);
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
    const isUsernameValid = validateField(username, "username");
    const isFirstnameValid = validateField(firstname, "nombre");
    const isLastnameValid = validateField(lastname, "apellido");

    if (!isUsernameValid || !isFirstnameValid || !isLastnameValid) {
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
          const url = `${API_BASE_URL}/usuarios/${usuario?.id}/`;

          if (password.trim() === "") {
            const data = {
              username: username,
              is_active: estado,
              is_superuser: superuser,
              is_staff: true,
              first_name: firstname,
              last_name: lastname,
            };

            // Agregar el encabezado a la solicitud
            await toast.promise(axios.patch(url, data, { headers }), {
              loading: "Actualizando...",
              success: "Usuario actualizado",
              error: "Error al actualizar Usuario! Verifique los campos",
            });
          } else {
            const data = {
              username: username,
              password: password,
              is_active: estado,
              first_name: firstname,
              is_superuser: superuser,
              is_staff: staff,
              last_name: lastname,
            };

            // Agregar el encabezado a la solicitud
            await toast.promise(axios.patch(url, data, { headers }), {
              loading: "Actualizando...",
              success: "Usuario actualizado",
              error: "Error al actualizar Usuario! Verifique los campos",
            });
          }
        }
        // Luego de editar el usuario, llama a la función de actualización
        updateUsuarios();
        onClose();
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      }
    }
  };

  const handleClose = (onClose) => {
    setError(false);
    setUsername("");
    setFirstname("");
    setLastname("");
    setPassword("");
    setEstado(false);
    setStaff(false);
    setSuperuser(false);
    onClose();
  };

  const handleOpen = (onOpen) => {
    if (type === "edit") {
      setEstado(usuario.is_active);
      setStaff(usuario.is_staff);
      setUsername(usuario.username);
      setFirstname(usuario.first_name);
      setLastname(usuario.last_name);
      setSuperuser(usuario.is_superuser);
    }
    onOpen();
  };

  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar Usuario">
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
        <Tooltip content="Editar usuario">
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
                {type === "add" ? "Agregar usuario" : "Editar usuario"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative flex-col gap-4">
                  <Input
                    label="Nombre"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el nombre correctamente"}
                    value={firstname}
                    onChange={(e) => handleNameChange(e, setFirstname)}
                  ></Input>

                  <Input
                    label="Apellido"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el apellido correctamente"}
                    value={lastname}
                    onChange={(e) => handleNameChange(e, setLastname)}
                  ></Input>

                  <Input
                    label="Usuario"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el usuario correctamente"}
                    value={username}
                    onChange={(e) => handleNameChange(e, setUsername)}
                  ></Input>

                  <Input
                    label="Contraseña"
                    value={password}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-600 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-600 pointer-events-none" />
                        )}
                      </button>
                    }
                    errorMessage={
                      error && "Ingrese la contraseña correctamente"
                    }
                    type={isVisible ? "text" : "password"}
                    onChange={(e) => handleNameChange(e, setPassword)}
                  />

                  <Switch defaultSelected={estado} onValueChange={setEstado}>
                    Estado
                  </Switch>
                  <Switch
                    defaultSelected={superuser}
                    onValueChange={setSuperuser}
                  >
                    Administrador
                  </Switch>
                  {/* <Switch defaultSelected={staff} onValueChange={setStaff}>
                                        Operario || Calidad
                                    </Switch> */}
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
