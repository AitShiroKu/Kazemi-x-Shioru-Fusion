export function formatBotReply(text: string): string {
  const header = `> **🌸 Kuniko Zakura Response**\n`;
  const quoted = text.split('\n').map((line) => `> ${line}`).join('\n');
  const warning = "> ### ❗ Don't Share any your personal information or your password to Ai";
  const quoteBlock = '> ';
  return `${header}${quoteBlock}\n${quoteBlock}\n${quoted}\n${quoteBlock}\n${warning}`;
}

export function splitMessage(text: string, maxLength: number = 1800): string[] {
  const parts: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    parts.push(remaining.substring(0, maxLength));
    remaining = remaining.substring(maxLength);
  }
  return parts;
}

// Language to file extension mapping
const LANGUAGE_EXTENSIONS: Record<string, string> = {
  typescript: '.ts',
  javascript: '.js',
  python: '.py',
  java: '.java',
  'c++': '.cpp',
  'c#': '.cs',
  go: '.go',
  rust: '.rs',
  php: '.php',
  ruby: '.rb',
  swift: '.swift',
  kotlin: '.kt',
  html: '.html',
  css: '.css',
  sql: '.sql',
  json: '.json',
  yaml: '.yaml',
  xml: '.xml',
  markdown: '.md',
  shell: '.sh',
  bash: '.sh',
  sh: '.sh',
  powershell: '.ps1',
  perl: '.pl',
  lua: '.lua',
  r: '.r',
  matlab: '.m',
  scala: '.scala',
  clojure: '.clj',
  haskell: '.hs',
  erlang: '.erl',
  elixir: '.ex',
  dart: '.dart',
};

export interface CodeBlock {
  language: string;
  code: string;
  extension: string;
  index: number;
}

export interface MessageSegment {
  text: string;
  attachment?: {
    name: string;
    content: string;
  };
}

/**
 * Detects and extracts code blocks from text
 */
export function extractCodeBlocks(text: string): { cleanText: string; codeBlocks: CodeBlock[] } {
  // Updated regex to better handle code blocks with or without language identifiers
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const codeBlocks: CodeBlock[] = [];
  let cleanText = text;
  const matches: Array<{ fullMatch: string; language: string; code: string; start: number; end: number }> = [];
  let match;
  let index = 1;

  // Reset regex lastIndex to ensure global search works correctly
  codeBlockRegex.lastIndex = 0;

  // First pass: collect all matches with their positions
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [fullMatch, language = '', code] = match;
    matches.push({
      fullMatch,
      language: language.toLowerCase(),
      code: code.trim(),
      start: match.index,
      end: match.index + fullMatch.length
    });
  }

  // Second pass: process matches in reverse order to avoid index shifting
  for (let i = matches.length - 1; i >= 0; i--) {
    const matchData = matches[i];
    const detectedLanguage = matchData.language || detectLanguage(matchData.code);
    const extension = LANGUAGE_EXTENSIONS[detectedLanguage] || '.txt';

    codeBlocks.unshift({
      language: detectedLanguage,
      code: matchData.code,
      extension,
      index,
    });

    // Replace code block with placeholder in clean text
    cleanText = cleanText.substring(0, matchData.start) +
                `[CODE_BLOCK_${index}]` +
                cleanText.substring(matchData.end);
    index++;
  }

  // Reverse the codeBlocks array since we added them in reverse order
  codeBlocks.reverse();

  return { cleanText, codeBlocks };
}

/**
 * Simple language detection based on code patterns
 */
