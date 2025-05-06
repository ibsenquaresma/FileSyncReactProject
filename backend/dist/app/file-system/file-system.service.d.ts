export declare class FileSystemService {
    listFiles(folder: string): string[];
    compareFolders(folderA: string, folderB: string): {
        onlyInA: string[];
        onlyInB: string[];
        inBoth: string[];
    };
    copyFiles(fromFolder: string, toFolder: string, files: string[]): {
        file: string;
        success: boolean;
        error?: string;
    }[];
}
