"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const NavBar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-4 z-30 mx-auto w-full"
    >
      <div className="glass rounded-full px-5 py-2.5 flex items-center justify-between max-w-fit mx-auto">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary-200/50 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/logo.svg"
              alt="MockMate Logo"
              width={32}
              height={28}
              className="relative transition-transform duration-500 group-hover:rotate-[12deg]"
            />
          </div>
          <h2 className="text-gradient text-xl font-bold">MockMate</h2>
        </Link>
      </div>
    </motion.nav>
  );
};

export default NavBar;
