import { useState, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import LinkTool from "@editorjs/link";
import Header from "@editorjs/header";

import styles from "./CreatePost.module.css";

type ContentArray = Element[];
function CreatePost() {
  const [contentArray, setContentArray] = useState<ContentArray>([]);
  console.log(contentArray);
  // const editor = new EditorJS({
  //   tools: {
  //     header: {
  //       class: Header,
  //       inlineToolbar: ["link"],
  //     },
  //     linkTool: {
  //       class: LinkTool,
  //     },
  //   },
  // });

  const handleClick = (e: React.MouseEvent) => {
    const selected = e.target as HTMLElement;
    const elementType = selected.tagName;
    if (selected.parentNode) {
      const parent = selected.parentNode;
      console.log(parent);
    }
  };

  const handleInput = (e: React.FormEvent) => {
    const selected = e.target as HTMLElement;
    console.log("selected", selected);
    const childNodes = selected.children;
    const stateArray = [];
    for (const node of childNodes) {
      stateArray.push(node);
    }
    setContentArray(stateArray);
  };

  const content = "<div>start writing</div>";

  return (
    <div>
      CreatePost
      <div
        id="editorjs"
        className={styles.editor}
        contentEditable={true}
        onClick={handleClick}
        onInput={handleInput}
      >
        {content}
      </div>
    </div>
  );
}

export default CreatePost;
