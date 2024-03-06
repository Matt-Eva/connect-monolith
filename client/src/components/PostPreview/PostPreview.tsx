import { createElement } from "react";

import styles from "./PostPreview.module.css";

import { ChildObject } from "../../pages/CreatePost/CreatePost";

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

  const recursivelyRenderChildren = (
    children: ChildObject[]
  ): Iterable<React.ReactNode> => {
    return children.map((child) => {
      if (child.nodeName === "#text") {
        return child.nodeText;
      } else if (child.nodeName === "br") {
        return <br></br>;
      } else if (child.nodeName === "a") {
        const children = child.children;
        const displayChildren = recursivelyRenderChildren(children);
        return createElement(
          "a",
          {
            href: child.href,
            className: child.className,
          },
          displayChildren
        );
      } else {
        const children = child.children;
        const displayChildren = recursivelyRenderChildren(children);
        return createElement(
          child.nodeName,
          { className: child.className },
          displayChildren
        );
      }
    });
  };

  const displaySecondaryContent = recursivelyRenderChildren(secondaryContent);

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
