"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let FileSystemService = class FileSystemService {
    listFiles(folder, recursive = false) {
        const fileList = [];
        const walk = (currentPath, basePath) => {
            const items = fs.readdirSync(currentPath);
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const relativePath = path.relative(basePath, fullPath);
                const stats = fs.statSync(fullPath);
                if (stats.isFile()) {
                    fileList.push(relativePath);
                }
                else if (recursive && stats.isDirectory()) {
                    walk(fullPath, basePath);
                }
            }
        };
        try {
            walk(folder, folder);
            return fileList;
        }
        catch (err) {
            return [];
        }
    }
    safeStat(fullPath) {
        try {
            return fs.statSync(fullPath);
        }
        catch (err) {
            console.warn('Erro ao acessar:', fullPath, err.message);
            return null;
        }
    }
    walkDirectory(dir, includeSubfolders) {
        const files = [];
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
            }
            else if (includeSubfolders && entry.isDirectory()) {
                files.push(...this.walkDirectory(fullPath, includeSubfolders));
            }
        }
        return files;
    }
    compareFolders(folderA, folderB, recursive = false) {
        const filesA = this.walkDirectory(folderA, true).map(f => path.relative(folderA, f));
        const filesB = this.walkDirectory(folderB, true).map(f => path.relative(folderB, f));
        const setA = new Set(filesA);
        const setB = new Set(filesB);
        const onlyInA = filesA.filter(f => !setB.has(f));
        const onlyInB = filesB.filter(f => !setA.has(f));
        const inBoth = filesA.filter(f => setB.has(f));
        console.log(setA);
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
    copyFiles(fromFolder, toFolder, files, includeSubfolders = false) {
        const results = [];
        const copyRecursive = (srcPath, destPath) => {
            const stat = fs.statSync(srcPath);
            if (stat.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                const subFiles = fs.readdirSync(srcPath);
                subFiles.forEach(subFile => {
                    copyRecursive(path.join(srcPath, subFile), path.join(destPath, subFile));
                });
            }
            else {
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
                }
                else {
                    if (fs.statSync(fromPath).isFile()) {
                        fs.mkdirSync(path.dirname(toPath), { recursive: true });
                        fs.copyFileSync(fromPath, toPath);
                    }
                }
                results.push({ file, success: true });
            }
            catch (error) {
                results.push({ file, success: false, error: error.message });
            }
        });
        return results;
    }
    copyFilesWithProgress(files, from, to) {
        const copied = [];
        const errors = [];
        for (const file of files) {
            try {
                const sourcePath = path.join(from, file);
                const targetPath = path.join(to, file);
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.copyFileSync(sourcePath, targetPath);
                copied.push(file);
            }
            catch (err) {
                errors.push(file);
            }
        }
        return {
            copied,
            errors,
            total: files.length
        };
    }
};
exports.FileSystemService = FileSystemService;
exports.FileSystemService = FileSystemService = __decorate([
    (0, common_1.Injectable)()
], FileSystemService);
//# sourceMappingURL=file-system.service.js.map