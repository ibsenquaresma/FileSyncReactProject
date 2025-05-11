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
    compare(recursive?: string): {
        onlyInA: string[];
        onlyInB: string[];
        inBoth: string[];
        counts: {
            onlyInA: number;
            onlyInB: number;
            inBoth: number;
            total: number;
        };
    };
    copyFiles(body: {
        files: string[];
        from: 'A' | 'B';
        to: 'A' | 'B';
        includeSubfolders?: boolean;
    }): {
        file: string;
        success: boolean;
        error?: string;
    }[];
}
