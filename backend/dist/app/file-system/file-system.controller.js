"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemController = void 0;
const common_1 = require("@nestjs/common");
const file_system_service_1 = require("./file-system.service");
let FileSystemController = class FileSystemController {
    fsService;
    constructor(fsService) {
        this.fsService = fsService;
    }
    folderA;
    folderB;
    setFolders(body) {
        this.folderA = body.folderA;
        this.folderB = body.folderB;
        return { message: 'Folders set successfully.' };
    }
    compare(recursive) {
        const isRecursive = recursive === 'true';
        return this.fsService.compareFolders(this.folderA, this.folderB, isRecursive);
    }
    copyFiles(body) {
        const from = body.from === 'A' ? this.folderA : this.folderB;
        const to = body.to === 'A' ? this.folderA : this.folderB;
        return this.fsService.copyFiles(from, to, body.files, body.includeSubfolders);
    }
};
exports.FileSystemController = FileSystemController;
__decorate([
    (0, common_1.Post)('set-folders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FileSystemController.prototype, "setFolders", null);
__decorate([
    (0, common_1.Get)('compare'),
    __param(0, (0, common_1.Query)('recursive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileSystemController.prototype, "compare", null);
__decorate([
    (0, common_1.Post)('copy'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FileSystemController.prototype, "copyFiles", null);
exports.FileSystemController = FileSystemController = __decorate([
    (0, common_1.Controller)('fs'),
    __metadata("design:paramtypes", [file_system_service_1.FileSystemService])
], FileSystemController);
//# sourceMappingURL=file-system.controller.js.map