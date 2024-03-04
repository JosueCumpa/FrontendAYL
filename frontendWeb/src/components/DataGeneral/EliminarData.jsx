import React from 'react';
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
} from '@nextui-org/react';
import { format } from 'date-fns';
import { TrashIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../../axiosconf'
export default function EliminarData({DataGeneral, type = 'eliminar', updateDataGeneral}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const handleDelete = async (DataGeneralid, onClose) => {
        try {
            const url = `${API_BASE_URL}/DataGeneral/${DataGeneralid}/`;


            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const accessToken = tokens?.access;

            // Realizar la solicitud de eliminación con el token en el encabezado
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Actualizar la lista después de la eliminación
            updateDataGeneral();

            // Cerrar el modal
            onClose();
            toast.success("Data General eliminado exitosamente");
        } catch (error) {
            // Manejar errores
            console.error('Error al eliminar Data General:', error.message);
            toast.error("Error al eliminar Data General");
        }
    };



    const handleOpen = (onOpen) => {
        onOpen();
    };
  return (
    <>
            {type === "add" ? (
                <Tooltip content="Agregar Data General">
                    <Button
                        className="bg-transparent"
                        startContent={<TrashIcon className="w-6 -m-1 text-default-750" />}
                        size="sm"
                    >
                        Agregar
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip content="Eliminar Data General">
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
                                Eliminar Data General
                            </ModalHeader>
                            <ModalBody>
                                <p>Estas seguro de eliminar la Data General: {DataGeneral.fecha_creacion && format(new Date(DataGeneral?.fecha_creacion), 'dd-MM-yyyy')} {DataGeneral.placa_nombre}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button olor="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="success"
                                    onPress={() => handleDelete(DataGeneral.id, onClose)}
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
  )
}
