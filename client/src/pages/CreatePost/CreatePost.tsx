import { useState } from "react";
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

  const recursivelyHandleChildNodes = (
    node: ChildNode,
    parent?: ChildNode
  ): ChildObject[] => {
    const children = [];
    for (const child of node.childNodes) {
      if (child.childNodes.length !== 0) {
        const nestedChildren = recursivelyHandleChildNodes(child, node);
        children.push({
          nodeName: child.nodeName,
          nodeText: child.textContent,
          children: nestedChildren,
        });
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
      const content = recursivelyHandleChildNodes(childNode);
      console.log(content);
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
