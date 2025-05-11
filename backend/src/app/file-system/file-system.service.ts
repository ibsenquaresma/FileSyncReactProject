import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {


  listFiles(folder: string, recursive = false): string[] {
    const fileList: string[] = [];

    const walk = (currentPath: string, basePath: string) => {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const relativePath = path.relative(basePath, fullPath);
        const stats = fs.statSync(fullPath);

        if (stats.isFile()) {
          fileList.push(relativePath);
        } else if (recursive && stats.isDirectory()) {
          walk(fullPath, basePath);
        }
      }
    };

    try {
      walk(folder, folder);
      return fileList;
    } catch (err) {
      return [];
    }
  }

  private safeStat(fullPath: string): fs.Stats | null {
    try {
      return fs.statSync(fullPath);
    } catch (err) {
      console.warn('Erro ao acessar:', fullPath, err.message);
      return null;
    }
  }


  private walkDirectory(dir: string, includeSubfolders: boolean): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const stat = this.safeStat(fullPath);

      if (!stat) {
        console.warn(`Ignorado (sem permissão ou online-only): ${fullPath}`);
        continue;
      }

      if (entry.isFile()) {
        files.push(fullPath);
      } else if (includeSubfolders && entry.isDirectory()) {
        files.push(...this.walkDirectory(fullPath, includeSubfolders));
      }
    }
    return files;
  }


  compareFolders(folderA: string, folderB: string, recursive = false) {
    
    const filesA = this.walkDirectory(folderA, true).map(f => path.relative(folderA, f));
    const filesB = this.walkDirectory(folderB, true).map(f => path.relative(folderB, f));
    //console.log(filesA);
    const setA = new Set(filesA);
    const setB = new Set(filesB);

    const onlyInA = filesA.filter(f => !setB.has(f));
    const onlyInB = filesB.filter(f => !setA.has(f));
    const inBoth = filesA.filter(f => setB.has(f));
    console.log(setA);
    // return { onlyInA1, onlyInB1, inBoth1 };
    
    // const filesA = this.listFiles(folderA, recursive);
    // const filesB = this.listFiles(folderB, recursive);

    // const onlyInA = filesA.filter(file => !filesB.includes(file));
    // const onlyInB = filesB.filter(file => !filesA.includes(file));
    // const inBoth = filesA.filter(file => filesB.includes(file));

    // console.log("onlyInA: " + onlyInA.length);
    // console.log("onlyInB: " + onlyInB.length);
    // console.log("inBoth: " + inBoth.length);

    return {
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
  }

  copyFiles(fromFolder: string, toFolder: string, files: string[], includeSubfolders = false) {
      const results: { file: string; success: boolean; error?: string }[] = [];

      const copyRecursive = (srcPath: string, destPath: string) => {
          const stat = fs.statSync(srcPath);
          if (stat.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            const subFiles = fs.readdirSync(srcPath);
            subFiles.forEach(subFile => {
              copyRecursive(path.join(srcPath, subFile), path.join(destPath, subFile));
            });
          } else {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(srcPath, destPath);
          }
      };

  files.forEach(file => {
      const fromPath = path.join(fromFolder, file);
      const toPath = path.join(toFolder, file);

      try {
        if (includeSubfolders) {
          copyRecursive(fromPath, toPath);
        } else {
          if (fs.statSync(fromPath).isFile()) {
            fs.mkdirSync(path.dirname(toPath), { recursive: true });
            fs.copyFileSync(fromPath, toPath);
          }
        }
        results.push({ file, success: true });
      } catch (error) {
        results.push({ file, success: false, error: error.message });
      }
    });

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