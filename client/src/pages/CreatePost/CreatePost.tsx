import { useState, createElement } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

interface ChildObject {
  nodeName: string;
  nodeText: string | null;
  children: ChildObject[];
  href?: string | null;
}
function CreatePost() {
  const [content, setContent] = useState<ChildObject[]>([]);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );
  const [selectedText, setSelectedText] = useState("");

  console.log("focusedElement", focusedElement);
  console.log("content", content);

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
        if (nodeName === "a" && child.nodeType == Node.ELEMENT_NODE) {
          const element = child as HTMLElement;
          const href = element.getAttribute("href");
          console.log(href);
          children.push({
            nodeName: nodeName,
            nodeText: "",
            children: nestedChildren,
            href: href,
          });
        } else {
          children.push({
            nodeName: nodeName,
            nodeText: "",
            children: nestedChildren,
          });
        }
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
      } else if (child.nodeName === "a") {
        const children = child.children;
        const displayChildren = recursivelyRenderChildren(children);
        return createElement(
          "a",
          {
            href: child.href,
          },
          displayChildren
        );
      } else {
        const children = child.children;
        const displayChildren = recursivelyRenderChildren(children);
        return createElement(child.nodeName, {}, displayChildren);
      }
    });
  };

  const displayContent = recursivelyRenderChildren(content);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id !== "editorjs") {
      const element = recursivelyTraverseUpNodeHierarchy(target);
      if (element) setFocusedElement(element);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection?.rangeCount && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();
      setSelectedText(text);
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

  const makeLink = (e: React.MouseEvent) => {
    // if (focusedElement) {
    //   const startPosition = focusedElement.textContent?.indexOf(selectedText);
    //   console.log(startPosition);
    //   if (startPosition) {
    //     const endPosition = startPosition + selectedText.length;
    //     console.log(endPosition);
    //   }
    // }
    const selection = window.getSelection();
    if (selection?.rangeCount && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const aTag = document.createElement("a");
      aTag.href = "https://www.google.com";
      range.surroundContents(aTag);
    }
  };

  return (
    <div className={styles.container} onMouseUp={handleMouseUp}>
      <div>
        <button onClick={makeHeader}>H</button>
        <button onClick={makeLink}>Link</button>
      </div>
      <div
        id="editorjs"
        className={styles.editor}
        contentEditable={true}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      ></div>
      <div>{displayContent}</div>
    </div>
  );
}

export default CreatePost;
