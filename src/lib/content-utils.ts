// src/lib/content-utils.ts
/**
 * Clean markdown content for preview text
 * Removes all markdown syntax and returns clean text
 */
export function cleanMarkdownForPreview(
	content: string,
	maxLength: number = 150
): string {
	if (!content) return '내용 미리보기가 없습니다.';

	let cleanText = content;

	// Remove markdown images (both formats)
	cleanText = cleanText.replace(/!\[([^\]]*)\]\([^)]+\)/g, ''); // ![alt](url)
	cleanText = cleanText.replace(/!\[([^\]]*)\]/g, ''); // ![alt] without url

	// Remove markdown links but keep the text
	cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // [text](url) -> text

	// Remove markdown headers
	cleanText = cleanText.replace(/^#{1,6}\s+/gm, '');

	// Remove markdown bold/italic
	cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // **bold**
	cleanText = cleanText.replace(/\*(.*?)\*/g, '$1'); // *italic*
	cleanText = cleanText.replace(/__(.*?)__/g, '$1'); // __bold__
	cleanText = cleanText.replace(/_(.*?)_/g, '$1'); // _italic_

	// Remove markdown code blocks and inline code
	cleanText = cleanText.replace(/```[\s\S]*?```/g, ''); // code blocks
	cleanText = cleanText.replace(/`([^`]+)`/g, '$1'); // inline code

	// Remove blockquotes
	cleanText = cleanText.replace(/^>\s*/gm, '');

	// Remove list markers
	cleanText = cleanText.replace(/^[-*+]\s+/gm, ''); // unordered lists
	cleanText = cleanText.replace(/^\d+\.\s+/gm, ''); // ordered lists

	// Remove horizontal rules
	cleanText = cleanText.replace(/^---+$/gm, '');
	cleanText = cleanText.replace(/^\*\*\*+$/gm, '');

	// Replace multiple newlines with single spaces
	cleanText = cleanText.replace(/\n+/g, ' ');

	// Remove extra whitespace
	cleanText = cleanText.replace(/\s+/g, ' ').trim();

	// Truncate to desired length
	if (cleanText.length > maxLength) {
		cleanText = cleanText.substring(0, maxLength).trim();
		// Ensure we don't cut off in the middle of a word
		const lastSpace = cleanText.lastIndexOf(' ');
		if (lastSpace > maxLength * 0.8) {
			cleanText = cleanText.substring(0, lastSpace);
		}
		cleanText += '...';
	}

	return cleanText || '내용 미리보기가 없습니다.';
}
