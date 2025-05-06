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
    listFiles(folder) {
        try {
            return fs.readdirSync(folder).filter(file => fs.statSync(path.join(folder, file)).isFile());
        }
        catch (err) {
            return [];
        }
    }
    compareFolders(folderA, folderB) {
        const filesA = this.listFiles(folderA);
        const filesB = this.listFiles(folderB);
        const onlyInA = filesA.filter(file => !filesB.includes(file));
        const onlyInB = filesB.filter(file => !filesA.includes(file));
        const inBoth = filesA.filter(file => filesB.includes(file));
        return { onlyInA, onlyInB, inBoth };
    }
    copyFiles(fromFolder, toFolder, files) {
        console.log('start');
        const results = [];
        files.forEach(file => {
            const fromPath = path.join(fromFolder, file);
            const toPath = path.join(toFolder, file);
            try {
                console.log('push');
                fs.copyFileSync(fromPath, toPath);
                results.push({ file, success: true });
            }
            catch (error) {
                results.push({ file, success: false, error: error.message });
            }
        });
        console.log(results);
        return results;
    }
};
exports.FileSystemService = FileSystemService;
exports.FileSystemService = FileSystemService = __decorate([
    (0, common_1.Injectable)()
], FileSystemService);
//# sourceMappingURL=file-system.service.js.map