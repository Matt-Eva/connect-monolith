const fetchConnections = async ({ setConnections, dispatch }) => {
  try {
    const res = await fetch("/api/my-connections", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(setConnections(data));
    } else {
      throw new Error("problem");
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchConnections };
