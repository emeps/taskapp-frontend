import { useRouteError, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import errorPageAnimation from "../assets/animations/page_not_found.json";

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  const handleRedirect = () => navigate("/");

  console.error(error);
  let errorMessage;
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "A página que você está buscando pode não existir ou não estar disponível!";
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-2xl p-6 border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl"><p>Ocorreu um erro inesperado.</p> 
          <CardDescription><p>Estamos trabalhando para resolvê-lo o mais rápido possível.</p></CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Lottie animationData={errorPageAnimation} loop={true} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleRedirect}>Voltar!</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
