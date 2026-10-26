import { createCn } from "cn/config"

const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["12", "13", "14", "16", "22", "28", "30", "44"] }],
    },
  },
})

export { cn }
