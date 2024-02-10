const addConnection = async ({
  uId,
  setPendingInvite,
}: {
  uId: string;
  setPendingInvite: Function;
}) => {
  try {
    const res = await fetch("/api/invite-connection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ connectionId: uId }),
    });
    if (res.ok) {
      setPendingInvite(true);
    } else {
      const error = await res.json();
      console.log(error);
    }
  } catch (e) {
    console.error(e);
  }
};

const acceptInvitation = async ({
  uId,
  setConnected,
}: {
  uId: string;
  setConnected: Function;
}) => {
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
    }
  } catch (e) {
    console.error(e);
  }
};

export { addConnection, acceptInvitation };
