import React from 'react'
import { ArrowRight, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-24 text-sm text-[#CDE5DD] text-center z-10 flex flex-col items-center gap-4">
        <div className="flex gap-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            <Twitter size={24} />
          </a>
        </div>
        <p>
          Sistema Bancario | <strong className="text-[#9AF241]">Banco Albora</strong> <br />
          Equipo Desarrollador | Digital Fact <br />
          © {new Date().getFullYear()} Banco Albora (BA). Todos los derechos reservados.
        </p>
      </footer>
  )
}
