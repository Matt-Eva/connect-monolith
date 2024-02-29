import { useState, createElement, useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

interface ChildObject {
  nodeName: string;
  nodeText: string | null;
  children: ChildObject[];
  href?: string | null;
  className?: string | null;
}
function CreatePost() {
  const [mainContent, setMainContent] = useState("");
  const [mainContentLengthError, setMainContentLengthError] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkLink, setLinkLink] = useState("");
  const [mainContentLinksText, setMainContentLinksText] = useState<string[]>(
    []
  );
  const [mainContentLinksLinks, setMainContentLinksLinks] = useState<string[]>(
    []
  );
  const [linkQuantityError, setLinkQuantityError] = useState(false);
  const [linkRepeatError, setLinkRepeatError] = useState(false);
  const [addSecondaryContent, setAddSecondaryContent] = useState(false);
  const [secondaryContent, setSecondaryContent] = useState<ChildObject[]>([]);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );
  const [selectedText, setSelectedText] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkErrorMessage, setLinkErrorMessage] = useState(false);
  const [editor, setEditor] = useState<HTMLElement | null>(null);

  console.log(secondaryContent);

  useEffect(() => {
    const editor = document.getElementById("editorjs");
    setEditor(editor);
  }, []);

  const recursivelyHandleChildNodes = (
    node: ChildNode,
    parent?: ChildNode
  ): ChildObject[] => {
    const children = [];
    for (const child of node.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        const nodeName =
          element.nodeName === "DIV" ? "p" : element.nodeName.toLowerCase();

        let nestedChildren: ChildObject[] = [];
        if (child.childNodes.length !== 0) {
          nestedChildren = recursivelyHandleChildNodes(element, node);
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

  const updateContentState = () => {
    if (editor) {
      setTimeout(() => {
        const content = recursivelyHandleChildNodes(editor);
        setSecondaryContent(content);
      }, 1);
    }
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

    updateContentState();

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
    if (elementToChange && elementToChange.nodeName !== "H3") {
      const header: HTMLElement = document.createElement("h3");
      header.textContent = elementToChange.textContent;
      elementToChange.parentNode?.replaceChild(header, elementToChange);
    } else if (elementToChange) {
      const p: HTMLElement = document.createElement("p");
      p.textContent = elementToChange.textContent;
      elementToChange.parentNode?.replaceChild(p, elementToChange);
    }
    updateContentState();
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
        updateContentState();
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
      updateContentState();
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

  const updateMainContent = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textArea = e.target as HTMLTextAreaElement;
    const text = textArea.value;
    if (text.length < 300) {
      setMainContent(text);
      if (mainContentLengthError) {
        setMainContentLengthError(false);
      }
    } else {
      setMainContentLengthError(true);
    }
  };

  const updateMainContentLinks = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainContentLinksText.length < 5) {
      const repeatLink = mainContentLinksLinks.find(
        (link) => link === linkLink
      );
      const repeatText = mainContentLinksText.find((text) => text === linkText);

      if (!repeatLink && !repeatText) {
        const newText = [...mainContentLinksText, linkText];
        setMainContentLinksText(newText);

        const newHyperlink = [...mainContentLinksLinks, linkLink];
        setMainContentLinksLinks(newHyperlink);
      } else {
        setLinkRepeatError(true);
      }
    } else {
      setLinkQuantityError(true);
    }
  };

  const displayLinks = mainContentLinksText.map((text, index) => {
    const href = mainContentLinksLinks[index];
    return (
      <a href={href} key={href}>
        {text}
      </a>
    );
  });

  const saveDraft = async () => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "test" }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container} onMouseUp={handleMouseUp}>
      <section>
        <h2>Main Post</h2>
        <textarea value={mainContent} onChange={updateMainContent}></textarea>
        {mainContentLengthError ? <p>Character limit 300</p> : null}
        <section>
          {displayLinks}
          <h3>Add Link</h3>
          <form onSubmit={updateMainContentLinks}>
            <label htmlFor="linkText">Add Link Text</label>
            <input
              type="text"
              placeholder="add link text"
              name="linkText"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <label htmlFor="hyperlink">Add Hyperlink</label>
            <input
              type="text"
              placeholder="add hyerplink"
              name="hyperlink"
              value={linkLink}
              onChange={(e) => setLinkLink(e.target.value)}
            />
            <input type="submit" value="Add Link" />
          </form>
          {linkQuantityError ? <p>Cannot add more than 5 links</p> : null}
          {linkRepeatError ? <p>Each link must be unique</p> : null}
        </section>
      </section>
      <button onClick={() => setAddSecondaryContent(!addSecondaryContent)}>
        {addSecondaryContent ? "Cancel" : "Add More"}
      </button>
      {addSecondaryContent ? (
        <section className={styles.secondaryContent}>
          <h2>Secondary Content</h2>
          <div>
            <button onClick={makeHeader}>H</button>
            <button onClick={showLink}>Link</button>
            <button onClick={removeLink}>
              <s>Link</s>
            </button>
            <button onClick={indent}>Indent</button>
            <button onClick={center}>Center</button>
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
          <div>{displaySecondaryContent}</div>
        </section>
      ) : null}
      <button onClick={saveDraft}>Save Draft</button>
      <button>Post</button>
    </div>
  );
}

export default CreatePost;
