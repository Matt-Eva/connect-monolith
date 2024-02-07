const fetchConnections = async ({ setConnections }) => {
  try {
    const res = await fetch("/api/my-connections", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setConnections(data);
    } else {
      throw new Error("problem");
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchConnections };
