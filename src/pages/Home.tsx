import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/userContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loading } from "@/components/Loading";
import { ErrorPage } from "./ErrorPage";
import { ItemNotFound } from "@/components/ItemNotFound";

export function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fetchTasks = async (token:string) => {
    try {
      const response = await axios.get("http://localhost:3001/task/", {
        headers: {
          Authorization: `${token}`,
        },
      });

      const tasksWithFormattedData = response.data.data.map((task) => ({
        ...task,
        createdAt: formatData(task.createdAt),
        updatedAt: formatData(task.updatedAt),
      }));

      setTasks(tasksWithFormattedData);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao buscar tarefas");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("Token não encontrado. Por favor, faça login.");
      setLoading(false);
      navigate("/login");
      return;
    }
    fetchTasks(token);
  }, []);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleSaveChanges = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("Token não encontrado. Por favor, faça login.");
      navigate("/login");
      return;
    }

    try {
      const updatedTask = {
        title,
        description,
        status,
      };

      await axios.patch(
        `http://localhost:3001/task/${selectedTask.id}`,
        updatedTask,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...updatedTask } : task
        )
      )
      fetchTasks(token)
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar tarefa");
    }
  };

  const handleStatusChange = async (taskId: number, value: string) => {
    setStatus(value);

    const token = Cookies.get("token");

    if (!token) {
      setError("Token não encontrado. Por favor, faça login.");
      navigate("/login");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3001/task/status/${taskId}`,
        { status: value },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      // Atualizar a lista de tarefas após edição
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: value } : task
        )
      )
      fetchTasks(token)
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao atualizar status da tarefa"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const token = Cookies.get("token");

    if (!token) {
      setError("Token não encontrado. Por favor, faça login.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/task/${taskId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      // Remover a tarefa deletada da lista de tarefas
      setTasks(tasks.filter((task) => task.id !== taskId));
      fetchTasks(token)
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao deletar tarefa");
    }
  };

  const handleAddNewTask = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("Token não encontrado. Por favor, faça login.");
      navigate("/login");
      return;
    }

    try {
      const createNewTask = {
        title,
        description,
        status,
      };

      const response = await axios.post(
        "http://localhost:3001/task",
        createNewTask,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      const newTask = response.data.data;

      setTasks((prevTasks) => [...prevTasks, newTask]);

      await fetchTasks(token)

      setTitle("");
      setDescription("");
      setStatus("");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao adicionar tarefa");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const formatData = (dataISO: string) => {
    const data = new Date(dataISO);

    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const horaFormatada = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dataFormatada, horaFormatada };
  };

  const clearInput = () => {
    setTitle("");
    setDescription("");
    setStatus("");
  };
  if (loading) return <Loading />;
  if (error) return <ErrorPage />;
  return (
    <div className="max-w-full">
      <nav className="bg-gray-800 text-white  flex items-center justify-between">
        <div className="text-xl font-bold p-4">{!(localStorage.getItem('name')===""||null)?`Bem-vindo, ${localStorage.getItem('name')}!`:`Bem-vindo!`}</div>
        <div className="p-4 flex items-center justify-end ">
          <div className="flex items-center gap-4 p-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-500"
                  onClick={clearInput}
                >
                  Adicionar Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Tarefa</DialogTitle>
                  <DialogDescription>
                    Adicione sua nova tarefa aqui. Clique em salvar quando você
                    terminar.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Título
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Descrição
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="col-span-3 min-h-[200px]"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o status da tarefa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel id="status">Status</SelectLabel>
                          <SelectItem value="COMPLETED">Concluído</SelectItem>
                          <SelectItem value="PENDING">Pendente</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            Em progresso
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" onClick={handleAddNewTask}>
                      Adicionar Tarefa
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Deslogar
            </Button>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center p-4">
        
        {!tasks ? (
          <div><h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Minhas Tarefas
        </h1>
        <div className=" flex items-center justify-end">
            <div className="flex items-center gap-4 p-1">
              <Input
                type="text"
                placeholder="Buscar por título, descrição ou status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded border border-gray-400 w-80"
              />
            </div>
          </div>
        </div>
          
        ) : (
          ""
        )}
        <div className="flex items-center  w-full justify-center">
          <ul className="flex flex-wrap p-4 justify-center">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <li key={task.id}>
                  <Card className="w-96 m-2">
                    <CardHeader>
                      <CardTitle>{task.title}</CardTitle>
                      <CardDescription>
                        <p>
                          <strong>Criado em: </strong>
                          {` ${task.createdAt.dataFormatada} às ${task.createdAt.horaFormatada}`}
                        </p>
                        <p>
                          <strong>Última atualização: </strong>
                          {`${task.updatedAt.dataFormatada} às ${task.updatedAt.horaFormatada}`}
                        </p>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="flex items-center ">
                            <p className="text-ellipsis overflow-hidden h-[200px]">
                              {task.description}
                            </p>
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{task.title}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {task.description}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2">
                            <Button
                              variant={"outline"}
                              className={`
                                ${
                                  task.status === "COMPLETED"
                                    ? "bg-lime-500 hover:bg-lime-500"
                                    : task.status === "IN_PROGRESS"
                                    ? "bg-blue-500 hover:bg-blue-500"
                                    : "bg-yellow-500 hover:bg-yellow-500"
                                }
                                  text-zinc-50
                                  hover:text-zinc-50
                                  cursor-default
                                  `}
                            >
                              {task.status === "COMPLETED"
                                ? "Concluído"
                                : task.status === "PENDING"
                                ? "Pendente"
                                : "Em progresso"}
                            </Button>
                            <AlertDialogCancel>Fechar</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                    <CardFooter className="flex items-center justify-center gap-3">
                      <Select
                        value={task.status}
                        onValueChange={(value) =>
                          handleStatusChange(Number(task.id), value)
                        }
                      >
                        <SelectTrigger
                          className={`min-w-[128px] text-center col-span-3 text-zinc-50 ${
                            task.status === "COMPLETED"
                              ? "bg-lime-500"
                              : task.status === "IN_PROGRESS"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel id="status">Status</SelectLabel>
                            <SelectItem value="COMPLETED">Concluído</SelectItem>
                            <SelectItem value="PENDING">Pendente</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              Em progresso
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="bg-amber-500"
                            onClick={() => handleEditClick(task)}
                          >
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                          <DialogHeader>
                            <DialogTitle>Editar Tarefa</DialogTitle>
                            <DialogDescription>
                              Faça alterações em sua tarefa aqui. Clique em
                              salvar quando você terminar.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="title" className="text-right">
                                Título
                              </Label>
                              <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="description"
                                className="text-right"
                              >
                                Descrição
                              </Label>
                              <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3 min-h-[200px]"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="status" className="text-right">
                                Status
                              </Label>
                              <Select
                                value={status}
                                onValueChange={(value) => setStatus(value)}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Selecione o status da tarefa" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel id="status">
                                      Status
                                    </SelectLabel>
                                    <SelectItem value="COMPLETED">
                                      Concluído
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                      Pendente
                                    </SelectItem>
                                    <SelectItem value="IN_PROGRESS">
                                      Em progresso
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="submit" onClick={handleSaveChanges}>
                                Salvar Alterações
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="destructive">Deletar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Você deseja mesmo excluir esta tarefa?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isto irá
                              permanentemente excluir sua tarefa e removê-la de
                              nosso servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600"
                              onClick={() => handleDeleteTask(Number(task.id))}
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                </li>
              ))
            ) : (
              <ItemNotFound />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
