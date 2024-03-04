import {
  HomeIcon,
  UserIcon,
  ChartPieIcon,
  CpuChipIcon,
  TagIcon,
  IdentificationIcon,
  BriefcaseIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  Navbar,
  NavbarContent,
  Switch,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@nextui-org/react";

import { Link, useNavigate } from "react-router-dom";
import Logo from "../../src/assets/LOGO ALEX Y LALITO.png";
import { MoonIcon } from "../../src/assets/MoonIcon";
import { SunIcon } from "../../src/assets/SunIcon";

export default function MySidebar({ setDarkMode }) {
  const [darkMode, setLocalDarkMode] = useState(false);
  const navigate = useNavigate();
  //const tokens = JSON.parse(localStorage.getItem('tokens'));
  const user_data = JSON.parse(localStorage.getItem("user_data"));

  //slidebar ocultar el menu
  const [collapse, setCollapse] = useState(window.innerWidth < 720);

  useEffect(() => {
    const handleResize = () => {
      setCollapse(window.innerWidth < 720);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //boton de logout
  const handleLogout = () => {
    // Limpiar el token del almacenamiento local
    localStorage.removeItem("user_data");
    localStorage.removeItem("tokens");
    // Redirigir al usuario a la página de inicio de sesión
    navigate("/login");
  };
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setLocalDarkMode(newDarkMode);
    setDarkMode(newDarkMode);
  };

  const toggleSidebar = () => {
    setCollapse(!collapse);
  };

  return (
    <Sidebar
      collapsed={collapse}
      backgroundColor="grey"
      className="min-h-screen"
    >
      <Menu>
        <div className="flex items-center gap-2 p-5">
          <img src={Logo} alt="logo A Y L" />
        </div>
        <div className="flex items-center justify-center gap-2 p-5">
          <Switch
            className="items-center"
            defaultSelected={!darkMode}
            size="lg"
            color="warning"
            onChange={toggleDarkMode}
            startContent={<SunIcon />}
            endContent={<MoonIcon />}
          ></Switch>
        </div>

        <Navbar>
          <NavbarContent as="div" justify="center">
            {collapse ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    avatarProps={{
                      src: "https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png",
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Usuario</p>
                    <p className="font-semibold">{user_data.name}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Dropdown placement="bottom-end" className="text-foreground">
                <DropdownTrigger>
                  <User
                    className="text-foreground"
                    name={user_data.name}
                    description=""
                    avatarProps={{
                      src: "https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png",
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Usuario</p>
                    <p className="font-semibold">{user_data.name}</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </DropdownItem>
                  {/* Otros elementos del menú */}
                </DropdownMenu>
              </Dropdown>
            )}
          </NavbarContent>
        </Navbar>
        <MenuItem
          component={<Link to={`/dashboard`} />}
          icon={<ChartPieIcon className="h-6 w-6" />}
        >
          Dashboard
        </MenuItem>

        {/* Condición para mostrar o no el MenuItem de Usuarios */}
        {user_data.group === "true" && user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/usuarios`} />}
            icon={<UserIcon className="h-6 w-6" />}
          >
            Usuarios
          </MenuItem>
        ) : null}

        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/banco`} />}
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
          >
            Banco
          </MenuItem>
        ) : null}

        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/grifo`} />}
            icon={<CpuChipIcon className="h-6 w-6" />}
          >
            Grifos
          </MenuItem>
        ) : null}
        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/producto`} />}
            icon={<TagIcon className="h-6 w-6" />}
          >
            Producto
          </MenuItem>
        ) : null}
        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/conductor`} />}
            icon={<IdentificationIcon className="h-6 w-6" />}
          >
            Conductores
          </MenuItem>
        ) : null}
        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/camion`} />}
            icon={<BriefcaseIcon className="h-6 w-6" />}
          >
            Camiones
          </MenuItem>
        ) : null}
        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/datageneral`} />}
            icon={<CircleStackIcon className="h-6 w-6" />}
          >
            Data General
          </MenuItem>
        ) : null}

        {user_data.op === "true" ? (
          <MenuItem
            component={<Link to={`/rendimiento`} />}
            icon={<PresentationChartLineIcon className="h-6 w-6" />}
          >
            Rendimiento
          </MenuItem>
        ) : null}

        {/* Botón para contraer o expandir la barra lateral */}
        <button
          className="bg-gray-200 text-gray-800 p-2 mt-auto w-full focus:outline-none"
          onClick={toggleSidebar}
        >
          {collapse ? "Expandir" : "Contraer"}
        </button>
      </Menu>
    </Sidebar>
  );
}
