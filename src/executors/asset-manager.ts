/**
 * Presentation Asset Manager - Handles assets for presentation pipeline
 *
 * This manager specializes in:
 * - Creating presentation directory structures
 * - Managing image assets and visual content
 * - Tracking asset status and availability
 * - Integrating with the presentation generation workflow
 */

import { PresentationAssets } from '../core/types.js';
import logger from '../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';

export interface AssetManagerResult {
  success: boolean;
  assets_prepared: number;
  directory_created: boolean;
  errors: string[];
  asset_summary: AssetSummary;
}

export interface AssetSummary {
  total_assets: number;
  images: number;
  diagrams: number;
  custom_assets: number;
  ready_assets: number;
  pending_assets: number;
}

export interface AssetDownloadRequest {
  asset_key: string;
  asset_type: 'image' | 'diagram' | 'custom';
  source_url?: string;
  local_filename: string;
  description?: string;
}

/**
 * PresentationAssetManager - Core class for managing presentation assets
 */
export class PresentationAssetManager {
  /**
   * Initialize presentation directory structure and asset tracking
   *
   * @param presentationTitle Title of the presentation for directory naming
   * @param baseDirectory Base directory for presentations (default: ./presentations)
   * @returns Initialized PresentationAssets with directory structure
   */
  async initializePresentationProject(
    presentationTitle: string,
    baseDirectory: string = './presentations'
  ): Promise<PresentationAssets> {
    try {
      // Sanitize presentation title for directory name
      const sanitizedTitle = this.sanitizeDirectoryName(presentationTitle);
      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const projectDir = path.join(baseDirectory, `${sanitizedTitle}_${timestamp}`);

      // Create directory structure
      await this.createDirectoryStructure(projectDir);

      // Initialize asset tracking
      const assets: PresentationAssets = {
        project_directory: projectDir,
        images: {},
        diagrams: {},
        custom_assets: {},
        asset_status: {},
      };

      logger.info(`Presentation project initialized: ${projectDir}`);
      return assets;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Failed to initialize presentation project: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Create the standard directory structure for presentations
   */
  private async createDirectoryStructure(projectDir: string): Promise<void> {
    const directories = [
      projectDir,
      path.join(projectDir, 'slides'),
      path.join(projectDir, 'assets'),
      path.join(projectDir, 'assets', 'images'),
      path.join(projectDir, 'assets', 'diagrams'),
      path.join(projectDir, 'assets', 'custom'),
      path.join(projectDir, 'output'),
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        logger.debug(`Created directory: ${dir}`);
      } catch (error) {
        logger.error(`Failed to create directory ${dir}: ${error}`);
        throw error;
      }
    }
  }

  /**
   * Prepare assets for presentation generation
   *
   * @param assets Current presentation assets
   * @param assetRequests Array of asset download/preparation requests
   * @returns Asset preparation result with status
   */
  async prepareAssets(
    assets: PresentationAssets,
    assetRequests: AssetDownloadRequest[]
  ): Promise<AssetManagerResult> {
    const errors: string[] = [];
    let assetsPrepared = 0;

    logger.info(`Preparing ${assetRequests.length} assets for presentation`);

    try {
      // Process each asset request
      for (const request of assetRequests) {
        try {
          const success = await this.processAssetRequest(assets, request);
          if (success) {
            assetsPrepared++;
            assets.asset_status[request.asset_key] = 'ready';
          } else {
            assets.asset_status[request.asset_key] = 'pending';
            errors.push(`Failed to prepare asset: ${request.asset_key}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Error processing ${request.asset_key}: ${errorMessage}`);
          assets.asset_status[request.asset_key] = 'pending';
        }
      }

      const assetSummary = this.generateAssetSummary(assets);

      return {
        success: errors.length === 0,
        assets_prepared: assetsPrepared,
        directory_created: true,
        errors,
        asset_summary: assetSummary,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Asset preparation failed: ${errorMessage}`);

      return {
        success: false,
        assets_prepared: assetsPrepared,
        directory_created: true,
        errors: [errorMessage],
        asset_summary: this.generateAssetSummary(assets),
      };
    }
  }

  /**
   * Process a single asset request
   */
  private async processAssetRequest(
    assets: PresentationAssets,
    request: AssetDownloadRequest
  ): Promise<boolean> {
    try {
      const targetDir = this.getAssetDirectory(assets.project_directory, request.asset_type);
      const filePath = path.join(targetDir, request.local_filename);

      // For now, create placeholder files (in real implementation, would download/generate)
      await this.createPlaceholderAsset(filePath, request);

      // Update asset tracking
      switch (request.asset_type) {
        case 'image':
          assets.images[request.asset_key] = filePath;
          break;
        case 'diagram':
          assets.diagrams[request.asset_key] = filePath;
          break;
        case 'custom':
          assets.custom_assets[request.asset_key] = filePath;
          break;
      }

      logger.debug(`Asset prepared: ${request.asset_key} -> ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to process asset ${request.asset_key}: ${error}`);
      return false;
    }
  }

  /**
   * Get the appropriate asset directory based on type
   */
  private getAssetDirectory(projectDir: string, assetType: string): string {
    const assetDirs = {
      image: path.join(projectDir, 'assets', 'images'),
      diagram: path.join(projectDir, 'assets', 'diagrams'),
      custom: path.join(projectDir, 'assets', 'custom'),
    };

    return assetDirs[assetType as keyof typeof assetDirs] || path.join(projectDir, 'assets');
  }

  /**
   * Create a placeholder asset file (in real implementation, would download/generate)
   */
  private async createPlaceholderAsset(
    filePath: string,
    request: AssetDownloadRequest
  ): Promise<void> {
    const placeholderContent = this.generatePlaceholderContent(request);
    await fs.writeFile(filePath, placeholderContent, 'utf-8');
  }

  /**
   * Generate placeholder content for assets
   */
  private generatePlaceholderContent(request: AssetDownloadRequest): string {
    const timestamp = new Date().toISOString();

    switch (request.asset_type) {
      case 'image':
        return `<!-- Image Placeholder: ${request.asset_key} -->
<!-- Generated: ${timestamp} -->
<!-- Description: ${request.description || 'No description'} -->
<!-- Source: ${request.source_url || 'Local generation'} -->
<div class="image-placeholder" style="width: 100%; height: 300px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
  <span style="color: #666; font-size: 16px;">${request.asset_key}</span>
</div>`;

      case 'diagram':
        return `<!-- Diagram Placeholder: ${request.asset_key} -->
<!-- Generated: ${timestamp} -->
<!-- Description: ${request.description || 'No description'} -->
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f9f9f9" stroke="#ddd" stroke-width="2"/>
  <text x="200" y="150" text-anchor="middle" style="font-family: Arial; font-size: 14px; fill: #666;">
    ${request.asset_key}
  </text>
  <text x="200" y="170" text-anchor="middle" style="font-family: Arial; font-size: 12px; fill: #999;">
    Diagram Placeholder
  </text>
</svg>`;

      case 'custom':
        return `/* Custom Asset: ${request.asset_key} */
/* Generated: ${timestamp} */
/* Description: ${request.description || 'No description'} */

.custom-asset-${request.asset_key.replace(/[^a-zA-Z0-9]/g, '-')} {
  /* Custom styles for ${request.asset_key} */
  display: block;
  margin: 20px auto;
  text-align: center;
}`;

      default:
        return `Asset: ${request.asset_key}
Generated: ${timestamp}
Type: ${request.asset_type}
Description: ${request.description || 'No description'}`;
    }
  }

  /**
   * Generate asset summary for reporting
   */
  private generateAssetSummary(assets: PresentationAssets): AssetSummary {
    const images = Object.keys(assets.images).length;
    const diagrams = Object.keys(assets.diagrams).length;
    const custom_assets = Object.keys(assets.custom_assets).length;
    const total_assets = images + diagrams + custom_assets;

    const assetStatuses = Object.values(assets.asset_status);
    const ready_assets = assetStatuses.filter(status => status === 'ready').length;
    const pending_assets = assetStatuses.filter(status => status === 'pending').length;

    return {
      total_assets,
      images,
      diagrams,
      custom_assets,
      ready_assets,
      pending_assets,
    };
  }

  /**
   * Sanitize presentation title for safe directory naming
   */
  private sanitizeDirectoryName(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove multiple consecutive hyphens
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length
  }

  /**
   * Create sample asset requests for testing
   */
  static createSampleAssetRequests(topic: string): AssetDownloadRequest[] {
    return [
      {
        asset_key: 'title_background',
        asset_type: 'image',
        local_filename: 'title_background.jpg',
        description: `Background image for ${topic} presentation title`,
      },
      {
        asset_key: 'architecture_diagram',
        asset_type: 'diagram',
        local_filename: 'architecture.svg',
        description: `Architecture diagram for ${topic}`,
      },
      {
        asset_key: 'process_flow',
        asset_type: 'diagram',
        local_filename: 'process_flow.svg',
        description: `Process flow diagram for ${topic}`,
      },
      {
        asset_key: 'custom_styles',
        asset_type: 'custom',
        local_filename: 'custom_styles.css',
        description: `Custom styles for ${topic} presentation`,
      },
      {
        asset_key: 'logo',
        asset_type: 'image',
        local_filename: 'logo.png',
        description: 'Company or project logo',
      },
    ];
  }

  /**
   * Check if presentation directory exists and is valid
   */
  async validatePresentationDirectory(projectDir: string): Promise<boolean> {
    try {
      const stats = await fs.stat(projectDir);
      if (!stats.isDirectory()) {
        return false;
      }

      // Check for expected subdirectories
      const expectedDirs = ['slides', 'assets', 'output'];
      for (const dir of expectedDirs) {
        const dirPath = path.join(projectDir, dir);
        try {
          const dirStats = await fs.stat(dirPath);
          if (!dirStats.isDirectory()) {
            return false;
          }
        } catch {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get asset status report
   */
  getAssetStatusReport(assets: PresentationAssets): string {
    const summary = this.generateAssetSummary(assets);

    return `Asset Status Report:
Directory: ${assets.project_directory}
Total Assets: ${summary.total_assets}
- Images: ${summary.images}
- Diagrams: ${summary.diagrams} 
- Custom Assets: ${summary.custom_assets}

Status:
- Ready: ${summary.ready_assets}
- Pending: ${summary.pending_assets}
`;
  }
}
