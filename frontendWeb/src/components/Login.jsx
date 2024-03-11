import { useState, useEffect } from "react";
import { Card, CardBody, Image, Button, Input } from "@nextui-org/react";
import Logo from "../assets/LOGO ALEX Y LALITO.png";
import { EyeFilledIcon } from "../assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";
import { UserIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { API_BASE_URL } from "../axiosconf";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    // Elimina el token del localStorage al cargar la página de login
    localStorage.removeItem("tokens");
    localStorage.removeItem("user_data");
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/token/`, {
        // const response = await axios.post('http://127.0.0.1:8000/auth/token/', {
        username: user,
        password: password,
      });

      // Aquí puedes acceder a la respuesta de la API, como el token
      const tokens = response.data?.tokens;
      const user_data = response.data?.user_data;
      // Realiza acciones con el token, como almacenarlo en el estado o en localStorage

      localStorage.setItem("tokens", JSON.stringify(tokens));
      localStorage.setItem("user_data", JSON.stringify(user_data));

      //console.log(response.data);
      // Ejemplo de uso de toast para mostrar un mensaje
      toast.success("Inicio de sesión exitoso!");
      navigate("/consumo/dashboard");
    } catch (error) {
      // Manejo de errores, por ejemplo, mostrar un mensaje de error con toast
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Toaster />
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="md"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Logo Abraham"
                className="object-cover"
                height={300}
                shadow=""
                src={Logo}
                width={240}
                style={{ marginLeft: "5%" }}
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8 items-center">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0 ">
                  <h1 className="text-large font-medium mt-2 text-center">
                    INICIO DE SESION
                  </h1>
                  <br />
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <Input
                  type="text"
                  label="Usuario"
                  variant="bordered"
                  className="max-w-xs"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  endContent={
                    <UserIcon className="text-default-600 pointer-events-none h-7 w-7" />
                  }
                />
              </div>

              <br />

              <div className="flex justify-between items-start gap-4">
                <Input
                  label="Contraseña"
                  variant="bordered"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-600 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-600 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  className="max-w-xs"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <br />

              <Button
                radius="full"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                onClick={handleLogin}
              >
                INGRESAR
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
