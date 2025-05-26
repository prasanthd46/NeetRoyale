import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const powerUps = [
  { icon: "🪙", name: "Gold Boost" },
  { icon: "💡", name: "Hint" },
  { icon: "⏳", name: "Time Warp" },
  { icon: "❄️", name: "Freeze" },
];

export default function PowerUps() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  useEffect(() => {
    if (hoveredIndex === null || !containerRef.current || !labelRef.current)
      return;

    const icons = containerRef.current.querySelectorAll(".icon-wrapper");
    const target = icons[hoveredIndex] as HTMLElement;
    const containerRect = containerRef.current.getBoundingClientRect();
    const iconRect = target.getBoundingClientRect();
    const labelWidth = labelRef.current.offsetWidth;

    const centerX =
      iconRect.left - containerRect.left + iconRect.width / 2 - labelWidth / 2;
    setX(centerX);
  }, [hoveredIndex]);

  return (
    <div className="flex flex-col items-center mt-10 text-white gap-10">
      <h2 className="text-3xl font-bold italic ">
        Power <span className="text-purple-500">Ups</span>
      </h2>
      <p className="italic mt-2 text-center text-xl">
        Turn the tide of battle with strategic boosts. Unlock your edge when it
        matters most.
      </p>

      <div className="relative mt-10">
     
        <div
          ref={containerRef}
          className="flex gap-16 justify-center items-center relative"
        >
          {powerUps.map((item, index) => (
            <motion.div
              key={index}
              className="icon-wrapper text-3xl cursor-pointer select-none bg-white/10 p-4 rounded-[10px]"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                scale: 1.2,
                color: "white",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.7)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              initial={{ scale: 1, color: "#fffff", textShadow: "none" }}
              transition={{ type: "spring", stiffness: 500, damping: 85 }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

   
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              ref={labelRef}
              key="hover-label"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                x,
                opacity: 1,
                y: -10,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                  ease: "easeOut",
                },
              }}
              exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
              className="absolute top-20 bg-white text-purple-500 text-sm font-normal  italic px-3 py-1 rounded-full  pointer-events-none select-none"
              style={{
                position: "absolute",
                whiteSpace: "nowrap",
              }}
            >
              {powerUps[hoveredIndex].name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
