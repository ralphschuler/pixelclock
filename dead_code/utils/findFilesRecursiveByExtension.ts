import * as fs from 'fs';
import * as path from 'path';

export function findFilesRecursiveByExtension(
  directory: string,
  extension: string
): string[] {
  const files = fs.readdirSync(directory);
  const result: string[] = [];
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const subFiles = findFilesRecursiveByExtension(filePath, extension);
      result.push(...subFiles);
    } else if (stat.isFile()) {
      if (path.extname(filePath) === extension) {
        result.push(filePath);
      }
    } else {
      continue;
    }
  }
  return result;
}