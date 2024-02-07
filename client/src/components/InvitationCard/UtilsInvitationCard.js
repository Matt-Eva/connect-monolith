const accept = async ({ uId, setResponded, setConnected }) => {
  try {
    const res = await fetch("/api/accept-invitation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectionId: uId }),
    });
    if (res.ok) {
      setConnected(true);
      setResponded(true);
    }
  } catch (e) {
    console.error(e);
  }
};

const ignore = async ({ uId, setResponded, setIgnored }) => {
  try {
    const res = await fetch("/api/ignore-invitation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectionId: uId }),
    });
    if (res.ok) {
      setResponded(true);
      setIgnored(true);
    }
  } catch (e) {
    console.error(e);
  }
};

const block = async ({ uId, setBlocked, setResponded }) => {
  try {
    const res = await fetch("/api/block-user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: uId }),
    });
    if (res.ok) {
      setResponded(true);
      setBlocked(true);
    }
  } catch (e) {
    console.error(e);
  }
};

export { accept, ignore, block };
