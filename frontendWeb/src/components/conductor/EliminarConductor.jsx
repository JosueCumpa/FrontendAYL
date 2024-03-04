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

export default function EliminarConductor({
  Conductor,
  type = "eliminar",
  updateConductor,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleDelete = async (Conductorid, onClose) => {
    try {
      const url = `${API_BASE_URL}/Conductor/${Conductorid}/`;

      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const accessToken = tokens?.access;

      // Realizar la solicitud de eliminación con el token en el encabezado
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Actualizar la lista después de la eliminación
      updateConductor();

      // Cerrar el modal
      onClose();
      toast.success("Conductor eliminado exitosamente");
    } catch (error) {
      // Manejar errores
      console.error("Error al eliminar Conductor:", error.message);
      toast.error("Error al eliminar Conductor");
    }
  };

  const handleOpen = (onOpen) => {
    onOpen();
  };

  return (
    <>
      {type === "add" ? (
        <Tooltip content="Agregar Conductor">
          <Button
            className="bg-transparent"
            startContent={<TrashIcon className="w-6 -m-1 text-default-750" />}
            size="sm"
          >
            Agregar
          </Button>
        </Tooltip>
      ) : (
        <Tooltip content="Eliminar Conductor">
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
                Eliminar Conductor
              </ModalHeader>
              <ModalBody>
                <p>
                  Estas seguro de eliminar el Conductor: {Conductor.nombre}{" "}
                  {Conductor.apellido}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button olor="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="success"
                  onPress={() => handleDelete(Producto.id, onClose)}
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
