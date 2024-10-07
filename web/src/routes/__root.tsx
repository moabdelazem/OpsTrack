import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Home, CheckSquare, Archive, Sun, Moon, Menu, X } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //   const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  //   const handleLogout = () => {
  //     // Implement logout logic here
  //     console.log("Logging out...");
  //     navigate({ to: "/" });
  //   };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
      <nav className="bg-gray-100 dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" icon={<Home size={18} />} label="Dashboard" />
              <NavLink
                to="/todos"
                icon={<CheckSquare size={18} />}
                label="Todos"
              />
              <NavLink
                to="/archive"
                icon={<Archive size={18} />}
                label="Archive"
              />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              {/* <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <LogOut size={18} />
                Logout
              </button> */}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" icon={<Home size={18} />} label="Dashboard" />
            <MobileNavLink
              to="/todos"
              icon={<CheckSquare size={18} />}
              label="Todos"
            />
            <MobileNavLink
              to="/archive"
              icon={<Archive size={18} />}
              label="Archive"
            />
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              Toggle Theme
            </button>
            {/* <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <LogOut size={18} />
              Logout
            </button> */}
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 [&.active]:bg-gray-300 dark:[&.active]:bg-gray-600 [&.active]:text-black dark:[&.active]:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 [&.active]:bg-gray-300 dark:[&.active]:bg-gray-600 [&.active]:text-black dark:[&.active]:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}
