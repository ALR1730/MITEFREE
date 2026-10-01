import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

describe('Turing-Grade Architecture Rules (Protocolo BETA & Clean Architecture)', () => {
  const srcDir = join(__dirname, '../src');
  const allSourceFiles = getAllFiles(srcDir);

  it('GivenDomainCore_WhenAnalyzingAllFiles_ThenFindsAtLeast10SourceFiles', () => {
    expect(allSourceFiles.length).toBeGreaterThanOrEqual(10);
  });

  it('GivenProtocoloBETA_WhenScanningImports_ThenDomainNeverImportsInfrastructureOrDelivery', () => {
    const forbiddenPatterns = [
      '@mitefree/database',
      '@mitefree/api',
      '@mitefree/pwa-client',
      '@mitefree/admin-portal',
      '@nestjs',
      'express',
      'drizzle-orm',
      '@neondatabase',
      'node:fs',
      'node:http',
    ];

    const violations: { file: string; forbidden: string }[] = [];

    for (const file of allSourceFiles) {
      const content = readFileSync(file, 'utf-8');

      for (const pattern of forbiddenPatterns) {
        if (content.includes(`'${pattern}`) || content.includes(`"${pattern}`)) {
          violations.push({ file, forbidden: pattern });
        }
      }
    }

    expect(
      violations,
      `Architecture violation detected! The domain core must NEVER import outer layers:\n${JSON.stringify(
        violations,
        null,
        2,
      )}`,
    ).toHaveLength(0);
  });

  it('GivenDomainAggregates_WhenInspectingConstructors_ThenQuotationAndWalletUseEncapsulatedConstructors', () => {
    const quotationContent = readFileSync(join(srcDir, 'entities/quotation.entity.ts'), 'utf-8');
    const walletContent = readFileSync(join(srcDir, 'entities/wallet.entity.ts'), 'utf-8');

    expect(quotationContent).toContain('private constructor(');
    expect(quotationContent).toContain('static create(');
    expect(quotationContent).toContain('static reconstitute(');

    expect(walletContent).toContain('private constructor(');
    expect(walletContent).toContain('static create(');
    expect(walletContent).toContain('static reconstitute(');
  });

  it('GivenValueObjects_WhenCreated_ThenAreImmutableAndProtectedByFreeze', () => {
    const moneyContent = readFileSync(join(srcDir, 'value-objects/money.vo.ts'), 'utf-8');
    const geoContent = readFileSync(join(srcDir, 'value-objects/geo-coordinate.vo.ts'), 'utf-8');

    expect(moneyContent).toContain('Object.freeze(this)');
    expect(geoContent).toContain('Object.freeze(this)');
  });
});
