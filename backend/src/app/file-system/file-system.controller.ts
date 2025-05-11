import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FileSystemService } from './file-system.service';

@Controller('fs')
export class FileSystemController {
  constructor(private readonly fsService: FileSystemService) {}

  private folderA: string;
  private folderB: string;

  @Post('set-folders')
  setFolders(@Body() body: { folderA: string; folderB: string }) {
    this.folderA = body.folderA;
    this.folderB = body.folderB;
    return { message: 'Folders set successfully.' };
  }

  @Get('compare')
  compare(@Query('recursive') recursive?: string) {
    const isRecursive = recursive === 'true';

    return this.fsService.compareFolders(this.folderA, this.folderB, isRecursive);
  }

  @Post('copy')
  copyFiles(
    @Body() body: {
      files: string[];
      from: 'A' | 'B';
      to: 'A' | 'B';
      includeSubfolders?: boolean;
    }
  ) {
    const from = body.from === 'A' ? this.folderA : this.folderB;
    const to = body.to === 'A' ? this.folderA : this.folderB;
    return this.fsService.copyFiles(from, to, body.files, body.includeSubfolders);
  }
}
