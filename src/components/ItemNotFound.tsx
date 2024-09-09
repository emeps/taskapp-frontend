import {
    Card,
    CardContent,
    CardTitle, CardHeader,
    CardDescription
  } from "@/components/ui/card";
  import Lottie from "lottie-react";
  import itemNotFound from "../assets/animations/item_not_found.json";
  export const ItemNotFound = () => {
    return (
      <div className="flex p-8 items-center justify-center">
      <Card className="w-full border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl"><p>Você ainda não possui nenhuma tarefa salva.</p></CardTitle>
          <CardDescription className="max-w-3xl"><p>Navege até o botão "Adicionar Tarefa" localizado na parte superior da página para adicionar novas tarefas.</p></CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Lottie animationData={itemNotFound} loop={false} />
        </CardContent>
      </Card>
    </div>
    );
  };
  