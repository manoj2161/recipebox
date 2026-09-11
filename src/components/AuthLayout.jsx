import logo from "../assets/logo.png";

export const AuthLayout = ({ title, message, children }) => (
  <main className="min-h-[100svh] bg-gray-50 font-['Kaushan_Script'] lg:grid lg:grid-cols-[40%_60%]">
    <section className="flex min-h-64 items-center justify-center rounded-b-[35%] bg-green-900 px-6 py-10 text-center text-white sm:min-h-72 lg:min-h-[100svh] lg:rounded-none">
      <div className="max-w-md">
        <img
          src={logo}
          alt="RecipeBox logo"
          className="mx-auto size-28 object-contain sm:size-32 lg:size-40"
        />
        <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-lg leading-7 sm:text-xl lg:text-2xl">
          {message}
        </p>
      </div>
    </section>
    <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
      <div className="w-full max-w-xl">{children}</div>
    </section>
  </main>
);
