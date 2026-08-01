'use strict';

// Config do docgov (licorsy/docs-governance) para o ai-assisted-sdd-template.
//
// Substitui validate-docs-frontmatter.js, check-internal-links.js e
// check-changelog-retention.js (movidos de .github/scripts/ pra este motor
// compartilhado, ver docs/adr - Fase 4 do plano de governança documental do
// personal-os). Os scripts específicos do repositório continuam onde
// estavam: check-adapter-rules.js, check-adapter-sync.js,
// check-scope-consistency.js, check-step-references.js, generate-state.js.
// docgov não foi feito pra virar lógica de negócio de cada repositório.
//
// Esta config declara DADOS, não lógica. Se você precisar de uma checagem
// que não existe, ela vai para o motor, não para cá.
//
// scope_dirs/root_files vêm de .github/scripts/doc-scope.js em vez de uma
// cópia — CATEGORY_DIRS/SCOPE_FILES continuam a única fonte de verdade,
// exatamente o que check-scope-consistency.js existia pra proteger antes de
// checkLintWorkflow virar redundante com este require direto.

const { CATEGORY_DIRS, SCOPE_FILES } = require('./.github/scripts/doc-scope.js');

module.exports = {
  engine: '^1',

  rules: {
    // -----------------------------------------------------------------------
    frontmatter: {
      scope_dirs: CATEGORY_DIRS,
      root_files: SCOPE_FILES,
      exclude_prefixes: [],
      id_only_sources: [],

      required: ['title', 'doc_type', 'description', 'status', 'version', 'created', 'updated', 'language'],
      status_enum: ['draft', 'active', 'deprecated', 'archived'],
      doc_type_enum: [
        'instruction', 'manual', 'prompt', 'template', 'tool-catalog',
        'governance', 'adr', 'status-artifact', 'product-doc', 'spec-kit-artifact',
      ],
      date_fields: ['created', 'updated'],

      why: 'documentation-metadata-standard.md Seção 1. A resolução de `related:` é '
        + 'cross-file e é o que mantém o grafo de referências do corpus verificável.',
    },

    // -----------------------------------------------------------------------
    'internal-links': {
      exclude_dir_names: ['.git', 'node_modules', '.specify', 'local-notes'],
      skip_link_patterns: [],

      why: 'documentation-metadata-standard.md Seção 4, check 4. ADR-0004 apoiou-se '
        + 'nesta checagem como rede de segurança pra reorganizar docs/manuals/ sem '
        + 'quebrar referência cruzada.',
    },

    // -----------------------------------------------------------------------
    'changelog-retention': {
      // docs/prompts/ não usa changelog de corpo (retenção é via status:
      // draft/active/archived/deprecated no frontmatter, não uma lista no corpo);
      // docs/reports/ é material de status/relatório sem changelog de corpo.
      scope_dirs: CATEGORY_DIRS.filter((d) => !['docs/prompts', 'docs/reports'].includes(d)),
      root_files: [],
      exclude_prefixes: [],
      exclude_files: [],

      marker: 'Changelog of this document:',
      max_entries: 3,

      why: 'documentation-metadata-standard.md Seção 2.1. Documentos vivos mantêm só '
        + 'as 3 entradas mais novas; histórico completo é `git log --follow`.',
    },

    // -----------------------------------------------------------------------
    'version-bump': {
      enabled: true,
      why: 'Documento versionado modificado sem bump de `version:` é o mesmo defeito '
        + 'que motivou esta regra no personal-os (2 violações reais na mesma sessão).',
    },

    // -----------------------------------------------------------------------
    // shadow (não falha CI ainda) — adotada em 2026-08-01 depois de 3 rodadas
    // de doc-consistency-reviewer sobre o mesmo defeito: citação inline-code
    // de um prompt/ADR arquivado só no repositório privado (aleclemente/
    // ai-assisted-sdd-template, arquivado) que `internal-links` não vê por
    // não ser sintaxe de link Markdown de verdade. `self_qualifying` reflete
    // a frase que já foi escrita nos ~11 sites corrigidos manualmente
    // (docs/prompts/003-close-restart-followon-drift.md) — qualquer citação
    // nova sem essa frase agora vira achado mecânico, não mais uma varredura
    // cara de LLM a cada ciclo. Ainda shadow: o backlog de citações
    // pré-existentes (números < 110, arquivo privado nunca migrado) não foi
    // zerado nesta sessão — o objetivo era ligar a checagem, não esgotar o
    // backlog de uma vez.
    dead_citations: {
      scope_dirs: CATEGORY_DIRS,
      root_files: SCOPE_FILES,
      exclude_prefixes: [],
      exclude_files: [],
      patterns: [
        { id: 'md-files', kind: 'filename' },
        { id: 'prompts', kind: 'prefix-id', prefix: 'prompt', dir: 'docs/prompts', digits: 3 },
      ],
      exempt: {
        fenced_code: true,
        self_qualifying: /archived private-repo sequence/,
      },

      why: 'operation-manual.md Step 12 regra 3 - o motivo de existência desta regra '
        + 'é a classe de defeito que produziu 3 rodadas seguidas de achados de '
        + 'doc-consistency-reviewer sem convergir (docs/prompts/003-close-restart-followon-drift.md).',
    },

    // -----------------------------------------------------------------------
    // Fase 2: liga o predicado de isenção "registro histórico ≠ afirmação
    // atual" (lib/exempt.js) já existente no motor, em vez de reimplementar
    // à mão, sessão a sessão, o mesmo qualificador "arquivo histórico,
    // citação não resolvível aqui" em prosa.
    version_citations: {
      scope_dirs: CATEGORY_DIRS,
      root_files: SCOPE_FILES,
      exempt: {
        // docs/prompts/ já é tratado como arquivo histórico congelado por
        // changelog-retention acima (mesmo comentário); uma citação de
        // versão dentro de um prompt arquivado é um registro do que era
        // verdade então, não uma afirmação atual — mesmo raciocínio.
        historical_paths: ['docs/prompts'],
        // O changelog de corpo por documento (ex.: agents/init.md) cita
        // versões de outros arquivos como estavam na época de cada entrada
        // — não é uma reafirmação atual. Verificado: CHANGELOG.md na raiz
        // usa uma estrutura Keep-a-Changelog diferente e não está em
        // SCOPE_FILES, então esta isenção cobre exatamente o padrão real
        // observado (agents/init.md v1.7, citando `prompt-086` v1.5).
        inside_changelog_block: true,
        changelog_marker: 'Changelog of this document:',
      },
      why: 'a citação `path.md` vX.Y é uma afirmação verificável — sem isenção pra '
        + 'registro histórico, o mesmo qualificador manual "histórico, não citável '
        + 'aqui" teria que ser reescrito à mão em cada prompt arquivado.',
    },
  },
};
