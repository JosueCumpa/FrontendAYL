import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Card,
  CardHeader,
  Chip,
  Image,
  Input,
  Button,
  Select,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";
import AgregarRendimiento from "./AgregarRendimiento";
import EditarRendimiento from "./EditarRendimiento";
const statusColorMap2 = {
  true: "success",
  false: "danger",
};

const Rendimiento = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [agregar, setAgregar] = React.useState(true);
  const rowsPerPage = 10; // ajustar el número de filas por página
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const list = useAsyncList({
    async load({ signal }) {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/listado_nombres/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
          signal,
        });

        setIsLoading(false);

        // Aplicar filtro de búsqueda si hay un término
        const filteredItems = searchTerm
          ? res.data.filter(
              (item) =>
                item.placa_nombre
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                (item.rendimiento &&
                  item.rendimiento.periodo &&
                  item.rendimiento.periodo
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
                item.conductor_nombre
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                item.conductor_apellido
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
          : res.data;
        // console.log(res.data);
        // Aplicar filtro de búsqueda fechas
        const filteredByDate = filteredItems.filter((item) => {
          const fechaCreacion = new Date(item.fecha_creacion)
            .toISOString()
            .split("T")[0];
          return (
            (!startDate || fechaCreacion >= startDate) &&
            (!endDate || fechaCreacion <= endDate)
          );
        });
        const filteredByStatus = filteredByDate.filter((item) => {
          return (
            selectedStatus === "" || // Si no se ha seleccionado un estado, devuelve true para todos los elementos
            item.estado_rendimiento.toString() === selectedStatus // Filtra por el estado seleccionado
          );
        });
        // console.log(res.data);
        return {
          items: filteredByStatus,
        };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await refreshToken();
            const refreshedTokens = JSON.parse(localStorage.getItem("tokens"));
            const refreshedRes = await axios.get(
              `${API_BASE_URL}/listado_nombres/`,
              {
                headers: {
                  Authorization: `Bearer ${refreshedTokens.access}`,
                },
                signal,
              }
            );

            setIsLoading(false);

            return {
              items: refreshedRes.data,
            };
          } catch (refreshError) {
            console.error(
              "Error al renovar y cargar datos:",
              refreshError.message
            );
            setIsLoading(false);

            return {
              items: [],
            };
          }
        } else {
          console.error("Error al cargar datos:", error.message);
          setIsLoading(false);

          return {
            items: [],
          };
        }
      }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  const refreshToken = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("tokens"));
      const refreshRes = await axios.post(
        `${API_BASE_URL}/auth/token/refresh/`,
        {
          refresh: tokens.refresh,
        }
      );

      const newTokens = {
        ...tokens,
        access: refreshRes.data.access,
      };
      localStorage.setItem("tokens", JSON.stringify(newTokens));
    } catch (refreshError) {
      console.error("Error al renovar el token:", refreshError.message);
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    // Actualizar la lista al realizas una búsqueda
    list.reload();
  };

  const updateRendimiento = async () => {
    list.reload();
    //console.log('aca llego');
  };

  // Obtener la cantidad total de elementos
  const totalTipo = list.items.length;

  return (
    <div className="w-full">
      <div className="flex w-full relative grid grid-cols-1 sm:grid-cols-2 justify-center gap-1">
        <Card>
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://www.seekpng.com/png/full/694-6945539_registro-png.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">N° registros:</p>
              <p className="text-md">
                {totalTipo !== null ? (
                  <span className="text-center">{totalTipo} </span>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex gap-2 justify-center grid grid-cols-1 sm:grid-cols-2">
            <div className="flex ">
              <p className="text-md">Fecha de inicio:</p>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex ">
              <p className="text-md">Fecha de fin:</p>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </CardHeader>
        </Card>
      </div>
      <br />

      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        <CardHeader className="flex gap-3 justify-start font-bold text-large ">
          <div className=" px-8 rounded-2xl flex gap-3  grid grid-cols-2 sm:grid-cols-4">
            <span style={{ paddingTop: "10px" }}>GESTION DE RENDIMIENTO</span>
            {/* {agregar && (
              <AgregarData
                style={{ paddingTop: "10px" }}
                onClose={() => setAgregar(false)}
                updateDataGeneral={updateDataGeneral}
              />
            )} */}

            {/* Componente de búsqueda */}
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg "
              onClick={handleSearch}
              size="lg"
            >
              Buscar
            </Button>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="false">Pendiente</option>
              <option value="true">Realizado</option>
            </select>
            {/* <Button onClick={exportToExcel} size="lg">
              Exportar a Excel
            </Button> */}
          </div>
        </CardHeader>

        <Table
          aria-label="DataGeneral"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
          classNames={{
            table: "min-h-[600px]",
            table: "min-w-[100%]",
          }}
        >
          <TableHeader>
            {/* <TableColumn key="id" allowsSorting>
              id
            </TableColumn> */}
            <TableColumn key="fecha_creacion" allowsSorting>
              F. Tanqueo
            </TableColumn>
            {/* <TableColumn key="fecha_actualizacion" allowsSorting>
                F.actualización
            </TableColumn> */}

            <TableColumn key="año" allowsSorting>
              Año
            </TableColumn>
            <TableColumn key="periodo" allowsSorting>
              Periodo
            </TableColumn>
            <TableColumn key="placa" allowsSorting>
              Placa
            </TableColumn>
            <TableColumn key="conductor" allowsSorting>
              Conductor
            </TableColumn>
            {/* <TableColumn key="producto" allowsSorting>
                Producto
            </TableColumn> */}

            <TableColumn key="ruta" allowsSorting>
              Ruta
            </TableColumn>
            <TableColumn key="carga" allowsSorting>
              Carga
            </TableColumn>
            <TableColumn key="peso" allowsSorting>
              Peso
            </TableColumn>
            <TableColumn key="gl" allowsSorting>
              GL
            </TableColumn>
            <TableColumn key="Km Recor" allowsSorting>
              KM RECOR
            </TableColumn>

            <TableColumn key="rend_kmxglp" allowsSorting>
              R.KmXglp
            </TableColumn>
            <TableColumn key="gl_esperado" allowsSorting>
              GL.Esper
            </TableColumn>
            <TableColumn key="ren_esperado" allowsSorting>
              R.Esperado
            </TableColumn>

            <TableColumn key="exceso_real" allowsSorting>
              Exc.Real
            </TableColumn>
            <TableColumn key="estado_rendimiento" allowsSorting>
              Rendimiento
            </TableColumn>

            <TableColumn key="acciones" allowsSorting>
              Acciones
            </TableColumn>
          </TableHeader>
          <TableBody
            items={list.items.slice(
              (page - 1) * rowsPerPage,
              page * rowsPerPage
            )}
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item?.id}>
                {/* <TableCell>{item?.id}</TableCell> */}
                <TableCell>
                  {item?.fecha_creacion &&
                    format(new Date(item?.fecha_creacion), "dd-MM-yyyy")}
                </TableCell>

                {/* <TableCell>{item?.fecha_actualizacion && format(new Date(item?.fecha_actualizacion), 'dd-MM-yyyy')}</TableCell> */}

                <TableCell>{item?.rendimiento?.año}</TableCell>
                <TableCell>{item?.rendimiento?.periodo}</TableCell>
                <TableCell>{item?.placa_nombre}</TableCell>
                <TableCell>
                  {item?.conductor_nombre} {item?.conductor_apellido}
                </TableCell>
                {/* <TableCell>{item?.producto_nombre}</TableCell> */}

                <TableCell>{item?.rendimiento?.ruta}</TableCell>
                <TableCell>{item?.rendimiento?.carga}</TableCell>
                <TableCell>{item?.rendimiento?.peso}</TableCell>
                <TableCell>{item?.galones}</TableCell>
                <TableCell>{item?.rendimiento?.km_recorrido}</TableCell>

                <TableCell>{item?.rendimiento?.rend_kmxglp}</TableCell>
                <TableCell>{item?.rendimiento?.gl_esperado}</TableCell>
                <TableCell>{item?.rendimiento?.ren_esperado}</TableCell>

                <TableCell
                  className={
                    item?.rendimiento?.exceso_real < 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {item?.rendimiento?.exceso_real}
                </TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap2[item?.estado_rendimiento]}
                    size="sm"
                    variant="flat"
                  >
                    {item?.estado_rendimiento ? "Finalizado" : "Pendiente"}
                  </Chip>
                </TableCell>
                <TableCell className="flex relative">
                  <AgregarRendimiento
                    Rendimiento={item}
                    updateRendimiento={updateRendimiento}
                  ></AgregarRendimiento>
                  <EditarRendimiento
                    updateRendimiento={updateRendimiento}
                    Rendimiento={item}
                  ></EditarRendimiento>
                  {/*<EliminarData
                    DataGeneral={item}
                    updateDataGeneral={updateDataGeneral}
                  ></EliminarData> */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Pagination
          onChange={handlePageChange}
          isCompact
          showControls
          total={Math.ceil(list.items.length / rowsPerPage)}
          initialPage={1}
        />
      </Card>
    </div>
  );
};

export default Rendimiento;
