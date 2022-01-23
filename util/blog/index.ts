export function createBriefFromContent(content: string) {
  return content.slice(0, 100).split('\n')[0];
}
