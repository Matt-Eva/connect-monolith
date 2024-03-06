import { createElement } from "react";

import { SecondaryContentObject } from "../types/post";

export const recursivelyRenderSecondaryPostContent = (
  children: SecondaryContentObject[]
): Array<React.ReactNode> => {
  return children.map((child) => {
    if (child.nodeName === "#text") {
      return child.nodeText;
    } else if (child.nodeName === "br") {
      return createElement("br", {});
    } else if (child.nodeName === "a") {
      const children = child.children;
      const displayChildren = recursivelyRenderSecondaryPostContent(children);
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
      const displayChildren = recursivelyRenderSecondaryPostContent(children);
      return createElement(
        child.nodeName,
        { className: child.className },
        displayChildren
      );
    }
  });
};
