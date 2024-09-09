import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import logo from "../assets/image/logo.png"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome é obrigatório",
    })
    .max(50, {
      message: "Nome deve ter menos que 50 caracteres",
    }),
  email: z
    .string()
    .min(2, {
      message: "Email precisa ter mais que 2 caracteres",
    })
    .max(50, {
      message: "Email precisa ter menos que 50 caracteres",
    })
    .email({
      message: "Email inválido",
    }),

  password: z
    .string()
    .min(8, {
      message: "Senha precisa ter pelo menos 8 caracteres",
    })
    .max(100, {
      message: "Senha precisa ter menos que 100 caracteres",
    })
    .regex(/[A-Z]/, {
      message: "Senha precisa ter pelo menos uma letra maiúscula",
    })
    .regex(/[a-z]/, {
      message: "Senha precisa ter pelo menos uma letra minúscula",
    })
    .regex(/[0-9]/, {
      message: "Senha precisa ter pelo menos um número",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Senha precisa ter pelo menos um caractere especial",
    }),
});

export function Register() {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      const response = await axios.post("http://localhost:3001/auth/register",{
        name:values.name,
        email: values.email,
        password: values.password
      })
      navigate('/login')
    }catch (error) {
      console.error("Erro de autenticação:", error.response?.data || error.message);
    }
    
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex flex-col justify-center items-center" >
            <img  className="w-24 py-3" src={logo}/>
            <p className="text-center text-2xl">Registrar no Taskapp</p>
          </CardTitle>
          <CardDescription className="text-center text-base">
            <p>
              Crie, edite e organize tarefas com facilidade. Torne sua vida mais
              simples e organizada!
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="João Pedro" {...field} />
                    </FormControl>
                    <FormDescription>Digite seu nome completo.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Digite seu endereço de email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormDescription>Digite sua senha.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Registrar agora!
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>
            Já possui uma conta?{" "}
            <a className="font-bold" href="/login">
              Entre aqui!
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
