import React, { useEffect, useState } from "react";
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
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import { API_BASE_URL } from "../../axiosconf";
import AgregarConductor from "../conductor/AgregarConductor";
import EditarConductor from "../conductor/EditarConductor";
import EliminarConductor from "../conductor/EliminarConductor";

const statusColorMap = {
  true: "success",
  false: "danger",
  vacation: "warning",
};

const Conductores = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [agregar, setAgregar] = React.useState(true);
  const rowsPerPage = 10; // ajustar el número de filas por página
  const [searchTerm, setSearchTerm] = useState("");

  const list = useAsyncList({
    async load({ signal }) {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/Conductor/`, {
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
                item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.apellido.toLowerCase().includes(searchTerm.toLowerCase())
              // Agrega más condiciones de filtro según tus necesidades
            )
          : res.data;

        return {
          items: filteredItems,
        };
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            await refreshToken();
            const refreshedTokens = JSON.parse(localStorage.getItem("tokens"));
            const refreshedRes = await axios.get(`${API_BASE_URL}/Conductor/`, {
              headers: {
                Authorization: `Bearer ${refreshedTokens.access}`,
              },
              signal,
            });

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

  const updateConductor = async () => {
    list.reload();
    //console.log('aca llego');
  };

  // Obtener la cantidad total de elementos
  const totalTipo = list.items.length;
  // Obtener la cantidad de  activos
  const tiposActivos = list.items.filter((item) => item.estado).length;

  // Obtener la cantidad de  inactivos
  const tiposInactivos = list.items.filter((item) => !item.estado).length;

  return (
    <div className="w-full">
      <div className="flex w-full relative grid grid-cols-1 sm:grid-cols-3 justify-center gap-2">
        <Card>
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://www.seekpng.com/png/full/694-6945539_registro-png.png"
              width={40}
            />
            <div className="flex flex-col ">
              <p className="text-md">N° registros:</p>
              <p className="text-md ">
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
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://static.vecteezy.com/system/resources/previews/017/178/234/original/check-mark-symbol-icon-on-transparent-background-free-png.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">N° activos:</p>
              <p className="text-md">
                {tiposActivos !== null ? (
                  <span className="text-center">{tiposActivos}</span>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://p9n2c8y2.rocketcdn.me/wp-content/uploads/2021/05/5.png.webp"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">N° inactivos:</p>
              <p className="text-md">
                {tiposInactivos !== null ? (
                  <span className="text-center"> {tiposInactivos}</span>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
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
            <span style={{ paddingTop: "10px" }}>GESTION DE CONDUCTORES</span>
            {agregar && (
              <AgregarConductor
                style={{ paddingTop: "10px" }}
                onClose={() => setAgregar(false)}
                updateConductor={updateConductor}
              />
            )}

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
          </div>
        </CardHeader>

        <Table
          aria-label="Conductores"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
          classNames={{
            table: "min-h-[600px]",
            table: "min-w-[100%]",
          }}
        >
          <TableHeader>
            <TableColumn key="id" allowsSorting>
              id
            </TableColumn>
            <TableColumn key="nombre" allowsSorting>
              Nombre
            </TableColumn>
            <TableColumn key="apellido" allowsSorting>
              apellidos
            </TableColumn>
            <TableColumn key="estado" allowsSorting>
              Estado
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
                <TableCell>{item?.id}</TableCell>
                <TableCell>{item?.nombre}</TableCell>
                <TableCell>{item?.apellido}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap[item?.estado]}
                    size="sm"
                    variant="flat"
                  >
                    {item?.estado ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell className="flex relative">
                  <EditarConductor
                    Conductor={item}
                    updateConductor={updateConductor}
                  ></EditarConductor>
                  <EliminarConductor
                    Conductor={item}
                    updateConductor={updateConductor}
                  ></EliminarConductor>
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

export default Conductores;
