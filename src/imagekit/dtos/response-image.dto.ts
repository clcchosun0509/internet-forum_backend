class AITag {
  name: string;
  confidence: number;
  source: string;
}

class VersionInfo {
  id: string;
  name: string;
}

class CustomMetadata {
  brand: string;
  color: string;
}

class EmbeddedMetadata {
  Title: string;
  Description: string;
  State: string;
  Copyright: string;
}

class ExtensionStatus {
  'google-auto-tagging': string;
  'aws-auto-tagging': string;
}

export class ResponseImageDto {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags: string[];
  AITags: AITag[];
  versionInfo: VersionInfo;
  isPrivateFile: boolean;
  customCoordinates: string;
  customMetadata: CustomMetadata;
  embeddedMetadata: EmbeddedMetadata;
  extensionStatus: ExtensionStatus;
  fileType: string;
}