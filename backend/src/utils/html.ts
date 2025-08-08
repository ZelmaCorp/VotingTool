import { JSDOM } from "jsdom";

/** Converts HTML to Notion-compatible block elements */
export function convertHtmlToNotionBlocks(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Create blocks array starting with a header
  const blocks = [
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [
          {
            type: "text",
            text: { content: "Content" },
            annotations: {
              bold: true,
              color: "blue",
            },
          },
        ],
      },
    },
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          {
            type: "text",
            text: { content: "Details" },
          },
        ],
        icon: {
          emoji: "📝",
        },
        color: "gray_background",
        children: [] as any[],
      },
    },
  ];

  // Process nodes into the callout's children array
  document.body.childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.textContent?.trim()) {
      // Text Node
      const paragraphBlocks = createParagraphBlock(node.textContent.trim());
      if (Array.isArray(paragraphBlocks)) {
        blocks[1].callout?.children.push(...paragraphBlocks);
      } else {
        blocks[1].callout?.children.push(paragraphBlocks);
      }
    } else if (node.nodeType === 1) {
      // Element Node
      const element = node as HTMLElement;
      if (element.nodeName === "P") {
        const paragraphBlocks = createParagraphBlock(element.textContent?.trim() || "");
        if (Array.isArray(paragraphBlocks)) {
          blocks[1].callout?.children.push(...paragraphBlocks);
        } else {
          blocks[1].callout?.children.push(paragraphBlocks);
        }
      } else if (element.nodeName === "H1") {
        blocks[1].callout?.children.push(
          createHeadingBlock(element.textContent || "", 1)
        );
      } else if (element.nodeName === "H2") {
        blocks[1].callout?.children.push(
          createHeadingBlock(element.textContent || "", 2)
        );
      } else if (element.nodeName === "UL") {
        blocks[1].callout?.children.push(
          ...createListBlocks(element as Element, "bulleted")
        );
      } else if (element.nodeName === "OL") {
        blocks[1].callout?.children.push(
          ...createListBlocks(element as Element, "numbered")
        );
      } else if (element.nodeName === "A") {
        const paragraphBlocks = createParagraphBlock(
          element.textContent || "",
          element.getAttribute("href") || undefined
        );
        if (Array.isArray(paragraphBlocks)) {
          blocks[1].callout?.children.push(...paragraphBlocks);
        } else {
          blocks[1].callout?.children.push(paragraphBlocks);
        }
      }
    }
  });

  return blocks;
}

/** Creates a paragraph block */
function createParagraphBlock(text: string, link?: string) {
  // Notion has a 2000 character limit per text block
  const MAX_LENGTH = 2000;
  
  if (text.length <= MAX_LENGTH) {
    return {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: text,
              link: link ? { url: link } : undefined,
            },
          },
        ],
      },
    };
  }
  
  // Split long text into chunks and return multiple paragraph blocks
  const chunks = [];
  for (let i = 0; i < text.length; i += MAX_LENGTH) {
    chunks.push(text.substring(i, i + MAX_LENGTH));
  }
  
  return chunks.map(chunk => ({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content: chunk,
            link: link ? { url: link } : undefined,
          },
        },
      ],
    },
  }));
}

/** Creates a heading block */
function createHeadingBlock(text: string, level: 1 | 2 | 3) {
  return {
    object: "block",
    type: `heading_${level}`,
    [`heading_${level}`]: {
      rich_text: [
        {
          type: "text",
          text: { content: text },
        },
      ],
    },
  };
}

/** Creates bulleted or numbered list blocks */
function createListBlocks(node: Element, listType: "bulleted" | "numbered") {
  const items: any[] = [];
  node.childNodes.forEach((child) => {
    if (child.nodeName === "LI") {
      items.push({
        object: "block",
        type: `${listType}_list_item`,
        [`${listType}_list_item`]: {
          rich_text: [
            {
              type: "text",
              text: { content: child.textContent?.trim() || "" },
            },
          ],
        },
      });
    }
  });
  return items;
}
