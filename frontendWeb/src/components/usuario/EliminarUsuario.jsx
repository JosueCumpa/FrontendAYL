import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../axiosconf";

export default function EliminarUsuario({
  usuario,
  type = "eliminar",
  updateUsuarios,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = async (userId, onClose) => {
    try {
      const url = `${API_BASE_URL}/usuarios/${userId}/`;

      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const accessToken = tokens?.access;

      // Realizar la solicitud de eliminación con el token en el encabezado
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Actualizar la lista después de la eliminación
      updateUsuarios();

      // Cerrar el modal
      onClose();
      toast.success("Usuario eliminado exitosamente");
    } catch (error) {
      // Manejar errores
      console.error("Error al eliminar usuario:", error.message);
      toast.error("Error al eliminar usuario");
    }
  };

  const handleOpen = (onOpen) => {
    onOpen();
  };

  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar tarea">
          <Button
            className="bg-transparent"
            startContent={<TrashIcon className="w-6 -m-1 text-default-750" />}
            size="sm"
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Eliminar Usuario">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => handleOpen(onOpen)}
          >
            <TrashIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar Usuario
              </ModalHeader>
              <ModalBody>
                <p>Estas seguro de eliminar al Usuario: {usuario.username}?</p>
              </ModalBody>
              <ModalFooter>
                <Button olor="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="success"
                  onPress={() => handleDelete(usuario.id, onClose)}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
        <Toaster />
      </Modal>
    </>
  );
}
