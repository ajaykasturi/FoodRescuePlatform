import React from "react";

export default function FoodRecueTitle({
  className = "text-xl",
  firstText = "Food",
  secondText = "Rescue",
  mainClass = "py-5 px-4",
}) {
  return (
    <>
      {" "}
      <div className={`w-full ${mainClass}`}>
        <h1 className={`${className} font-black text-center tracking-tigh`}>
          <span className="inline-block transform -rotate-2 bg-linear-to-br from-green-400 via-green-300 to-green-400 text-transparent bg-clip-text drop-shadow-lg">
            {firstText}
          </span>{" "}
          <span className="inline-block transform rotate-1 bg-linear-to-br from-green-400 via-green-300 to-green-400 text-transparent bg-clip-text drop-shadow-lg">
            {secondText}
          </span>
        </h1>

        <style
          className={`
          h1 span {
            font-family: "Arial Black", "Arial Bold", sans-serif;
            font-weight: 900;
            letter-spacing: 0.02em;
            text-shadow: 2px 2px 4px rgba(244, 114, 182, 0.3);
          }
        `}
        ></style>
      </div>
    </>
  );
}
