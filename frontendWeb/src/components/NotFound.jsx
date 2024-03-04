// NotFound.jsx
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

const NotFound = () => {
  return (
    <Card className="py-20 w-full  ">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <h1 className="font-bold text-3xl ">404 - Página no encontrada</h1>
        <p className="text-large py-10 uppercase font-bold">
          Lo sentimos, la página que estás buscando no existe.
        </p>
      </CardHeader>
      <CardBody className="overflow-visible py-10 items-center ">
        <Image
          alt="Card pagina error"
          className="object-cover rounded-x1"
          src="https://static.vecteezy.com/system/resources/previews/007/162/540/non_2x/error-404-page-not-found-concept-illustration-web-page-error-creative-design-modern-graphic-element-for-landing-page-infographic-icon-free-vector.jpg"
          width={570}
        />
      </CardBody>
    </Card>
  );
};

export default NotFound;
