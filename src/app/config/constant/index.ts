import { Option } from "@core/interfaces/option.interface";

export const FILE_ICON_CLASS_MAP: Record<string, string> = {
  'pdf': 'fas fa-file-pdf text-red-500',
  'doc': 'fas fa-file-word text-blue-600',
  'docx': 'fas fa-file-word text-blue-600',
  'odt': 'fas fa-file-word text-blue-400',
  'xls': 'fas fa-file-excel text-green-600',
  'xlsx': 'fas fa-file-excel text-green-600',
  'csv': 'fas fa-file-csv text-green-500',
  'ppt': 'fas fa-file-powerpoint text-orange-500',
  'pptx': 'fas fa-file-powerpoint text-orange-500',
  'jpg': 'fas fa-file-image text-blue-500',
  'jpeg': 'fas fa-file-image text-blue-500',
  'png': 'fas fa-file-image text-blue-400',
  'gif': 'fas fa-file-image text-pink-400',
  'svg': 'fas fa-file-image text-purple-500',
  'txt': 'fas fa-file-alt text-gray-500',
  'md': 'fas fa-file-alt text-gray-500',
  'json': 'fas fa-file-code text-yellow-500',
  'xml': 'fas fa-file-code text-yellow-600',
  'html': 'fas fa-file-code text-orange-600',
  'css': 'fas fa-file-code text-blue-400',
  'js': 'fas fa-file-code text-yellow-400',
  'ts': 'fas fa-file-code text-blue-500',
  'zip': 'fas fa-file-archive text-yellow-700',
  'rar': 'fas fa-file-archive text-yellow-700',
  '7z': 'fas fa-file-archive text-yellow-700',
  'mp4': 'fas fa-file-video text-purple-500',
  'avi': 'fas fa-file-video text-purple-500',
  'mov': 'fas fa-file-video text-purple-500',
  'wmv': 'fas fa-file-video text-purple-500',
  'mkv': 'fas fa-file-video text-purple-500',
  'mp3': 'fas fa-file-audio text-indigo-500',
  'wav': 'fas fa-file-audio text-indigo-500',
  'flac': 'fas fa-file-audio text-indigo-500',
  'exe': 'fas fa-cog text-gray-700',
  'apk': 'fas fa-mobile-alt text-green-600',
  'iso': 'fas fa-dot-circle text-gray-600',
  'default': 'fas fa-file text-gray-400'
};

export const FILE_BG_CLASS_MAP: Record<string, string> = {
  'pdf': 'bg-red-100',
  'doc': 'bg-blue-100',
  'docx': 'bg-blue-100',
  'odt': 'bg-blue-50',
  'xls': 'bg-green-100',
  'xlsx': 'bg-green-100',
  'csv': 'bg-green-50',
  'ppt': 'bg-orange-100',
  'pptx': 'bg-orange-100',
  'jpg': 'bg-blue-50',
  'jpeg': 'bg-blue-50',
  'png': 'bg-blue-100',
  'gif': 'bg-pink-100',
  'svg': 'bg-purple-100',
  'txt': 'bg-gray-100',
  'md': 'bg-gray-100',
  'json': 'bg-yellow-100',
  'xml': 'bg-yellow-100',
  'html': 'bg-orange-100',
  'css': 'bg-blue-100',
  'js': 'bg-yellow-50',
  'ts': 'bg-blue-50',
  'zip': 'bg-yellow-50',
  'rar': 'bg-yellow-50',
  '7z': 'bg-yellow-50',
  'mp4': 'bg-purple-50',
  'avi': 'bg-purple-50',
  'mov': 'bg-purple-50',
  'wmv': 'bg-purple-50',
  'mkv': 'bg-purple-50',
  'mp3': 'bg-indigo-100',
  'wav': 'bg-indigo-100',
  'flac': 'bg-indigo-100',
  'exe': 'bg-gray-200',
  'apk': 'bg-green-50',
  'iso': 'bg-gray-50',
  'default': 'bg-gray-50'
};

export const FILE_TYPE_CATEGORY_MAP: Record<string, string[]> = {
  "document": [
    "pdf", "doc", "docx", "odt", "xls", "xlsx", "csv", "ppt", "pptx", "txt", "md"
  ],
  "image": [
    "jpg", "jpeg", "png", "gif", "svg"
  ],
  "audio": [
    "mp3", "wav", "flac"
  ],
  "video": [
    "mp4", "avi", "mov", "wmv", "mkv"
  ],
  "archive": [
    "zip", "rar", "7z"
  ],
  "code": [
    "json", "xml", "html", "htm", "css", "js", "ts"
  ],
  "executable": [
    "exe", "apk", "iso"
  ],
  "default": [
    "autre"
  ]
};

export const FILE_CATEGORIES: Option[] = [
  { label: '🖼️ Images', value: 'image' },
  { label: '🎵 Audios', value: 'audio' },
  { label: '🎬 Vidéos', value: 'video' },
  { label: '📄 Documents', value: 'document' },
  // {label: '🧳 Archives', value: 'archive'},
  // {label: '💻 Code', value: 'code'},
  // {label: '⚙️ Exécutables', value: 'executable'},
  // {label: '🧩 Autres', value: 'autre'}
];

export const FILE_TRI: Option[] = [
  { value: "date", label: "Trier par date" },
  { value: "name", label: "Trier par nom" },
  { value: "size", label: "Trier par taille" },
  { value: "type", label: "Trier par type" },
];

export const RELIABILITY_LEVELS = [
  { value: "5", label: "5 - Très élevée" }, // (Source officielle vérifiée)
  { value: "4", label: "4 - Élevée" }, // (Source reconnue et fiable)
  { value: "3", label: "3 - Moyenne" }, // (Source généralement fiable)
  { value: "2", label: "2 - Faible" }, // (Source à vérifier)
  { value: "1", label: "1 - Très faible" }, // (Source douteuse)
] as const;

export const SOURCE_INFO_TRI = [
  { value: "date", label: "Trier par date" },
  { value: "name", label: "Trier par nom" },
  { value: "reliability", label: "Trier par fiabilité" },
] as const;


export const PRIORITE_LEVELS: Option[] = [
  { value: 1, label: "1 - Très élevée" },
  { value: 2, label: "2 - Élevée" },
  { value: 3, label: "3 - Normale" },
  { value: 4, label: "4 - Faible" },
  { value: 5, label: "5 - Très faible" }
];

export const PRIORITE_LEVELS_LABEL: { [key: number]: string } = {
  1: "Très élevée",
  2: "Élevée",
  3: "Normale",
  4: "Faible",
  5: "Très faible"
};

export const TAB_TRAITEMENT_ENQUETE = [
  {
    id: "informations",
    label: "Informations générales",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "temoignages",
    label: "Témoignages",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    id: "documents",
    label: "Documents",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    id: "sources",
    label: "Sources d'information",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    id: "observations",
    label: "Observations",
    icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  },
];


export const APP_TYPE_DOCUMENT_AUTORISER:Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/vnd.ms-powerpoint": "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "text/plain": "TXT",
  "text/html": "HTML",
  "application/xml": "XML",
  "image/svg+xml": "SVG",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "video/mp4": "MP4",
  "video/webm": "WEBM",
  "video/ogg": "OGG",
  "audio/mpeg": "MP3",
  "audio/wav": "WAV",
}