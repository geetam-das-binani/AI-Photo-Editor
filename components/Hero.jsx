import React, { useEffect, useState } from "react";

const Hero = () => {
  const [textVisible, setTextVisible] = useState(false);
  const [demoHovered, setDemoHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTextVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="text-center z-10 px-6">
        <div
          className={`transition-all transform duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-6xl md:text-9xl tracking-tight mb-6 font-black">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent  animate-pulse">
              Create
            </span>
            <br />
            <span>Without Limits</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            {" "}
            Professional image editing powered by AI. Crop, resize, adjust
            colors, remove backgrounds, and enhance your images with
            cutting-edge technology.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
