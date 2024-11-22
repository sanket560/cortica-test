"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/Context/GlobalContext";
import { FiUser } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { setIsLoggedIn, userInfo, setUserInfo } = useContext(GlobalContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserInfo(null);
    setIsLoggedIn(false);
    router.push("/");
    window.location.reload();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Cortica-Test
        </Link>
        <div className="relative">
          {userInfo ? (
            <>
              <div className="flex items-center justify-center gap-3">
              <p className="text-white border px-2 py-1 rounded-md">{userInfo?.name}</p>
              <FiUser
                onClick={() => setIsOpen(!isOpen)}
                className="text-white cursor-pointer text-3xl"
              />
              </div>
              {isOpen && (
                <div className="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg py-1">
                  {userInfo.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link href="/login" className="text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
