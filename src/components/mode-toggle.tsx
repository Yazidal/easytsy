import { motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  
  // Cycle through themes: system → light → dark → system
  const cycleTheme = () => {
    const themes = ["system", "light", "dark"];
    const currentIndex = themes.indexOf(theme ?? "system");
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className="relative h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      title={`Current theme: ${theme}. Click to cycle themes.`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "system" ? 0 : isDark ? 0 : 180
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10
        }}
        className="relative w-5 h-5"
      >
        {/* System icon */}
        <motion.div
          animate={{
            opacity: theme === "system" ? 1 : 0,
            y: theme === "system" ? 0 : -20
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </motion.div>
        
        {/* Moon icon */}
        <motion.div
          animate={{
            opacity: theme === "dark" ? 1 : 0,
            y: theme === "dark" ? 0 : -20
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Moon className="w-5 h-5 text-blue-900 dark:text-yellow-200" />
        </motion.div>
        
        {/* Sun icon */}
        <motion.div
          animate={{
            opacity: theme === "light" ? 1 : 0,
            y: theme === "light" ? 0 : 20
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          <Sun className="w-5 h-5 text-yellow-500" />
        </motion.div>
      </motion.div>
      
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-md opacity-0"
        animate={{
          boxShadow: theme === "system"
            ? "0 0 8px 2px rgba(96, 165, 250, 0.3)"
            : isDark 
              ? "0 0 8px 2px rgba(186, 230, 253, 0.3)" 
              : "0 0 8px 2px rgba(254, 240, 138, 0.3)",
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
    </motion.button>
  );
}