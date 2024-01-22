import styles from "./About.module.css"

function About() {
  return (
    <main className={styles.main}>
      <h2>About Connect</h2>
      <section className={styles.content}>
        <p>Connect is a nonprofit, free to use social media and chat application.</p>
        <p>We are funded entirely by user donations, and do not advertise on our platform.</p>
        <p>We aim to provide a simple, feature-rich user experience that doesn't rely on obscure algorithms or recommendation patterns.</p>
        <p>We also do not sell or share your data <em>ever</em>, and only collect the data that you input directly into our app.</p>
        <p>Connect is still in its early stages of development. Currently, we only support searching for, connecting with, and chatting with other users, but we have a lot of features we want to build! Our hope is to meet the needs of all types of social media users, from regular people looking to connect with their friends, family, and acquaintances, to businesses, artists, and public personas who want to connect with and grow their audiences. Stay tuned for more features!</p>
      </section>
    </main>
  )
}

export default About