export const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;

export const DOCUMENT_URL_REGEX =
  /^(https?:\/\/)?((drive\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)[a-zA-Z0-9_-]+)|(www\.)?canva\.com\/(design\/[a-zA-Z0-9_-]+)).*$/;

export function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(YOUTUBE_REGEX);
  return match && match[5] ? match[5] : null;
}