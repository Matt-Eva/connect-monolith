import { useState, createElement } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

interface ChildObject {
  nodeName: string;
  nodeText: string | null;
  children: ChildObject[];
}
function CreatePost() {
  const [content, setContent] = useState<ChildObject[]>([]);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );

  const recursivelyHandleChildNodes = (
    node: ChildNode,
    parent?: ChildNode
  ): ChildObject[] => {
    const children = [];
    for (const child of node.childNodes) {
      if (child.childNodes.length !== 0) {
        const nestedChildren = recursivelyHandleChildNodes(child, node);
        const nodeName =
          child.nodeName === "DIV" ? "p" : child.nodeName.toLowerCase();
        children.push({
          nodeName: nodeName,
          nodeText: "",
          children: nestedChildren,
        });
      } else {
        const nodeName =
          child.nodeName === "DIV" ? "p" : child.nodeName.toLowerCase();
        children.push({
          nodeName: nodeName,
          nodeText: child.textContent,
          children: [],
        });
      }
    }
    return children;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const editor = e.target as HTMLElement;

    if (editor.children.length === 0 && e.key.length === 1) {
      setTimeout(() => {
        const textContent = editor.textContent;
        console.log(textContent);
        editor.textContent = "";
        const p = document.createElement("p");
        p.textContent = textContent;
        editor.append(p);
        const position = textContent?.length;
        const range = document.createRange();
        const sel = document.getSelection();

        range.setStart(p, position!);
        range.collapse(true);

        sel?.removeAllRanges();
        sel?.addRange(range);

        editor.focus();
      }, 1);
    }

    setTimeout(() => {
      const content = recursivelyHandleChildNodes(editor);
      console.log(content);
      setContent(content);
    }, 1);

    if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  const recursivelyRenderChildren = (
    children: ChildObject[]
  ): Iterable<React.ReactNode> => {
    return children.map((child) => {
      if (child.nodeName === "#text") {
        return child.nodeText;
      } else if (child.nodeName === "br") {
        return <br></br>;
      } else {
        const children = child.children;
        const displayChildren = recursivelyRenderChildren(children);
        return createElement(
          child.nodeName,
          {
            onClick: (e: React.MouseEvent) => {
              const target = e.target as HTMLElement;
              setFocusedElement(target);
            },
          },
          displayChildren
        );
      }
    });
  };

  const displayContent = recursivelyRenderChildren(content);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    console.log(target);
    if (target.id !== "editorjs") {
      setFocusedElement(target);
    }
  };

  const recursivelyTraverseUpNodeHierarchy = (
    element: HTMLElement | null
  ): HTMLElement | undefined => {
    if (element !== null) {
      if (
        element.nodeName === "U" ||
        element.nodeName === "B" ||
        element.nodeName === "I"
      ) {
        return recursivelyTraverseUpNodeHierarchy(element.parentElement);
      } else {
        return element;
      }
    }
  };

  const makeHeader = (e: React.MouseEvent) => {
    console.log(focusedElement);
    let elementToChange = recursivelyTraverseUpNodeHierarchy(focusedElement);
    if (elementToChange) {
      const header: HTMLElement = document.createElement("h2");
      header.textContent = elementToChange.textContent;
      elementToChange.parentNode?.replaceChild(header, elementToChange);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <button onClick={makeHeader}>H</button>
      </div>
      <div
        id="editorjs"
        className={styles.editor}
        contentEditable={true}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
      ></div>
      <div>{displayContent}</div>
    </div>
  );
}

export default CreatePost;
