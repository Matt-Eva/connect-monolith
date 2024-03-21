import { useState } from "react";

import styles from "./CreateMainPost.module.css";

function CreateMainPost({
  mainContent,
  updateMainContent,
  mainContentLengthError,
  mainContentLinksText,
  mainContentLinksLinks,
  updateMainContentLinks,
  linkQuantityError,
  linkRepeatError,
}: {
  mainContent: string;
  updateMainContent: React.ChangeEventHandler<HTMLTextAreaElement>;
  mainContentLengthError: boolean;
  mainContentLinksText: string[];
  mainContentLinksLinks: string[];
  updateMainContentLinks: Function;
  linkQuantityError: boolean;
  linkRepeatError: boolean;
}) {
  const [linkText, setLinkText] = useState("");
  const [linkLink, setLinkLink] = useState("");

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    setLinkText("");
    setLinkLink("");
    updateMainContentLinks({ linkText, linkLink });
  };

  const displayLinks = mainContentLinksText.map((text, index) => {
    const href = mainContentLinksLinks[index];
    return (
      <a href={href} key={href}>
        {text}
      </a>
    );
  });

  return (
    <section className={styles.mainPost}>
      <h2 className={styles.h2}>Main Post</h2>
      <textarea
        className={styles.mainPostText}
        value={mainContent}
        onChange={updateMainContent}
      ></textarea>
      {mainContentLengthError ? (
        <p className={styles.textLimitError}>Character limit 300</p>
      ) : null}
      <section className={styles.linkDisplay}>{displayLinks}</section>
      <section className={styles.addLinks}>
        <h3 className={styles.h3}>Add Link</h3>
        <form onSubmit={addLink} className={styles.addLinksForm}>
          <label htmlFor="linkText">Link Text</label>
          <input
            type="text"
            placeholder="add link text"
            name="linkText"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
          <label htmlFor="hyperlink">Hyperlink</label>
          <input
            type="text"
            placeholder="add hyerplink"
            name="hyperlink"
            value={linkLink}
            onChange={(e) => setLinkLink(e.target.value)}
          />
          <input
            type="submit"
            value="Add Link"
            className={styles.addLinkButton}
          />
        </form>
        {linkQuantityError ? <p>Cannot add more than 5 links</p> : null}
        {linkRepeatError ? <p>Each link must be unique</p> : null}
      </section>
    </section>
  );
}

export default CreateMainPost;
