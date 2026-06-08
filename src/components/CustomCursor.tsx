import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    // Create dot element outside React tree, direct child of body
    // so position:fixed is always relative to the viewport.
    const dot = document.createElement("div");

    const base = "position:fixed;left:0;top:0;pointer-events:none;border-radius:50%;";
    dot.style.cssText = `${base}width:8px;height:8px;background:var(--primary);z-index:9999;opacity:0;transition:opacity .15s;mix-blend-mode:difference;`;

    document.body.appendChild(dot);

    let x = -200, y = -200;
    let visible = false;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        dot.style.opacity = "1";
        visible = true;
      }
    };

    const tick = () => {
      // Dot snaps instantly — translate so center is at (x, y)
      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (document.body.contains(dot)) document.body.removeChild(dot);
    };
  }, []);

  // Renders nothing into the React tree — element lives directly on <body>
  return null;
}