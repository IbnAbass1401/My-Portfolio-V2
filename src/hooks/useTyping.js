import { useEffect, useState } from "react";

// Types a word, pauses, deletes it, moves to the next word, loops.
// Pass a stable array (defined outside the component) as `words`.
export default function useTyping(
  words,
  { typeSpeed = 80, deleteSpeed = 45, pause = 1400, enabled = true } = {}
) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const word = words[index];
    let delay = deleting ? deleteSpeed : typeSpeed;
    let next;

    if (!deleting && text === word) {
      delay = pause;
      next = () => setDeleting(true);
    } else if (deleting && text === "") {
      delay = 300;
      next = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      };
    } else {
      next = () =>
        setText(
          deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)
        );
    }

    const t = setTimeout(next, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, enabled, typeSpeed, deleteSpeed, pause]);

  // "reduce motion": show the first word, no typing
  return enabled ? text : words[0];
}