const userFocus = {
  focused: false,
};

self.addEventListener("push", (event) => {
  const data = event.data.json();

  console.log(data);

  if (!userFocus.focused) {
    self.registration.showNotification(data.title, {
      body: data.body,
    });
  }
});

self.addEventListener("message", (event) => {
  console.log("sw user focus", userFocus.focused);

  if (event.data && event.data.type === "focusState") {
    userFocus.focused = event.data.isFocused;
  }
});
