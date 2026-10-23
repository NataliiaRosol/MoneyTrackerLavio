import { createCn } from "cn/config"

const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["12", "14", "16", "28", "30", "44"] }],
    },
  },
})

export { cn }
