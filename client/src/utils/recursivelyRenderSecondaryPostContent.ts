import { createElement } from "react";
import { v4 as uuid } from "uuid";

import { SecondaryContentObject } from "../types/post";

export const recursivelyRenderSecondaryPostContent = (
  children: SecondaryContentObject[]
): Array<React.ReactNode> => {
  const renderedChildren = children.map((child) => {
    if (child.nodeName === "#text") {
      return child.nodeText;
    } else if (child.nodeName === "br") {
      const key = uuid();
      console.log(key);
      return createElement("br", { key: key });
    } else if (child.nodeName === "a") {
      const children = child.children;
      const displayChildren = recursivelyRenderSecondaryPostContent(children);
      const key = uuid();
      return createElement(
        "a",
        {
          key: key,
          href: child.href,
          className: child.className,
        },
        displayChildren
      );
    } else {
      const children = child.children;
      const displayChildren = recursivelyRenderSecondaryPostContent(children);
      const key = uuid();
      console.log(key);
      return createElement(
        child.nodeName,
        { key: key, className: child.className },
        displayChildren
      );
    }
  });
  console.log(renderedChildren);
  return renderedChildren;
};
