import { useState } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

type ContentArray = Element[];
function CreatePost() {
  const [content, setContent] = useState([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selected = e.target as HTMLElement;
    if (selected.children.length === 0 && e.key.length === 1) {
      setTimeout(() => {
        const textContent = selected.textContent;
        console.log(textContent);
        selected.textContent = "";
        const p = document.createElement("p");
        p.textContent = textContent;
        selected.append(p);
        const position = textContent?.length;
        const range = document.createRange();
        const sel = document.getSelection();

        range.setStart(p, position!);
        range.collapse(true);

        sel?.removeAllRanges();
        sel?.addRange(range);

        selected.focus();
      }, 1);
    }
  };

  const handleInput = (e: React.FormEvent) => {
    const editor = e.target as HTMLElement;

    for (const child of editor.children) {
      console.log(child.nodeName);
      console.log(child.textContent);
      console.log(child.children);
      for (const node of child.children) {
        console.log(node.children);
        for (const element of node.children) {
          console.log(element.children);
        }
      }
    }
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
