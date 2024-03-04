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
import {
  PencilSquareIcon,
  PlusCircleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";
import { set } from "date-fns";

export default function TaspasoData({
  DataGeneral,
  type = "edit",
  updateDataGeneral,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [placa, setPlaca] = useState("");
  const [placaid, setPlacaid] = useState("");
  const [galones, setGalones] = useState("");
  const [galonesinter, setGalonesInter] = useState("");
  const [galoactual1, setGalonesActual1] = useState("");
  const [galoactual2, setGalonesActual2] = useState("");
  const [producto, setProducto] = useState("");
  const [conductor, setConductor] = useState("");
  const [conductorid, setConductorid] = useState("");
  const [documento, setDocumento] = useState("");
  const [precio, setPrecio] = useState("");
  const [total, setTotal] = useState("");
  const [totalResta, setTotalResta] = useState("");
  const [traspasoid, settraspasoid] = useState("");
  const [MontoTranspaso, setMontoTranspaso] = useState("");
  const [cantidadtraspaso, setcantidadtraspaso] = useState("");
  const [totalSuma, setTotalSuma] = useState("");
  const [Kilometraje, setKilometraje] = useState("");
  const [apellido, setApellido] = useState("");
  const [dataidbuscar, setDataidbuscar] = useState("");
  const [id, setId] = useState("");
  const [busquedaid, setBusquedaId] = useState("");
  const [grifo, setGrifo] = useState("");

  const [data2, setData2] = useState([]);
  const [fechaCreacion, setFechaCreacion] = useState(new Date());
  const [error, setError] = useState(false);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-.]+/g, " ");
    if (value.length > 100) {
      value = value.substring(0, 100);
    }
    fieldSetter(value);
  };

  const listarId = () => {
    const obtenerListaDatouno = async () => {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(
          `${API_BASE_URL}/DataGeneral/${busquedaid}/`,
          {
            headers: {
              Authorization: `Bearer ${tokens.access}`,
            },
          }
        );
        setData2(res.data);
      } catch (error) {
        console.error("Error al obtener la lista de conductores:", error);
      }
    };

    obtenerListaDatouno();
  };
  const calcularTotal = async () => {
    //DATOS PARA ACTUALIZAR AL QUE RESTA

    const nuevaCantidadResta = Number(galones) - Number(galonesinter);
    if (nuevaCantidadResta < 0) {
      // Mostrar un mensaje de error al usuario
      toast.error(
        "La cantidad de galones restantes no puede ser negativa. Por favor ingrese datos válidos."
      );
      // Aquí podrías mostrar un toaster o un mensaje de error en la interfaz de usuario
      return; // Salir de la función ya que los datos no son válidos
    }
    const nuevoTotalresta = nuevaCantidadResta * Number(precio);
    const nuevoCantidadSuma = Number(data2.galones) + Number(galonesinter);
    const nuevoTotalSuma =
      Number(galonesinter) * Number(precio) + Number(data2.total);
    console.log("cantidad galones resta total:" + nuevaCantidadResta);
    console.log("Monto PRECIO ACTUAL :" + precio);
    console.log("Monto resta total:" + nuevoTotalresta.toFixed(2));
    console.log("Cantidad galones Suma total:" + nuevoCantidadSuma);
    console.log(
      "Monto de intercambio:" + Number(galonesinter) * Number(precio)
    );
    console.log("Monto total suma:" + nuevoTotalSuma.toFixed(2));
    setGalonesActual1(nuevaCantidadResta);
    setTotalResta(nuevoTotalresta.toFixed(2));
    setGalonesActual2(nuevoCantidadSuma);
    setTotalSuma(nuevoTotalSuma.toFixed(2));
  };

  const handleSubmit = async () => {
    try {
      if (type === "edit") {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const headers = {
          Authorization: `Bearer ${tokens.access}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/DataGeneral/${DataGeneral?.id}/`;
        const url2 = `${API_BASE_URL}/DataGeneral/${busquedaid}/`;
        const data = {
          fecha_creacion: fechaCreacion,
          placa: placaid,
          conductor: conductorid,
          galones: galoactual1,
          producto: producto,
          documento: documento,
          precio: precio,
          total: totalResta,
          kilometraje: Kilometraje,
          grifo: grifo,
          traspaso_id: traspasoid,
          cantidad_traspaso: cantidadtraspaso,
          Monto_Transpaso: MontoTranspaso,
        };
        console.log(data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.patch(url, data, { headers }), {
          loading: "Actualizando...",
          success: "Data General actualizada 1",
          error: "Error al actualizar Data General! Verifique los campos",
        });

        const dataSu = {
          fecha_creacion: data2.fecha_creacion,
          placa: data2.placa,
          conductor: data2.conductor,
          galones: galoactual2,
          producto: data2.producto,
          documento: data2.documento,
          precio: Number(data2.precio),
          total: totalSuma,
          kilometraje: data2.kilometraje,
          grifo: data2.grifo,
          traspaso_id: id,
          cantidad_traspaso: galonesinter,
          Monto_Transpaso: Number(galonesinter) * Number(precio),
        };
        console.log(dataSu);
        // Agregar el encabezado a la solicitud
        await toast.promise(axios.patch(url2, dataSu, { headers }), {
          loading: "Actualizando...",
          success: "Data General actualizada 2",
          error: "Error al actualizar Data General! Verifique los campos",
        });
      }

      // Luego de editar el camion, llama a la función de actualización
      updateDataGeneral();
      onClose();
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  useEffect(() => {
    // Configurar el estado inicial al abrir el modal
    if (type === "edit" && DataGeneral) {
      setPlaca(DataGeneral.placa_nombre);
      setId(DataGeneral.id);
      setConductorid(DataGeneral.conductor);
      setPlacaid(DataGeneral.placa);
      setGalones(DataGeneral.galones);
      setProducto(DataGeneral.producto);
      setConductor(DataGeneral.conductor_nombre);
      setApellido(DataGeneral.conductor_apellido);
      setDocumento(DataGeneral.documento);
      setPrecio(DataGeneral.precio);
      setTotal(DataGeneral.total);
      setKilometraje(DataGeneral.kilometraje);
      setGrifo(DataGeneral.grifo);
      setFechaCreacion(DataGeneral.fecha_creacion);
      settraspasoid(DataGeneral.traspaso_id);
      setMontoTranspaso(DataGeneral.Monto_Transpaso);
      setcantidadtraspaso(DataGeneral.cantidad_traspaso);
    }
  }, [type, DataGeneral]);

  const handleClose = () => {
    setPlaca("");
    setGalones("");
    setProducto("");
    setConductor("");
    setApellido("");
    setDocumento("");
    setPrecio("");
    setId("");
    setTotal("");
    setKilometraje("");
    setGrifo("");
    setSelectedCamion("");
    setSelectedProducto("");
    setSelectedGrifo("");

    onClose();
  };

  return (
    <>
      {type === "edit" ? (
        <Tooltip content="Traspaso">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => onOpen()}
          >
            <ArrowsUpDownIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "edit" ? "Traspaso" : "Agregar Traspaso"}
              </ModalHeader>
              <ModalBody>
                <div className="flex relative flex-col gap-4">
                  <p>Id data actual: {id}</p>
                  <p>Placa: {placa}</p>
                  <p>
                    Conductor: {conductor} {apellido}
                  </p>
                  <p>Galones: {galones}</p>
                  <p>DATOS DE TRASPASO</p>

                  <Input
                    label="ID de data"
                    isInvalid={error}
                    errorMessage={error && "Ingrese el documento correctamente"}
                    value={busquedaid}
                    onChange={(e) => handleNameChange(e, setBusquedaId)}
                  ></Input>
                  <p>Data: {data2.id}</p>
                  <p>Galones actuales: {data2.galones}</p>
                  <p>Galones precio: {data2.precio}</p>
                  <p>Galones Total: {data2.total}</p>
                </div>
                <Button color="success" onClick={() => listarId()}>
                  Buscar
                </Button>

                <Input
                  label="Ingrese cantidad galones"
                  isInvalid={error}
                  errorMessage={error && "Ingrese el documento correctamente"}
                  value={galonesinter}
                  onChange={(e) => handleNameChange(e, setGalonesInter)}
                ></Input>
                <p>Galones aasd: {galonesinter}</p>
                <Button color="success" onClick={() => calcularTotal()}>
                  actualizar
                </Button>
                <p>Galones aasasdasd: {galoactual1}</p>
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
