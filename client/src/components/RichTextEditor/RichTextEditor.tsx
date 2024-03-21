import { useState, useEffect } from "react";

import styles from "./RichTextEditor.module.css";

import { SecondaryContentObject } from "../../types/post";

function RichTextEditor({
  updateSecondaryContent,
}: {
  updateSecondaryContent: Function;
}) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkErrorMessage, setLinkErrorMessage] = useState(false);
  const [editor, setEditor] = useState<HTMLElement | null>(null);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    const editor = document.getElementById("editorjs");
    setEditor(editor);
  }, []);

  const recursivelyHandleChildNodes = (
    node: ChildNode
  ): SecondaryContentObject[] => {
    const children = [];
    for (const child of node.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        const nodeName =
          element.nodeName === "DIV" ? "p" : element.nodeName.toLowerCase();

        let nestedChildren: SecondaryContentObject[] = [];
        if (child.childNodes.length !== 0) {
          nestedChildren = recursivelyHandleChildNodes(element);
        }

        if (nodeName === "a") {
          const href = element.getAttribute("href");
          children.push({
            nodeName: nodeName,
            nodeText: "",
            children: nestedChildren,
            href: href,
            className: element.className,
          });
        } else {
          children.push({
            nodeName: nodeName,
            nodeText: element.textContent,
            children: nestedChildren,
            className: element.className,
          });
        }
      } else {
        children.push({
          nodeName: child.nodeName,
          nodeText: child.textContent,
          children: [],
        });
      }
    }
    return children;
  };

  const recursivelyTraverseUpNodeHierarchy = (
    element: HTMLElement | null
  ): HTMLElement | null => {
    if (element !== null) {
      if (
        element.nodeName === "U" ||
        element.nodeName === "B" ||
        element.nodeName === "I" ||
        element.nodeName === "#text"
      ) {
        return recursivelyTraverseUpNodeHierarchy(element.parentElement);
      } else {
        return element;
      }
    }
    return null;
  };

  const updateContentState = () => {
    if (editor) {
      setTimeout(() => {
        const content = recursivelyHandleChildNodes(editor);
        updateSecondaryContent(content);
      }, 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selection = window.getSelection();
    if (selection!.rangeCount === 0) return null;

    const range = selection!.getRangeAt(0);
    const node = range.startContainer as HTMLElement;
    const focusedElement = recursivelyTraverseUpNodeHierarchy(node);
    console.log("focusedElement", focusedElement);
    setFocusedElement(focusedElement);

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
        setFocusedElement(p);
      }, 1);
    }

    updateContentState();

    if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id !== "editorjs") {
      const element = recursivelyTraverseUpNodeHierarchy(target);
      if (element) setFocusedElement(element);
    }
  };

  const makeHeader = () => {
    console.log(focusedElement);
    let elementToChange = recursivelyTraverseUpNodeHierarchy(focusedElement);
    if (elementToChange && elementToChange.nodeName !== "H3") {
      const header: HTMLElement = document.createElement("h3");
      header.textContent = elementToChange.textContent;
      if (elementToChange.className) {
        header.className = elementToChange.className;
      }
      elementToChange.parentNode?.replaceChild(header, elementToChange);
      setFocusedElement(header);
    } else if (elementToChange) {
      const p: HTMLElement = document.createElement("p");
      p.textContent = elementToChange.textContent;
      if (elementToChange.className) {
        p.className = elementToChange.className;
      }
      elementToChange.parentNode?.replaceChild(p, elementToChange);
      setFocusedElement(p);
    }
    updateContentState();
  };

  const showLink = () => {
    setShowLinkInput(!showLinkInput);
  };

  const removeLink = () => {
    if (
      focusedElement &&
      focusedElement.textContent &&
      focusedElement.nodeName === "A"
    ) {
      const textNode = document.createTextNode(focusedElement.textContent);
      focusedElement.parentNode?.insertBefore(textNode, focusedElement);
      focusedElement.parentNode?.removeChild(focusedElement);
      setFocusedElement(null);
      updateContentState();
    }
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
        updateContentState();
      } catch (e) {
        setLinkErrorMessage(true);
      }
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
      updateContentState();
    }
  };

  const center = () => {
    if (focusedElement && focusedElement.className === "") {
      focusedElement.style.textAlign = "center";
      focusedElement.className = "center-text";
    } else if (focusedElement) {
      focusedElement.style.textAlign = "start";
      focusedElement.className = "";
    }
    updateContentState();
  };

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Secondary Content</h3>
      <div className={styles.buttonContainer}>
        <button onClick={makeHeader}>H</button>
        <button onClick={showLink}>Link</button>
        <button onClick={removeLink}>
          <s>Link</s>
        </button>
        <button onClick={indent}>Indent</button>
        <button onClick={center}>Center</button>
      </div>
      {showLinkInput ? (
        <form onSubmit={handleLinkSubmit} className={styles.linkForm}>
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
    </section>
  );
}

export default RichTextEditor;
