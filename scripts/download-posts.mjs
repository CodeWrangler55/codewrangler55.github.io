import { mkdir, writeFile } from "node:fs/promises";

const apiUrl = "https://firstnormalform.com/wp-json/wp/v2/posts?per_page=100&_fields=id,date,slug,link,title,content,excerpt";

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&nbsp;/g, " ");
}

function htmlToMarkdown(html) {
  return decodeEntities(html)
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, "\n\n### $1\n\n")
    .replace(/<p[^>]*>/gi, "\n\n")
    .replace(/<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<\/?(ul|ol)[^>]*>/gi, "\n")
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gis, "[$2]($1)")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gis, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gis, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/gis, "*$1*")
    .replace(/<figure[^>]*>.*?<\/figure>/gis, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function frontmatter(post) {
  const title = decodeEntities(post.title.rendered);
  return [
    "---",
    `title: "${title.replaceAll('"', '\\"')}"`,
    `date: "${post.date}"`,
    `slug: "${post.slug}"`,
    `source: "${post.link}"`,
    "---",
    ""
  ].join("\n");
}

const response = await fetch(apiUrl);
if (!response.ok) {
  throw new Error(`WordPress API failed: ${response.status} ${response.statusText}`);
}

const posts = await response.json();
await mkdir("content/voice-corpus", { recursive: true });

const index = [];
for (const post of posts) {
  const title = decodeEntities(post.title.rendered);
  const markdown = `${frontmatter(post)}# ${title}\n\n${htmlToMarkdown(post.content.rendered)}\n`;
  const fileName = `${post.date.slice(0, 10)}-${post.slug}.md`;
  await writeFile(`content/voice-corpus/${fileName}`, markdown, "utf8");
  index.push(`- [${title}](./${fileName}) - ${post.link}`);
}

await writeFile(
  "content/voice-corpus/README.md",
  `# First Normal Form Voice Corpus\n\nDownloaded ${posts.length} posts from firstnormalform.com.\n\n${index.join("\n")}\n`,
  "utf8"
);

console.log(`Downloaded ${posts.length} posts to content/voice-corpus`);
