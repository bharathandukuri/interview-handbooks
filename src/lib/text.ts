export function stripInlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, "$1")
}

export function splitInlineCode(
  text: string
): Array<{ text: string; isCode: boolean }> {
  const parts: Array<{ text: string; isCode: boolean }> = []
  const regex = /`([^`]+)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isCode: false,
      })
    }
    parts.push({ text: match[1], isCode: true })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isCode: false })
  }

  return parts
}
