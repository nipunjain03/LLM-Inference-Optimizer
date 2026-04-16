"use client";

import React from "react";
import { useTheme, type Theme } from "@/hooks/useTheme";

interface ThemeSwitcherProps {
  onClose: () => void;
}

export function ThemeSwitcher({ onClose }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();
  const [hoveredTheme, setHoveredTheme] = React.useState<Theme | null>(null);

  const themes: Array<{ id: Theme; label: string; description: string }> = [
    {
      id: "xp",
      label: "XP Theme",
      description: "Classic UI style",
    },
    {
      id: "modern",
      label: "Modern Theme",
      description: "Glassmorphism design",
    },
  ];

  return (
    <>
      {/* Backdrop - No transitions */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        style={{
          pointerEvents: "auto",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)"
        }}
      />

      {/* Modal - Strictly Fixed and Perfectly Centered */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) translateZ(0) perspective(1000px)",
          zIndex: 50,
          width: "420px",
          minHeight: "300px",
          maxHeight: "90vh",
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          boxShadow: "0 16px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          padding: "28px",
          boxSizing: "border-box",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          pointerEvents: "auto",
          overflow: "hidden",
          margin: "0",
          display: "block",
          transition: "none"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#e2e8f0",
          marginBottom: "20px",
          margin: "0 0 24px 0",
          padding: "0",
          transition: "none",
          letterSpacing: "0.5px"
        }}>
          Choose Theme
        </h2>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          transition: "none"
        }}>
          {themes.map((t) => {
            const isSelected = theme === t.id;
            const isHovered = hoveredTheme === t.id;
            
            return (
              <button
                key={t.id}
                onClick={() => {
                  toggleTheme(t.id);
                  onClose();
                }}
                onMouseEnter={() => setHoveredTheme(t.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  textAlign: "left",
                  border: "1px solid",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "linear-gradient(135deg, #3b82f6, #2563eb)" : isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.05)",
                  color: isSelected ? "#ffffff" : "#e2e8f0",
                  borderColor: isSelected ? "rgba(59, 130, 246, 0.5)" : isHovered ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.08)",
                  transition: "none",
                  margin: 0,
                  font: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: isSelected ? "0 8px 24px rgba(59, 130, 246, 0.2)" : "0 4px 12px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  transition: "none"
                }}>
                  <p style={{
                    fontWeight: "600",
                    margin: 0,
                    padding: 0,
                    lineHeight: "1.3",
                    transition: "none",
                    color: "#e2e8f0",
                    fontSize: "15px"
                  }}>
                    {t.label}
                  </p>
                  <p style={{
                    fontSize: "15px",
                    opacity: 0.7,
                    margin: 0,
                    padding: 0,
                    lineHeight: "1.3",
                    transition: "none",
                    color: "#cbd5e1"
                  }}>
                    {t.description}
                  </p>
                </div>
                {isSelected && (
                  <div style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginLeft: "12px",
                    transition: "none"
                  }} />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px 18px",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            color: "#e2e8f0",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "none",
            margin: "20px 0 0 0",
            font: "inherit",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#27272a";
            e.currentTarget.style.borderColor = "#3f3f46";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#18181b";
            e.currentTarget.style.borderColor = "#27272a";
          }}
        >
          Close
        </button>
      </div>
    </>
  );
}