function detectLanguage(code: string): string {
  const codeLower = code.toLowerCase();

  // Check for common patterns - order matters, more specific first
  if (codeLower.includes('interface ') || codeLower.includes(': string') || codeLower.includes(': number')) {
    return 'typescript';
  }
  if (codeLower.includes('import') && codeLower.includes('from') && !codeLower.includes('python')) {
    return 'javascript';
  }
  if (codeLower.includes('def ') || (codeLower.includes('import ') && codeLower.includes('print('))) {
    return 'python';
  }
  if (codeLower.includes('public class') || codeLower.includes('system.out.println') || codeLower.includes('java.')) {
    return 'java';
  }
  if (codeLower.includes('#include') || codeLower.includes('cout') || codeLower.includes('std::')) {
    return 'c++';
  }
  if (codeLower.includes('using system') || codeLower.includes('console.writeline') || codeLower.includes('namespace ')) {
    return 'c#';
  }
  if (codeLower.includes('package main') || codeLower.includes('fmt.println') || codeLower.includes('func ')) {
    return 'go';
  }
  if (codeLower.includes('fn main') || codeLower.includes('println!') || codeLower.includes('::')) {
    return 'rust';
  }
  if (codeLower.includes('<?php') || codeLower.includes('echo ') || codeLower.includes('$')) {
    return 'php';
  }
  if (codeLower.includes('puts ') || codeLower.includes('def ') || codeLower.includes('end')) {
    return 'ruby';
  }
  if (codeLower.includes('<html>') || codeLower.includes('<div>') || codeLower.includes('<script>')) {
    return 'html';
  }
  if (codeLower.includes('{') && codeLower.includes('}') && codeLower.includes(':') && !codeLower.includes('function')) {
    return 'json';
  }
  if (codeLower.includes('select ') && codeLower.includes('from ') && codeLower.includes('where ')) {
    return 'sql';
  }
  if (codeLower.includes('---') || (codeLower.includes(':') && codeLower.includes('\n'))) {
    return 'yaml';
  }
  if (codeLower.includes('<?xml') || codeLower.includes('<') && codeLower.includes('>') && codeLower.includes('/')) {
    return 'xml';
  }

  return 'txt'; // Default
}

/**
 * Smart message segmentation that handles code blocks
 */
export function splitMessageWithCodeBlocks(text: string, maxLength: number = 1800): MessageSegment[] {
  const { cleanText, codeBlocks } = extractCodeBlocks(text);
  const segments: MessageSegment[] = [];

  if (codeBlocks.length === 0) {
    // No code blocks, use simple splitting
    return splitMessage(cleanText, maxLength).map(text => ({ text }));
  }

  // Split clean text at natural breakpoints, but ensure code blocks are kept with their context
  const textParts = splitTextPreservingCodeBlocks(cleanText, codeBlocks, maxLength);

  for (const textPart of textParts) {
    const segment: MessageSegment = { text: textPart };

    // Check if this text part contains a code block placeholder
    const codeBlockMatch = textPart.match(/\[CODE_BLOCK_(\d+)\]/);
    if (codeBlockMatch) {
      const blockIndex = parseInt(codeBlockMatch[1]) - 1;
      const codeBlock = codeBlocks[blockIndex];
      if (codeBlock) {
        const fileName = codeBlock.language !== 'txt'
          ? `code-block_${codeBlock.index}${codeBlock.extension}`
          : `code-block_${codeBlock.index}.txt`;

        segment.attachment = {
          name: fileName,
          content: codeBlock.code,
        };

        // Replace placeholder with description
        segment.text = segment.text.replace(
          /\[CODE_BLOCK_\d+\]/,
          `\n\n📎 **Code attached as ${fileName}**`
        );
      }
    }

    segments.push(segment);
  }

  return segments;
}

/**
 * Split text while preserving code block context
 */
function splitTextPreservingCodeBlocks(text: string, codeBlocks: CodeBlock[], maxLength: number): string[] {
  const parts: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLength) {
      parts.push(remaining);
      break;
    }

    // Find code block placeholders in the current chunk
    const codeBlockMatches = [...remaining.substring(0, maxLength).matchAll(/\[CODE_BLOCK_\d+\]/g)];

    if (codeBlockMatches.length > 0) {
      // If there's a code block in this chunk, split right before it
      const lastMatch = codeBlockMatches[codeBlockMatches.length - 1];
      const splitPoint = lastMatch.index + lastMatch[0].length;

      if (splitPoint <= maxLength) {
        parts.push(remaining.substring(0, splitPoint));
        remaining = remaining.substring(splitPoint);
        continue;
      }
    }

    // No code block in this chunk, find natural breakpoint
    let splitPoint = maxLength;

    // Look for sentence endings
    const sentenceEndings = ['. ', '! ', '? ', '\n\n'];
    for (const ending of sentenceEndings) {
      const lastEnding = remaining.lastIndexOf(ending, maxLength);
      if (lastEnding > maxLength * 0.7) { // Don't split too early
        splitPoint = lastEnding + ending.length;
        break;
      }
    }

    // If no good sentence ending, look for word boundaries
    if (splitPoint === maxLength) {
      const lastSpace = remaining.lastIndexOf(' ', maxLength);
      if (lastSpace > maxLength * 0.8) {
        splitPoint = lastSpace;
      }
    }

    parts.push(remaining.substring(0, splitPoint));
    remaining = remaining.substring(splitPoint);
  }

  return parts;
}
