'use client';

import { login } from "@/server/auth";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

interface dataType {
  username: string
  password: string
}

const LoginPage = () => {

  const [data, setData] = useState<dataType>({
    username: "",
    password: ""
  })
  const router = useRouter()
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess(data){
      console.log(data)
      router.push("/admin/dashboard")
    },
    onError(error) {
      console.error(error);
    },
  }) 

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value, name} = e.target

    setData(prev => ({...prev, [name] : value}))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    loginMutation.mutate(data)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome Back
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to your account
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              value={data.username}
              onChange={handleChange}
              id="username"
              type="text"
              name="username"
              autoComplete="off"
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              autoComplete="off"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        {loginMutation.isError && <p className="text-sx text-red-500 text-center my-1">{loginMutation.error.message}</p> }
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-blue-600 transition hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;