import { useEffect, useRef } from "react";
import { socket } from "../../Services/Socket";

/**
 * Custom hook to subscribe to a Socket.io event with automatic lifecycle cleanup.
 *
 * @param {string} eventName - The socket event name to listen for.
 * @param {Function} handler - The callback function when the event is triggered.
 * @param {boolean} [enabled=true] - Optional boolean flag to conditionally enable/disable listener.
 */
export const useSocketEvent = (eventName, handler, enabled = true) => {
  const savedHandler = useRef(handler);

  // Keep saved handler up to date without re-subscribing
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket || !eventName || !enabled) return;

    const eventListener = (...args) => {
      if (savedHandler.current) {
        savedHandler.current(...args);
      }
    };

    socket.on(eventName, eventListener);

    return () => {
      socket.off(eventName, eventListener);
    };
  }, [eventName, enabled]);
};

export default useSocketEvent;
