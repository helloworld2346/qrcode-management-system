import loginHero from "@/assets/images/login-hero.jpg";
import logo from "@/assets/images/logo.png";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-primary to-primary-hover dark:from-bg dark:to-surface">
      <svg
        className="wave-layer wave-back text-white text-opacity-20"
        viewBox="0 0 2880 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,160 C240,80 480,240 720,160 C960,80 1200,240 1440,160 C1680,80 1920,240 2160,160 C2400,80 2640,240 2880,160 L2880,320 L0,320 Z"
        />
      </svg>
      <svg
        className="wave-layer wave-mid text-white text-opacity-30"
        viewBox="0 0 2880 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,200 C240,140 480,260 720,200 C960,140 1200,260 1440,200 C1680,140 1920,260 2160,200 C2400,140 2640,260 2880,200 L2880,320 L0,320 Z"
        />
      </svg>
      <svg
        className="wave-layer wave-front text-white text-opacity-40"
        viewBox="0 0 2880 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,240 C240,200 480,280 720,240 C960,200 1200,280 1440,240 C1680,200 1920,280 2160,240 C2400,200 2640,280 2880,240 L2880,320 L0,320 Z"
        />
      </svg>

      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface shadow-2xl lg:min-h-[640px] lg:flex-row">
          <div className="relative h-72 w-full lg:h-auto lg:w-1/2">
            <img
              src={loginHero}
              alt=""
              className="absolute left-0 top-0 h-full w-full object-cover"
            />
            <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-tr from-primary-hover to-transparent opacity-40 dark:from-bg dark:opacity-60" />

            <div className="absolute top-0 left-0 w-full p-8 lg:p-10">
              <div className="rounded-2xl bg-black bg-opacity-25 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center">
                  <span className="mr-3 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-md">
                    SƯ ĐOÀN 5
                  </span>
                  <span className="h-px flex-1 bg-white bg-opacity-30" />
                </div>
                <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-lg lg:text-4xl">
                  Hệ thống quản lý QR
                </h2>
                <div className="my-3 h-1 w-16 rounded-full bg-accent" />
                <p className="max-w-sm text-sm leading-relaxed text-white text-opacity-90 drop-shadow">
                  Quản lý, quét và in mã QR nhanh chóng, tập trung và bảo mật.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-14">
            <div className="mb-8 flex items-center justify-center">
              <img
                src={logo}
                alt="SƯ ĐOÀN 5"
                className="mr-2 h-32 w-32 rounded-2xl"
              />
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-xl font-bold uppercase tracking-widest text-primary">
                Đăng nhập hệ thống
              </h1>
              <p className="mt-1 text-sm text-text opacity-70">
                Đăng nhập để tiếp tục
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
