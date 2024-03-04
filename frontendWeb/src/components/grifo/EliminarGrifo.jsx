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
} from "@nextui-org/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";

export default function EliminarGrifo({
  Grifo,
  type = "eliminar",
  updateGrifo,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleDelete = async (Grifoid, onClose) => {
    try {
      const url = `${API_BASE_URL}/Grifo/${Grifoid}/`;

      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const accessToken = tokens?.access;

      // Realizar la solicitud de eliminación con el token en el encabezado
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Actualizar la lista después de la eliminación
      updateGrifo();

      // Cerrar el modal
      onClose();
      toast.success("Grifo eliminado exitosamente");
    } catch (error) {
      // Manejar errores
      console.error("Error al eliminar Grifo:", error.message);
      toast.error("Error al eliminar Grifo");
    }
  };

  const handleOpen = (onOpen) => {
    onOpen();
  };

  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar Grifo">
          <Button
            className="bg-transparent"
            startContent={<TrashIcon className="w-6 -m-1 text-default-750" />}
            size="sm"
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Eliminar grifo">
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
                Eliminar grifo
              </ModalHeader>
              <ModalBody>
                <p>Estas seguro de eliminar el grifo: {Grifo.nombre}?</p>
              </ModalBody>
              <ModalFooter>
                <Button olor="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="success"
                  onPress={() => handleDelete(Grifo.id, onClose)}
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
