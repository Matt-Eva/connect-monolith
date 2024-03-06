import { createElement } from "react";

import styles from "./PostPreview.module.css";

import { ChildObject } from "../../pages/CreatePost/CreatePost";
import { recursivelyRenderSecondaryPostContent } from "../../utils/recursivelyRenderSecondaryPostContent";

function PostPreview({
  linkTextArray,
  linkLinkArray,
  mainContent,
  secondaryContent,
}: {
  linkTextArray: string[];
  linkLinkArray: string[];
  mainContent: string;
  secondaryContent: ChildObject[];
}) {
  const linkArray = linkTextArray.map((text, index) => {
    return (
      <a key={text} href={linkLinkArray[index]}>
        {text}
      </a>
    );
  });

  const displaySecondaryContent =
    recursivelyRenderSecondaryPostContent(secondaryContent);

  return (
    <article>
      <section>
        <p>{mainContent}</p>
        <div>{linkArray}</div>
      </section>
      <section>{displaySecondaryContent}</section>
    </article>
  );
}

export default PostPreview;
