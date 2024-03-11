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
import { EyeFilledIcon } from "../../assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../assets/EyeSlashFilledIcon";
import { API_BASE_URL } from "../../axiosconf";

export default function AgregarUsuario({ type = "agregar", updateUsuarios }) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
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
    value = value.replace(/[^a-zA-Z0-9ñÑ]+/g, " ");

    if (value.length > 50) {
      value = value.substring(0, 50);
    }

    fieldSetter(value);
  };

  const handleSubmit = async () => {
    // Validar campos
    const isUsernameValid = validateField(username, "username");
    const isFirstnameValid = validateField(firstname, "nombre");
    const isLastnameValid = validateField(lastname, "apellido");
    const isPasswordValid = validateField(password, "contraseña");

    // Verificar si algún campo no es válido
    if (
      !isUsernameValid ||
      !isFirstnameValid ||
      !isLastnameValid ||
      !isPasswordValid
    ) {
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

        const url = `${API_BASE_URL}/usuarios/`;

        const data = {
          username: username,
          password: password,
          is_active: estado,
          is_superuser: superuser,
          is_staff: true,
          first_name: firstname,
          last_name: lastname,
        };

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.post(url, data, { headers }), {
          loading: "Registrando...",
          success: "Usuario Registrado",
          error: "Error al registrar Usuario! Verifique los campos",
        });
      }
      // Luego de editar el usuario, llama a la función de actualización
      updateUsuarios();
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
    setSuperuser(false);
    setStaff(false);
    setError(false);
    setUsername("");
    setFirstname("");
    setLastname("");
    setPassword("");

    onClose();
  };

  return (
    <>
      {type === "agregar" ? (
        <Tooltip content="Agregar Usuario">
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
        <Tooltip content="Editar usuario"></Tooltip>
      )}

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "agregar" ? "Agregar usuario" : "Editar usuario"}
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
