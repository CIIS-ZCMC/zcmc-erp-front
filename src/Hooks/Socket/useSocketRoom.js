import { useEffect, useCallback } from "react";
import { socket } from "../../Services/Socket";

/**
 * Custom hook to handle room join and leave events with automatic reconnect support.
 *
 * @param {string} joinEvent - Event name emitted to join (e.g. "ppmp:join").
 * @param {string} leaveEvent - Event name emitted to leave (e.g. "ppmp:leave").
 * @param {Object} payload - Object containing room ID or join details (e.g. { ppmpId: 123 }).
 * @param {boolean} [enabled=true] - Optional boolean flag to conditionally enable/disable room subscription.
 */
export const useSocketRoom = (joinEvent, leaveEvent, payload, enabled = true) => {
  const payloadKey = JSON.stringify(payload);

  const join = useCallback(() => {
    if (socket && joinEvent && payload) {
      socket.emit(joinEvent, payload);
    }
  }, [joinEvent, payloadKey]);

  useEffect(() => {
    if (!socket || !enabled || !payload) return;

    // Join room initially
    join();

    // Re-join on socket reconnection
    const handleReconnect = () => {
      join();
    };

    socket.on("connect", handleReconnect);

    return () => {
      if (leaveEvent) {
        socket.emit(leaveEvent, payload);
      }
      socket.off("connect", handleReconnect);
    };
  }, [joinEvent, leaveEvent, payloadKey, enabled, join]);
};

export default useSocketRoom;
