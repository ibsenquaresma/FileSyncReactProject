import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  listFiles(folder: string): string[] {
    try {
      return fs.readdirSync(folder).filter(file => fs.statSync(path.join(folder, file)).isFile());
    } catch (err) {
      return [];
    }
  }

  compareFolders(folderA: string, folderB: string) {
    const filesA = this.listFiles(folderA);
    const filesB = this.listFiles(folderB);

    const onlyInA = filesA.filter(file => !filesB.includes(file));
    const onlyInB = filesB.filter(file => !filesA.includes(file));
    const inBoth = filesA.filter(file => filesB.includes(file));

    return { onlyInA, onlyInB, inBoth };
  }

  copyFiles(fromFolder: string, toFolder: string, files: string[]) {
    console.log('start');
    const results: { file: string; success: boolean; error?: string }[] = [];

    files.forEach(file => {
      const fromPath = path.join(fromFolder, file);
      const toPath = path.join(toFolder, file);

      try {
        console.log('push');
        fs.copyFileSync(fromPath, toPath);
        results.push({ file, success: true });
      } catch (error) {
        results.push({ file, success: false, error: error.message });
      }
    });
    console.log(results);
    return results;
  }
}