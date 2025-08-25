import React from "react";

export default function BotonPrimario({ texto, onClick, className = "", type = "button" }) {
    const baseClasses =
        "bg-blue-500 px-3 py-2 text-white rounded font-semibold hover:bg-blue-700 shadow-lg transition duration-300 ease-in-out transform hover:scale-105";

    return (
        <button
            type={"submit"}  // 👉 importante: puede ser "submit" en formularios
            className={`${baseClasses} ${className}`}
            onClick={onClick}
        >
            {texto}
        </button>
    );
}
