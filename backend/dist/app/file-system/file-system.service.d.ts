export declare class FileSystemService {
    listFiles(folder: string): string[];
    compareFolders(folderA: string, folderB: string): {
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
    copyFiles(fromFolder: string, toFolder: string, files: string[]): {
        file: string;
        success: boolean;
        error?: string;
    }[];
    copyFilesWithProgress(files: string[], from: string, to: string): {
        copied: string[];
        errors: string[];
        total: number;
    };
}
