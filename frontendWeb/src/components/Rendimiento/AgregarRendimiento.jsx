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
  Textarea,
  Tooltip,
  useDisclosure,
  Select,
  SelectItem,
  Accordion,
  AccordionItem,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../axiosconf";

export default function AgregarRendimiento({
  type = "agregar",
  updateRendimiento,
  Rendimiento,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [fechaCreacion, setFechaCreacion] = useState(
    new Date(Rendimiento.fecha_creacion)
  );
  const [km, setkm] = useState(Rendimiento.kilometraje);

  const [error, setError] = useState(false);
  const [ruta, setRuta] = useState("");
  const [carga, setCarga] = useState("");
  const [peso, setPeso] = useState("");
  const [maxKilometraje, setMaxKilometraje] = useState(null);
  const [diferenciaKilometraje, setDiferenciaKilometraje] = useState(null);
  const [rendimientokmxgalon, setRendimientoxgalon] = useState(null);
  const [rendimientoEsperado, setRendimientoEsperado] = useState("");
  const [rendimientoCalculado, setRendimientoCalculado] = useState(null);
  const [excesoReal, setExcesoReal] = useState(null);

  const handleNameChange = (e, fieldSetter) => {
    let value = e.target.value;
    // Restringir caracteres: solo letras y números
    value = value.replace(/[^a-zA-Z0-9-.]+/g, " ");
    if (value.length > 250) {
      value = value.substring(0, 250);
    }
    fieldSetter(value);
  };

  // Función para manejar cambios en el campo "Rendimiento esperado"
  const handleRendimientoEsperadoChange = (e) => {
    const value = e.target.value;
    setRendimientoEsperado(value);
  };

  // Función para calcular el rendimiento esperado
  const calcularRendimientoEsperado = () => {
    if (rendimientoEsperado && diferenciaKilometraje !== null) {
      const division = diferenciaKilometraje / parseFloat(rendimientoEsperado);
      setRendimientoCalculado(division.toFixed(2));
    } else {
      setRendimientoCalculado(null);
    }
  };

  // Función para calcular la diferencia de kilometraje
  const calcularDiferenciaKilometraje = () => {
    if (parseInt(Rendimiento.kilometraje) === parseInt(maxKilometraje)) {
      const diferencia = Rendimiento.kilometraje;
      setDiferenciaKilometraje(diferencia.toFixed(1));
    } else {
      const kmRendimiento = parseInt(Rendimiento.kilometraje);
      const diferencia = kmRendimiento - maxKilometraje;
      setDiferenciaKilometraje(diferencia.toFixed(1));
    }
  };

  // Función para calcular redimiento KM X GALON
  const calcularRendimientoXgalon = () => {
    if (Rendimiento.galones && diferenciaKilometraje != null) {
      const division = diferenciaKilometraje / Rendimiento.galones;
      setRendimientoxgalon(division.toFixed(2));
    } else {
      setRendimientoxgalon(0);
    }
  };

  const handleSubmit = async () => {
    // Validar campos
    const fechaParaEnviar = new Date(fechaCreacion).toISOString();

    try {
      if (type === "agregar") {
        // Configurar el encabezado con el token de acceso
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const accessToken = tokens?.access;

        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        };

        const url = `${API_BASE_URL}/Rendimiento/`;

        const data = {
          id_datageneral: Rendimiento.id,
          fecha_tanqueo: fechaParaEnviar,
          ruta: ruta,
          carga: carga,
          peso: peso,
          km_recorrido: diferenciaKilometraje,
          rend_kmxglp: rendimientokmxgalon,
          gl_esperado: rendimientoCalculado,
          ren_esperado: rendimientoEsperado,
          exceso_real: excesoReal,
        };
        console.log("enviar:", data);

        // Agregar el encabezado a la solicitud
        await toast.promise(axios.post(url, data, { headers }), {
          loading: "Registrando...",
          success: "Rendimiento Registrado",
          error: "Error al registrar Rendimiento! Verifique los campos",
        });

        // Actualizar el estado de la data general
        const dataGeneralUpdateUrl = `${API_BASE_URL}/DataGeneral/${Rendimiento.id}/`;
        const dataGeneralUpdateData = {
          estado_rendimiento: true, // Cambiar el estado a true
        };

        // Enviar la solicitud para actualizar la data general
        await axios.patch(dataGeneralUpdateUrl, dataGeneralUpdateData, {
          headers,
        });
      }
      // Luego de editar el usuario, llama a la función de actualización
      updateRendimiento();
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

  const handlelimpiar = () => {
    setError(false); // Restablecer el estado de error a falso
    onClose(); // Cerrar el modal
  };

  const handleFechaCreacionChange = (event) => {
    const nuevaFecha = event.target.value;

    // Actualizar el estado con la nueva fecha
    setFechaCreacion(new Date(Rendimiento.fechaCreacion));
  };

  useEffect(() => {
    // Definimos una función asincrónica dentro de useEffect para realizar la solicitud GET
    const obtenerMaxKilometraje = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/maxKM/?placa=${Rendimiento.placa_nombre}`
        );

        if (response.status === 200) {
          // Si la solicitud es exitosa, actualizamos el estado con los datos recibidos
          setMaxKilometraje(response.data.max_kilometraje);
        } else {
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        // Manejamos los errores
        console.error("Error:", error.message);
      }
    };

    // Llamamos a la función para realizar la solicitud cuando el componente se monta
    obtenerMaxKilometraje();
  }, []);

  useEffect(() => {
    // Calcular la diferencia de kilometraje cuando Rendimiento.kilometraje o maxKilometraje cambien
    // calcularDiferenciaKilometraje();
    calcularRendimientoXgalon();
    calcularRendimientoEsperado();
    // Verifica que tanto galones como GL esperado no sean nulos
    if (Rendimiento.galones !== null && rendimientoCalculado !== null) {
      // Calcula el exceso real dividiendo los galones entre el GL esperado
      const exceso = Rendimiento.galones - parseFloat(rendimientoCalculado);
      // Actualiza el estado con el resultado del cálculo
      setExcesoReal(exceso.toFixed(2));
    } else {
      // Si alguno de los valores es nulo, establece el exceso real como null
      setExcesoReal(null);
    }
  }, [
    maxKilometraje,
    Rendimiento.galones,
    diferenciaKilometraje,
    rendimientokmxgalon,
    rendimientoEsperado,
    rendimientoCalculado,
  ]);

  return (
    <>
      {type === "agregar" ? (
        <Tooltip content="Agregar Rendimiento">
          <Button
            isIconOnly
            className="bg-transparent"
            onPress={() => onOpen()}
          >
            <PlusCircleIcon className="w-6 text-default-500" />
          </Button>
        </Tooltip>
      ) : null}

      <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === "agregar"
                  ? "Agregar Rendimiento"
                  : "Editar Rendimiento"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primera columna */}
                  <div>
                    <Input
                      isDisabled
                      type="date"
                      label="Fecha tanqueo"
                      value={fechaCreacion.toISOString().split("T")[0]}
                      onChange={handleFechaCreacionChange}
                      className="mb-2"
                    />
                    <Input
                      isDisabled
                      type="text"
                      label="Camion - Conductor"
                      defaultValue={`${Rendimiento.placa_nombre} - ${Rendimiento.conductor_nombre} ${Rendimiento.conductor_apellido}`}
                      className="mb-2"
                    />
                    <Input
                      isDisabled
                      type="text"
                      label="Galones"
                      defaultValue={Rendimiento.galones}
                      className="mb-2"
                    />
                    {maxKilometraje !== null ? (
                      <p className="mb-2">
                        El máximo kilometraje para la placa{" "}
                        {Rendimiento.placa_nombre} es: {maxKilometraje}
                      </p>
                    ) : (
                      <p>Cargando...</p>
                    )}
                    <Button
                      color="success"
                      onClick={calcularDiferenciaKilometraje}
                      className="mb-2"
                    >
                      Calcular Diferencia Kilometraje
                    </Button>
                    <Input
                      type="text"
                      label="KM-Recorridos"
                      value={diferenciaKilometraje}
                      onChange={(e) =>
                        handleNameChange(e, setDiferenciaKilometraje)
                      }
                      className="mb-2"
                    />
                    <Input
                      isDisabled
                      type="text"
                      label="Rendimiento KM x GL"
                      value={rendimientokmxgalon}
                    />
                  </div>

                  {/* Segunda columna */}
                  <div>
                    <Textarea
                      label="Ruta"
                      isInvalid={error}
                      errorMessage={error && "Ingrese la ruta correctamente"}
                      value={ruta}
                      onChange={(e) => handleNameChange(e, setRuta)}
                      className="mb-2"
                    />
                    <Input
                      label="Carga"
                      isInvalid={error}
                      errorMessage={error && "Ingrese la carga correctamente"}
                      value={carga}
                      onChange={(e) => handleNameChange(e, setCarga)}
                      className="mb-2"
                    />
                    <Input
                      label="Peso"
                      isInvalid={error}
                      errorMessage={error && "Ingrese el peso correctamente"}
                      value={peso}
                      onChange={(e) => handleNameChange(e, setPeso)}
                      className="mb-2"
                    />
                    <Input
                      label="Rendimiento esperado"
                      value={rendimientoEsperado}
                      onChange={handleRendimientoEsperadoChange}
                      className="mb-2"
                    />
                    {/* Mostrar el rendimiento calculado */}
                    {rendimientoCalculado !== null && (
                      <p className="mb-2">
                        GL esperado: {rendimientoCalculado}
                      </p>
                    )}
                    <Input
                      isDisabled
                      type="text"
                      label="Exceso Real"
                      value={excesoReal !== null ? excesoReal : "Calculando..."}
                      className={
                        excesoReal !== null
                          ? excesoReal > 0
                            ? "text-red-500"
                            : "text-blue-500"
                          : ""
                      }
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onClick={() => handlelimpiar()}
                >
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
