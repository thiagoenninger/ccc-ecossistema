import type {
  AssetId,
  AssetResolution,
  ContentIndex,
  Exhibition,
  ValidationIssue,
} from '@ccc/types';

/**
 * Contrato de acesso ao conteúdo (ADR-007). Os componentes dependem somente desta interface:
 * a implementação local (JSON) pode ser trocada por IndexedDB/Cache Storage ou Firebase sem
 * alterar a apresentação.
 */
export interface ExhibitionRepository {
  /** Exposições publicadas neste equipamento e a exposição padrão. */
  listExhibitions(): Promise<ContentIndex>;
  /** Versão do conteúdo publicado (do manifesto). */
  getContentVersion(): Promise<string>;
  /**
   * Carrega uma exposição validada. Entrega somente obras publicadas, ordenadas por `order`.
   * @throws RepositoryError (`not-found`, `invalid-content` ou `load-failed`).
   */
  loadExhibition(exhibitionId: string): Promise<Exhibition>;
  /** Resolve um arquivo para uma URL utilizável ou para um estado indisponível (nunca lança). */
  resolveAssetUrl(assetId: AssetId): Promise<AssetResolution>;
}

export type RepositoryErrorCode = 'not-found' | 'invalid-content' | 'load-failed';

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode;
  readonly issues: ValidationIssue[];

  constructor(code: RepositoryErrorCode, message: string, issues: ValidationIssue[] = []) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
    this.issues = issues;
  }
}
