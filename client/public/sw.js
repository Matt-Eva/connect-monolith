const userFocus = {
  isFocused: false,
};

self.addEventListener("push", (event) => {
  const data = event.data.json();

  console.log("push event", userFocus);

  if (!userFocus.isFocused) {
    self.registration.showNotification(data.title, {
      body: data.body,
    });
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "focusState") {
    userFocus.isFocused = event.data.isFocused;
    console.log(userFocus);
  }
});
