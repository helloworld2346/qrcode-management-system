import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { useLogin } from "@/features/auth/auth.hooks";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginValues) => {
    mutate(
      { userName: values.username, password: values.password },
      { onSuccess: () => navigate("/dashboard") },
    );
  };

  const inputClass =
    "peer block w-full border-0 border-b-2 border-border bg-transparent px-8 pt-6 pb-2 text-lg text-text placeholder-transparent transition-colors focus:border-primary focus:outline-none";
  const labelClass =
    "pointer-events-none absolute left-8 top-4 text-base text-text text-opacity-50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-1 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:text-xs";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative mb-1">
        <FiUser className="absolute left-0 top-5 text-primary" size={20} />
        <input
          id="username"
          className={inputClass}
          placeholder="Nhập tên đăng nhập"
          autoComplete="username"
          {...register("username")}
        />
        <label htmlFor="username" className={labelClass}>
          Tên đăng nhập
        </label>
      </div>
      {errors.username ? (
        <p className="mb-4 pl-8 text-sm text-red-500">
          Vui lòng nhập tên đăng nhập
        </p>
      ) : (
        <div className="mb-7" />
      )}

      <div className="relative mb-1">
        <FiLock className="absolute left-0 top-5 text-primary" size={20} />
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          className={inputClass}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          {...register("password")}
        />
        <label htmlFor="password" className={labelClass}>
          Mật khẩu
        </label>
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-0 top-4 text-text text-opacity-50 hover:text-primary"
          aria-label="Hiện/ẩn mật khẩu"
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
      {errors.password ? (
        <p className="mb-4 pl-8 text-sm text-red-500">Vui lòng nhập mật khẩu</p>
      ) : (
        <div className="mb-7" />
      )}

      {error ? (
        <p className="mb-4 pl-8 text-sm text-accent">
          Tên đăng nhập hoặc mật khẩu không đúng.
        </p>
      ) : null}

      <Button
        type="submit"
        className="group flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-hover py-4 text-lg font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:translate-y-0"
        disabled={isPending}
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        <FiArrowRight
          className="ml-2 transition-transform group-hover:translate-x-1"
          size={20}
        />
      </Button>
    </form>
  );
}
