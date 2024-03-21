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
  clearLinkRepeatError,
}: {
  mainContent: string;
  updateMainContent: React.ChangeEventHandler<HTMLTextAreaElement>;
  mainContentLengthError: boolean;
  mainContentLinksText: string[];
  mainContentLinksLinks: string[];
  updateMainContentLinks: Function;
  linkQuantityError: boolean;
  linkRepeatError: boolean;
  clearLinkRepeatError: Function;
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
    if (
      mainContentLinksText.length === 1 ||
      index === mainContentLinksText.length - 1
    ) {
      return (
        <a href={href} key={href}>
          {text}
        </a>
      );
    } else {
      return (
        <>
          <a href={href} key={href}>
            {text}
          </a>
          <span>|</span>
        </>
      );
    }
  });

  return (
    <section className={styles.mainPost}>
      <h3 className={styles.h2}>Main Post</h3>
      <section className={styles.contentSection}>
        <textarea
          className={styles.textarea}
          value={mainContent}
          onChange={updateMainContent}
        ></textarea>
        {mainContentLengthError ? (
          <p className={styles.textLimitError}>Character limit 300</p>
        ) : null}
      </section>
      <section className={styles.linkDisplay}>{displayLinks}</section>
      <section className={styles.linkSection}>
        <h3>Add Link</h3>
        <form onSubmit={addLink} className={styles.addLinksForm}>
          <label htmlFor="linkText">Link Text</label>
          <input
            type="text"
            placeholder="add link text"
            name="linkText"
            value={linkText}
            onChange={(e) => {
              clearLinkRepeatError();
              setLinkText(e.target.value);
            }}
          />
          <label htmlFor="hyperlink">Hyperlink</label>
          <input
            type="text"
            placeholder="add hyerplink"
            name="hyperlink"
            value={linkLink}
            onChange={(e) => {
              clearLinkRepeatError();
              setLinkLink(e.target.value);
            }}
          />
          <input
            type="submit"
            value="Add Link"
            className={styles.addLinkButton}
          />
          {linkQuantityError ? (
            <p className={styles.linkError}>5 links maximum</p>
          ) : null}
          {linkRepeatError ? (
            <p className={styles.linkError}>link must be unique</p>
          ) : null}
        </form>
      </section>
    </section>
  );
}

export default CreateMainPost;
