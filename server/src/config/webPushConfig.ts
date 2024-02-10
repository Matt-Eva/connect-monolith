import webPush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT;

webPush.setVapidDetails(vapidSubject!, publicKey!, privateKey!);

export default webPush;
