export const playNotificationSound = (notif) => {
  const audio = new Audio(notif);
  audio.play();
};
