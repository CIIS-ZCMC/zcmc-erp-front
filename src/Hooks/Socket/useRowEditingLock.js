import { useState, useCallback } from "react";
import { emitToEvent } from "../../Services/Socket";
import { useSocketEvent } from "./useSocketEvent";
import { useSocketRoom } from "./useSocketRoom";

/**
 * Unified custom hook for managing real-time item editing locks over Socket.io.
 *
 * @param {Object} config
 * @param {Object} config.room - { joinEvent, leaveEvent, payload }
 * @param {Object} config.events - { lock, unlock, editing, editingStopped, locked }
 * @param {string} [config.idKey="id"] - Primary ID property in event payloads (e.g., "rowId", "objectiveId", "activityId")
 * @param {string} [config.startEditEvent] - Socket event emitted when a user starts editing an item
 * @param {string} [config.stopEditEvent] - Socket event emitted when a user stops editing an item
 * @param {string|number} config.currentUserId - ID of current logged-in user
 * @param {string} [config.currentUserName] - Name of current logged-in user
 * @param {Function} [config.onNotify] - Optional snackbar notification handler callback (status, message)
 * @param {Function} [config.getItemKey] - Optional custom key extractor for composite keys
 * @param {boolean} [config.enabled=true] - Toggle to enable or disable lock listeners
 */
export const useRowEditingLock = ({
  room,
  events,
  idKey = "id",
  startEditEvent,
  stopEditEvent,
  currentUserId,
  currentUserName,
  onNotify,
  getItemKey,
  enabled = true,
}) => {
  const [lockedRows, setLockedRows] = useState({});

  // 1. Room joining/leaving & automatic reconnect handling
  useSocketRoom(
    room?.joinEvent,
    room?.leaveEvent,
    room?.payload,
    enabled && Boolean(room?.joinEvent && room?.payload)
  );

  // Helper to extract item key
  const getKey = useCallback(
    (data) => {
      if (!data) return null;
      if (getItemKey) return getItemKey(data);
      return data[idKey] ?? data.id;
    },
    [getItemKey, idKey]
  );

  // 🔒 Add lock
  const addLock = useCallback(
    (data) => {
      const key = getKey(data);
      if (!key) return;
      setLockedRows((prev) => ({
        ...prev,
        [key]: {
          editorId: data.editorId,
          editorName: data.editorName,
          ...data,
        },
      }));
    },
    [getKey]
  );

  // 🔓 Remove lock
  const removeLock = useCallback(
    (data) => {
      const key = getKey(data);
      if (!key) return;
      setLockedRows((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    },
    [getKey]
  );

  // 🔔 Event listeners
  useSocketEvent(
    events?.lock,
    (data) => addLock(data),
    enabled && Boolean(events?.lock)
  );

  useSocketEvent(
    events?.unlock,
    (data) => removeLock(data),
    enabled && Boolean(events?.unlock)
  );

  useSocketEvent(
    events?.editing,
    (data) => {
      const key = getKey(data);
      if (onNotify && data?.editorName && key) {
        onNotify(401, `${data.editorName} is editing item #${key}`);
      }
    },
    enabled && Boolean(events?.editing)
  );

  useSocketEvent(
    events?.editingStopped,
    (data) => {
      removeLock(data);
      if (onNotify) {
        onNotify(200, "Editing finished");
      }
    },
    enabled && Boolean(events?.editingStopped)
  );

  useSocketEvent(
    events?.locked,
    (data) => {
      addLock(data);
      const key = getKey(data);
      if (onNotify && data?.editorName) {
        onNotify(
          401,
          `Item #${key || ""} is currently being edited by ${data.editorName}`
        );
      }
    },
    enabled && Boolean(events?.locked)
  );

  // Start edit lock trigger
  const startEditLock = useCallback(
    (itemId, extraData = {}) => {
      if (!startEditEvent || !itemId) return;
      emitToEvent(startEditEvent, {
        ...(room?.payload || {}),
        [idKey]: itemId,
        userId: currentUserId,
        name: currentUserName,
        ...extraData,
      });
    },
    [startEditEvent, room?.payload, idKey, currentUserId, currentUserName]
  );

  // Stop edit lock trigger
  const stopEditLock = useCallback(
    (itemId, extraData = {}) => {
      if (!stopEditEvent || !itemId) return;
      emitToEvent(stopEditEvent, {
        ...(room?.payload || {}),
        [idKey]: itemId,
        userId: currentUserId,
        ...extraData,
      });
      removeLock({ [idKey]: itemId });
    },
    [stopEditEvent, room?.payload, idKey, currentUserId, removeLock]
  );

  // Check lock state for item
  const isLockedByOther = useCallback(
    (itemId) => {
      const lock = lockedRows[itemId];
      return Boolean(lock && String(lock.editorId) !== String(currentUserId));
    },
    [lockedRows, currentUserId]
  );

  const getLockState = useCallback(
    (itemId) => {
      const lock = lockedRows[itemId];
      return {
        lock,
        isLockedByOther: Boolean(
          lock && String(lock.editorId) !== String(currentUserId)
        ),
      };
    },
    [lockedRows, currentUserId]
  );

  const resetLocks = useCallback(() => {
    setLockedRows({});
  }, []);

  return {
    lockedRows,
    setLockedRows,
    startEditLock,
    stopEditLock,
    isLockedByOther,
    getLockState,
    resetLocks,
  };
};

export default useRowEditingLock;
