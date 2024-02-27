import { useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

type ContentArray = Element[];
function CreatePost() {
  const [contentArray, setContentArray] = useState<ContentArray>([]);
  const [firstEnter, setFirstEnter] = useState(true);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
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

  return (
    <div>
      CreatePost
      <div
        id="editorjs"
        className={styles.editor}
        contentEditable={true}
        onKeyDown={handleKeyDown}
      ></div>
    </div>
  );
}

export default CreatePost;
