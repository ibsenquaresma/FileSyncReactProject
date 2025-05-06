import { FileSystemService } from './file-system.service';
export declare class FileSystemController {
    private readonly fsService;
    constructor(fsService: FileSystemService);
    private folderA;
    private folderB;
    setFolders(body: {
        folderA: string;
        folderB: string;
    }): {
        message: string;
    };
    compare(): {
        onlyInA: string[];
        onlyInB: string[];
        inBoth: string[];
    };
    copyFiles(body: {
        files: string[];
        from: 'A' | 'B';
        to: 'A' | 'B';
    }): {
        file: string;
        success: boolean;
        error?: string;
    }[];
}
