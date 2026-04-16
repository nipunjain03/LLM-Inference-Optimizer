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
          pointerEvents: "auto"
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
          width: "384px",
          minHeight: "300px",
          maxHeight: "90vh",
          backgroundColor: "#18181b",
          border: "1px solid #27272a",
          borderRadius: "8px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "24px",
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
          fontSize: "18px",
          fontWeight: "600",
          color: "#f4f4f5",
          marginBottom: "16px",
          margin: "0 0 16px 0",
          padding: "0",
          transition: "none"
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
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textAlign: "left",
                  border: "1px solid",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#4f46e5" : isHovered ? "#27272a" : "#18181b",
                  color: isSelected ? "#ffffff" : "#e4e4e7",
                  borderColor: isSelected ? "#4338ca" : isHovered ? "#3f3f46" : "#27272a",
                  transition: "none",
                  margin: 0,
                  font: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  transition: "none"
                }}>
                  <p style={{
                    fontWeight: "500",
                    margin: 0,
                    padding: 0,
                    lineHeight: "1.2",
                    transition: "none"
                  }}>
                    {t.label}
                  </p>
                  <p style={{
                    fontSize: "14px",
                    opacity: 0.75,
                    margin: 0,
                    padding: 0,
                    lineHeight: "1.2",
                    transition: "none"
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
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#18181b",
            color: "#e4e4e7",
            border: "1px solid #27272a",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "none",
            margin: 0,
            font: "inherit"
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
