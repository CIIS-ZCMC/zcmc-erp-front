import { useEffect, useState } from "react";

export default function useResizeObserver(targetRef) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (targetRef.current) {
        const { width, height } = targetRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    if (targetRef.current) observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [targetRef]);

  return size;
}
