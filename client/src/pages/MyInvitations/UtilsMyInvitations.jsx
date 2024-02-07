import InvitationCard from "../../components/InvitationCard/InvitationCard";

import styles from "./MyInvitations.module.css";

const fetchInvitations = async ({ setInvitations, setLoading }) => {
  try {
    const res = await fetch("/api/my-invitations", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();

      setInvitations(data);
      setLoading(false);
    }
  } catch (e) {
    console.error(e);
  }
};

const displayInvitations = ({ invitations }) => {
  if (invitations.length === 0) {
    return (
      <p className={styles.noInvitation}>You have no pending invitations.</p>
    );
  }
  return invitations.map((invitation) => (
    <InvitationCard key={invitation.uId} {...invitation} />
  ));
};

export { fetchInvitations, displayInvitations };
