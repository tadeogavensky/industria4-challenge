import React from "react";

export const Navbar = (props) => {
  return (
    <div className="w-screen flex justify-between items-center bg-white shadow-md gap-3 py-3 px-20">
      <p className="text-md font-semibold">{props.credential.email}</p>

      <div className="flex flex-col items-center">
        <p>Welcome!</p>
        <p className="text-2xl font-semibold">{props.credential.name}</p>
      </div>
      <div className="w-16">
        <img
          src={props.credential.picture}
          className="w-full object-contain rounded-full"
          alt=""
        />
      </div>
    </div>
  );
};
