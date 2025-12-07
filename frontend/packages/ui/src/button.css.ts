import { style } from "@vanilla-extract/css";

const button = style({
  background: "linear-gradient(135deg,#5a2cf0,#8f5aff)",
  color: "#fff",
  border: "none",
  padding: ".65rem 1.05rem",
  fontSize: ".9rem",
  fontWeight: 600,
  borderRadius: 8,
  cursor: "pointer",
  ":hover": {
    background: "linear-gradient(135deg,#6131ff,#9a68ff)",
  },
  ":active": {
    transform: "translateY(2px)",
    boxShadow: "0 2px 4px rgba(0,0,0,.35)",
  },
  ":focus-visible": {
    outline: "2px solid #c9b8ff",
    outlineOffset: "2px",
  },
  ":disabled": {
    opacity: ".55",
    cursor: "not-allowed",
  },
});


export { button };