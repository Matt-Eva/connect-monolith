const userFocus = {
  isFocused: false,
};

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", async (event) => {
  const data = event.data.json();

  if (!userFocus.isFocused) {
    const notifications = await self.registration.getNotifications();
    notifications.forEach(async (notification) => {
      if (notification.data.chatId === data.chatId) {
        await notification.close();
      }
    });
    self.registration.showNotification(data.title, {
      body: data.body,
      data: {
        chatId: data.chatId,
      },
    });
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "focusState") {
    userFocus.isFocused = event.data.isFocused;
  }
});
