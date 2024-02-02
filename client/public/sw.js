self.addEventListener("push", (event) => {
  const data = event.data.json();

  console.log(data);

  self.registration.showNotification(data.title, {
    body: data.body,
  });
});
