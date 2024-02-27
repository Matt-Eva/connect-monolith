import { useState } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

type ContentArray = Element[];
function CreatePost() {
  const [content, setContent] = useState([]);

  const recursivelyHandleChildNodes = (node: ChildNode) => {
    console.log(node.childNodes);
    for (const child of node.childNodes) {
      console.log(child.childNodes);
    }
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

    for (const childNode of editor.childNodes) {
      recursivelyHandleChildNodes(childNode);
    }
  };

  const handleInput = (e: React.FormEvent) => {
    const editor = e.target as HTMLElement;
  };

  return (
    <div className={styles.container}>
      <div
        id="editorjs"
        className={styles.editor}
        contentEditable={true}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      ></div>
    </div>
  );
}

export default CreatePost;
