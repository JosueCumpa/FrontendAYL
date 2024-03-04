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
import EditarUsuario from "./EditarUsuario";
import EliminarUsuario from "./EliminarUsuario";
import AgregarUsuario from "./AgregarUsuario";

const statusColorMap = {
  true: "success",
  false: "danger",
  vacation: "warning",
};

const statusColorMap2 = {
  true: "success",
  false: "warning",
};

const Usuarios = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [agregar, setAgregar] = React.useState(true);
  const rowsPerPage = 10; // ajustar el número de filas por página
  const [searchTerm, setSearchTerm] = useState("");

  const list = useAsyncList({
    async load({ signal }) {
      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        const res = await axios.get(`${API_BASE_URL}/usuarios/`, {
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
                item.username
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                item.first_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                item.last_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            const refreshedRes = await axios.get(`${API_BASE_URL}/usuarios/`, {
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
    // Actualizar la lista al realizar una búsqueda
    list.reload();
  };

  const updateUsuarios = async () => {
    list.reload();
    //console.log('aca llego');
  };

  // Obtener la cantidad total de elementos
  const totalUsuarios = list.items.length;

  // Obtener la cantidad de usuarios activos
  const usuariosActivos = list.items.filter((item) => item.is_active).length;

  // Obtener la cantidad de usuarios inactivos
  const usuariosInactivos = list.items.filter((item) => !item.is_active).length;

  // Obtener la cantidad de usuarios administradores
  const usuariosadmin = list.items.filter((item) => item.is_superuser).length;

  // // Obtener la cantidad de usuarios del area de  calidad
  // const usuarioscalidad = list.items.filter(item => item.is_staff).length;

  // Obtener la cantidad de usuarios operarios
  const usuariosOperario = list.items.filter((item) => !item.is_staff).length;

  return (
    <div className="w-full">
      <div className="flex relative grid grid-cols-2 sm:grid-cols-5 justify-center gap-2">
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
                {totalUsuarios !== null ? (
                  <span className="text-center">{totalUsuarios} </span>
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
                {usuariosActivos !== null ? (
                  <span className="text-center">{usuariosActivos}</span>
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
                {usuariosInactivos !== null ? (
                  <span className="text-center"> {usuariosInactivos}</span>
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
              src="https://cdn-icons-png.flaticon.com/512/2942/2942813.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">N° admins:</p>
              <p className="text-md">
                {usuariosadmin !== null ? (
                  <span className="text-center"> {usuariosadmin}</span>
                ) : (
                  <p>Cargando...</p>
                )}
              </p>
            </div>
          </CardHeader>
        </Card>
        {/* <Card >
                <CardHeader className="flex gap-3">
                    <Image
                        alt="nextui logo"
                        height={40}
                        radius="sm"
                        src="https://cdn-icons-png.flaticon.com/128/949/949636.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">N° usu.calidad:</p>
                        <p className="text-md">
                            {usuariosadmin !== null ? (
                                <span className="text-center"> {usuarioscalidad}</span>
                            ) : (
                                <p>Cargando...</p>
                            )}
                        </p>
                    </div>
                </CardHeader>
            </Card> */}
        <Card>
          <CardHeader className="flex gap-3">
            <Image
              alt="nextui logo"
              height={40}
              radius="sm"
              src="https://cdn-icons-png.flaticon.com/128/7425/7425445.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">N° operarios:</p>
              <p className="text-md">
                {usuariosadmin !== null ? (
                  <span className="text-center"> {usuariosOperario}</span>
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
            <span style={{ paddingTop: "10px" }}>GESTION DE USUARIOS</span>
            {agregar && (
              <AgregarUsuario
                style={{ paddingTop: "10px" }}
                onClose={() => setAgregar(false)}
                updateUsuarios={updateUsuarios}
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
          aria-label="USUARIOS"
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
            <TableColumn key="username" allowsSorting>
              Usuario
            </TableColumn>
            <TableColumn key="is_active" allowsSorting>
              Estado
            </TableColumn>
            <TableColumn key="is_superuser" allowsSorting>
              Grupo
            </TableColumn>
            <TableColumn key="first_name" allowsSorting>
              Nombre
            </TableColumn>
            <TableColumn key="last_name" allowsSorting>
              Apellido
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
                <TableCell>{item?.username}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap[item?.is_active]}
                    size="sm"
                    variant="flat"
                  >
                    {item?.is_active ? "Activo" : "Inactivo"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={statusColorMap2[item?.is_superuser]}
                    size="sm"
                    variant="flat"
                  >
                    {item?.is_superuser == true && item?.is_staff == true
                      ? " Administrador"
                      : ""}

                    {/* {item?.is_staff == true && item?.is_superuser == true ? " Administrador y Calidad " : ""}

                                    {item?.is_superuser == false && item?.is_staff == true ? " Calidad " : ""} */}

                    {item?.is_superuser == false && item?.is_staff == true
                      ? " Operario "
                      : ""}
                  </Chip>
                </TableCell>
                <TableCell>{item?.first_name}</TableCell>
                <TableCell>{item?.last_name}</TableCell>
                <TableCell className="flex relative">
                  <EditarUsuario
                    usuario={item}
                    updateUsuarios={updateUsuarios}
                  ></EditarUsuario>
                  <EliminarUsuario
                    usuario={item}
                    updateUsuarios={updateUsuarios}
                  ></EliminarUsuario>
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

export default Usuarios;
