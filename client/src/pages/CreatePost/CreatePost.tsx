import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

import CreateMainPost from "../../components/CreateMainPost/CreateMainPost";
import PostPreview from "../../components/PostPreview/PostPreview";

import styles from "./CreatePost.module.css";

import { addPost } from "../../state/myPosts";

import { SecondaryContentObject } from "../../types/post";

function CreatePost() {
  const user = useAppSelector((state) => state.user.value);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
  const [secondaryContent, setSecondaryContent] = useState<
    SecondaryContentObject[]
  >([]);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null
  );

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkErrorMessage, setLinkErrorMessage] = useState(false);
  const [editor, setEditor] = useState<HTMLElement | null>(null);
  const [mongoId, setMongoId] = useState("");

  console.log(secondaryContent);

  useEffect(() => {
    const editor = document.getElementById("editorjs");
    setEditor(editor);
  }, [addSecondaryContent]);

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

  const updateContentState = () => {
    if (editor) {
      setTimeout(() => {
        const content = recursivelyHandleChildNodes(editor);
        setSecondaryContent(content);
      }, 1);
    }
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

  const updateMainContentLinks = ({
    linkText,
    linkLink,
  }: {
    linkText: string;
    linkLink: string;
  }) => {
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
        setLinkLink("");
        setLinkText("");
      } else {
        setLinkRepeatError(true);
      }
    } else {
      setLinkQuantityError(true);
    }
  };

  const saveDraft = async () => {
    console.log("saving draft");
    if (mongoId === "") {
      const uploadContent = {
        user_id: user.uId,
        src: "editorjs",
        main_post_content: mainContent,
        main_post_links_text: mainContentLinksText,
        main_post_links_links: mainContentLinksLinks,
        secondary_content: secondaryContent,
        created_at: Date.now(),
      };
      try {
        const res = await fetch("/api/save-new-post-draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadContent),
        });
        if (res.ok) {
          const data = await res.json();
          setMongoId(data.mongoId);
          alert("Post Successfully Saved!");
        } else {
          const error = await res.json();
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const uploadContent = {
        user_id: user.uId,
        src: "editorjs",
        main_post_content: mainContent,
        main_post_links_text: mainContentLinksText,
        main_post_links_links: mainContentLinksLinks,
        secondary_content: secondaryContent,
      };
      const res = await fetch(`/api/save-existing-post-draft/${mongoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadContent),
      });
      if (res.ok) {
        alert("Post Successfully Updated!");
      }
    }
  };

  const publishPost = async () => {
    if (mongoId !== "") {
      const uploadContent = {
        user_id: user.uId,
        src: "editorjs",
        main_post_content: mainContent,
        main_post_links_text: mainContentLinksText,
        main_post_links_links: mainContentLinksLinks,
        secondary_content: secondaryContent,
      };
      try {
        const res = await fetch(`/api/publish-post/${mongoId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadContent),
        });
        if (res.ok) {
          alert("Post Successfully Published!");
          const data = await res.json();
          dispatch(addPost(data));
          navigate(`/profile/${user.uId}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <CreateMainPost updateMainContentLinks={updateMainContentLinks} />
      {addSecondaryContent ? (
        <section className={styles.secondaryContent}>
          <h2 className={styles.h2}>Secondary Content</h2>
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
        </section>
      ) : null}
      <section>
        {mongoId !== "" ? (
          <PostPreview
            linkTextArray={mainContentLinksText}
            linkLinkArray={mainContentLinksLinks}
            mainContent={mainContent}
            secondaryContent={secondaryContent}
          />
        ) : null}
        {mainContent === "" ? (
          <button disabled={true}>Save</button>
        ) : (
          <button onClick={saveDraft}>Save</button>
        )}
        {mongoId === "" ? (
          <button disabled={true}>Publish</button>
        ) : (
          <button onClick={publishPost}>Publish</button>
        )}
      </section>
    </div>
  );
}

export default CreatePost;
