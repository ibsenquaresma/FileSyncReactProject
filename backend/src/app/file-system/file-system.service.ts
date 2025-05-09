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
    console.log(onlyInA);
    console.log(onlyInB);
    console.log(inBoth);

    const result = {
      onlyInA,
      onlyInB,
      inBoth,
      counts: {
        onlyInA: onlyInA.length,
        onlyInB: onlyInB.length,
        inBoth: inBoth.length,
        total: onlyInA.length + onlyInB.length + inBoth.length,
      },
    };

    return result;

    //return { onlyInA, onlyInB, inBoth };
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

  copyFilesWithProgress(files: string[], from: string, to: string): { copied: string[], errors: string[], total: number } {
    const copied : string[] = [];
    const errors : string[] = [];
  
    for (const file of files) {
      try {
        const sourcePath = path.join(from, file);
        const targetPath = path.join(to, file);
  
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourcePath, targetPath);
  
        copied.push(file);
      } catch (err) {
        errors.push(file);
      }
    }
  
    return {
      copied,
      errors,
      total: files.length
    };
  }
}