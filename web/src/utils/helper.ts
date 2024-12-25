import { emojiBlasts } from "emoji-blast";

export const confetti = () => {
    const element = document.getElementById("confetti");
    if (!element) return;
    const { cancel } = emojiBlasts({
        emojis: ["🎉", "🎊", "🎈"],
        position: {
            x: element.offsetLeft + element.clientWidth / 2,
            y: element.offsetTop,
        },
        physics: {
            fontSize: { max: 30, min: 25 },
            gravity: 0.25,
        },
        emojiCount: 40,
        interval: 1000,
    });
    setTimeout(cancel, 3e3);
};

const bgColors = ["bg-rose-100", "bg-emerald-100", "bg-amber-100", "bg-blue-100", "bg-purple-100"];
export const getRandomBgClass = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
};