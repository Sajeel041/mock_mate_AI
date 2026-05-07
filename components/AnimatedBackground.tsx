"use client";

const AnimatedBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-[#05060a]" />

      <div className="absolute inset-0 grid-bg radial-fade opacity-60" />

      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full blur-[120px] opacity-40 animate-blob"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #6d6dfb, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 animate-blob"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, #cac5fe, transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="absolute bottom-[-200px] left-1/4 w-[480px] h-[480px] rounded-full blur-[120px] opacity-30 animate-blob"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #4c4ce8, transparent 70%)",
          animationDelay: "-12s",
        }}
      />

      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
