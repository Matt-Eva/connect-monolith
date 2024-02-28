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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkErrorMessage, setLinkErrorMessage] = useState(false);

  console.log(content);

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
        console.log(nodeName);
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
        } else if (nodeName === "span") {
          const spanNode = child as HTMLElement;
          if (spanNode.className === "span-indent") {
            children.push({
              nodeName: nodeName,
              nodeText: child.textContent,
              children: [],
              className: "span-indent",
            });
          } else {
            children.push({
              nodeName: nodeName,
              nodeText: child.textContent,
              children: [],
            });
          }
        } else {
          console.log("pushing");
          children.push({
            nodeName: nodeName,
            nodeText: "",
            children: nestedChildren,
          });
        }
      } else {
        const nodeName =
          child.nodeName === "DIV" ? "p" : child.nodeName.toLowerCase();
        if (nodeName === "span") {
          const spanNode = child as HTMLElement;
          if (spanNode.className === "span-indent") {
            children.push({
              nodeName: nodeName,
              nodeText: child.textContent,
              children: [],
              className: "span-indent",
            });
          } else {
            children.push({
              nodeName: nodeName,
              nodeText: child.textContent,
              children: [],
            });
          }
        } else {
          children.push({
            nodeName: nodeName,
            nodeText: child.textContent,
            children: [],
          });
        }
      }
    }
    return children;
  };

  const updateContentState = () => {
    // setTimeout(() => {
    //   const content = recursivelyHandleChildNodes(editor);
    //   setContent(content);
    // }, 1);
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

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();
      setSelectedText(text);
    }
  };

  const makeHeader = () => {
    console.log(focusedElement);
    let elementToChange = recursivelyTraverseUpNodeHierarchy(focusedElement);
    if (elementToChange && elementToChange.nodeName !== "H2") {
      const header: HTMLElement = document.createElement("h2");
      header.textContent = elementToChange.textContent;
      elementToChange.parentNode?.replaceChild(header, elementToChange);
    } else if (elementToChange) {
      const p: HTMLElement = document.createElement("p");
      p.textContent = elementToChange.textContent;
      elementToChange.parentNode?.replaceChild(p, elementToChange);
    }
  };

  const showLink = () => {
    setShowLinkInput(!showLinkInput);
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (
      selection?.rangeCount &&
      selection.rangeCount > 0 &&
      selection.toString().length !== 0
    ) {
      const range = selection.getRangeAt(0);
      const aTag = document.createElement("a");
      aTag.href = linkInput;
      console.log(selection.toString());
      try {
        range.surroundContents(aTag);
        setShowLinkInput(false);
        setLinkInput("");
        setLinkErrorMessage(false);
      } catch (e) {
        setLinkErrorMessage(true);
      }
    }
  };

  const removeLink = () => {
    if (
      focusedElement &&
      focusedElement.textContent &&
      focusedElement.nodeName === "A"
    ) {
      console.log(focusedElement?.nodeName);
      const textNode = document.createTextNode(focusedElement.textContent);
      focusedElement.parentNode?.insertBefore(textNode, focusedElement);
      focusedElement.parentNode?.removeChild(focusedElement);
      setFocusedElement(null);
    }
  };

  const indent = () => {
    if (focusedElement) {
      console.log(focusedElement);
      const firstChild = focusedElement.firstChild;
      if (firstChild && firstChild.nodeName !== "SPAN") {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.width = "20px";
        span.className = "span-indent";
        focusedElement.insertBefore(span, firstChild);
      } else if (firstChild) {
        focusedElement.removeChild(firstChild);
      }
      // focusedElement.style.marginLeft = "20px";
    }
  };

  return (
    <div className={styles.container} onMouseUp={handleMouseUp}>
      <div>
        <button onClick={makeHeader}>H</button>
        <button onClick={showLink}>Link</button>
        <button onClick={removeLink}>
          <s>Link</s>
        </button>
        <button onClick={indent}>{"->"}</button>
      </div>
      {showLinkInput ? (
        <form onSubmit={handleLinkSubmit}>
          <label htmlFor="linkInput">Add Link</label>
          <input
            name="linkInput"
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
          />
          <input type="submit" />
        </form>
      ) : null}
      {linkErrorMessage ? (
        <p>cannot link across text with different formatting</p>
      ) : null}
      <div
        id="editorjs"
        className={styles.editor}
        contentEditable={true}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
      ></div>
      <div>{displayContent}</div>
    </div>
  );
}

export default CreatePost;
