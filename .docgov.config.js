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
        // Reusa o marcador do próprio version_citations logo abaixo, pra que
        // as duas regras concordem sobre a extensão do bloco de changelog.
        inside_changelog_block: true,
        changelog_marker: 'Changelog of this document:',
        // Linhas de tabela do PROPOSAL-TRACKING.md com Status `deferred`/
        // `rejected` (ver cabeçalho do arquivo, linha 20, pros cinco valores
        // válidos) registram uma decisão já tomada sobre uma proposta - não
        // uma reafirmação atual do que existe. A segunda alternativa cobre a
        // mesma ideia em prosa fora de tabela (docs/adr/0002-audience-tier.md).
        // `\b` (not a closing `\|`) on purpose: a Status cell isn't always
        // the bare enum value alone - two rows carry a parenthetical
        // qualifier in the same cell ("deferred (Bolt piece rejected)",
        // "rejected (GEMINI/OPENAI) / deferred (KIRO)"). Verified repo-wide:
        // the only other hit is a legend line ("Status: candidate | adopted
        // | rejected") with no citation on it to mask.
        completed_items: /\|\s*(?:deferred|rejected)\b|not yet a citable path in this repository/,
        // `target_allowlist` (chave nova do motor, adicionada em paralelo em
        // licorsy/docs-governance - engine mais antigo ignora chave
        // desconhecida em silêncio, então este bloco é seguro de mesclar
        // independente da ordem de merge entre os dois repositórios):
        // citações que nunca resolvem NESTE repositório por design -
        // referências futuras de um projeto gerado a partir deste template
        // (`status.md`, `docs/risks.md`, `.specify/memory/constitution.md`
        // etc. - artefatos que só existirão no projeto que adota o
        // template, nunca aqui), nomes de saída de ferramentas de terceiros
        // citados em docs/manuals/tool-library-catalog.md (EvolveHQ/docflow,
        // a skill graphify, mattpocock/skills grilling), placeholders
        // ilustrativos de uma convenção de nomenclatura (`NNN-slug.md`,
        // `001-...md`), e o próprio caminho pré-renumeração deste
        // repositório (`docs/adr/0010-public-release.md`, renumerado por
        // `docs/prompts/002-renumber-adr-0010-to-0005.md` - citação de
        // registro histórico, mantida deliberadamente morta). Casado contra
        // o alvo bruto da citação (a string dentro dos crases), não a linha
        // que a cita - cada forma (bare/`docs/`-prefixada/`/`-prefixada) é
        // uma string distinta e só entra aqui se de fato citada no repo.
        target_allowlist: [
          'status.md', 'docs/status.md', '/docs/status.md',
          'risks.md', 'docs/risks.md', '/docs/risks.md',
          'handbook.md', 'docs/handbook.md', '/docs/handbook.md',
          'governance.md', 'docs/governance.md', '/docs/governance.md',
          'plan.md', 'docs/plan.md', '/docs/plan.md',
          'prd.md', 'docs/prd.md', '/docs/prd.md',
          'market.md', 'docs/business/market.md', '/docs/business/market.md',
          'docs/task.md', 'tasks.md',
          'docs/references/retrospective.md',
          'docs/references/test-report.md', '/docs/references/test-report.md', 'test-report.md',
          'docs/references/build-vs-buy.md', '/docs/references/build-vs-buy.md', 'build-vs-buy.md',
          'docs/references/backlog.md', '/docs/references/backlog.md', 'backlog.md',
          'docs/references/data-model.md', '/docs/references/data-model.md',
          'docs/references/problem-statement.md', '/docs/references/problem-statement.md', 'problem-statement.md',
          'docs/references/existing-system-inventory.md', '/docs/references/existing-system-inventory.md', 'existing-system-inventory.md',
          'docs/references/requirements.md', '/docs/references/requirements.md', 'requirements.md',
          '/docs/references/user-stories.md', 'user-stories.md',
          '/docs/references/mvp-scope.md', 'mvp-scope.md',
          '/docs/references/brainstorm.md', 'brainstorm.md',
          '/docs/references/tree-of-thought-brainstorm.md', 'tree-of-thought-brainstorm.md',
          '/docs/references/integration-points.md', 'integration-points.md',
          '.specify/memory/constitution.md', '.specify/memory/clarifications.md', '.specify/plans/technical-strategy.md',
          '/docs/adr/0000-adr-template.md',
          // Referência futura a um ADR-0001 de um PROJETO GERADO por este
          // template - distinto de docs/manuals/examples/adr-0001-
          // documentation-and-governance-model.md (o exemplo trabalhado real
          // deste repositório), confirmado por docs/adr/0004-docs-category-
          // directories.md.
          '/docs/adr/0001-documentation-and-governance-model.md',
          'docs/business/pricing.md', 'docs/business/positioning.md',
          // Caminho pré-renumeração deste próprio repositório, morto por
          // design (ver comentário do bloco acima).
          'docs/adr/0010-public-release.md', '0010-public-release.md',
          'NNN-slug.md', 'NNN-prompt-slug.md', 'docs/prompts/NNN-prompt-slug.md',
          'docs/prompts/001-003.md', 'docs/prompts/001-...md', '001-...md', '002-...md',
          'security-baseline.opt-in.md', 'property-based-testing.opt-in.md',
          'GLOSSARY.md', 'CONTEXT.md', 'GRAPH_REPORT.md', 'CONVENTIONS.md', 'INDEX.md', 'SKILL.md',
          'adr/0000-template.md', 'skills/productivity/grilling/SKILL.md',
          // Nome proposto e nunca lançado (PROPOSAL-TRACKING.md R008-5.2);
          // `feature_request.md` foi o que de fato foi lançado em seu lugar.
          '.github/ISSUE_TEMPLATE/improvement.md',
        ],
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

    // -----------------------------------------------------------------------
    // Fixa a cadeia de promoção develop -> staging -> main, que é afirmada em
    // prosa nos adaptadores e imposta em YAML no workflow — dois lugares, sem
    // nada mantendo os dois em sincronia. Exatamente a classe de defeito para
    // a qual esta regra existe.
    //
    // Este bloco nasceu no prompt 005 fixando outra coisa: o `--no-merges` do
    // lint de mensagens de commit. Aquele step foi removido inteiro depois
    // (commit 9257c73, por razão própria e correta), e o bloco ficou com
    // `entries: []` — uma regra blocking que não checava nada, sob um
    // comentário descrevendo um check inexistente. Re-apontado no prompt 006
    // para um alvo que existe e é load-bearing.
    facts: {
      // NÃO shadow. `facts` vem com shadow ligado — reporta e nunca falha — e
      // foi justamente isso que deixou o defeito do prompt 005 sobreviver em
      // três cópias scaffolded antes de ser notado. Sem shadow a regra também
      // roda sob `--changed`, então o pre-commit pega a regressão, não a CI na
      // promoção. Não altera `dead_citations`, que segue shadow por decisão
      // do prompt 004: aquela regra tem backlog real de achados, esta confere
      // um valor declarado.
      shadow: false,
      scope_dirs: CATEGORY_DIRS,
      root_files: SCOPE_FILES,
      entries: [
        {
          id: 'promotion-chain-develop-staging-main',
          value: 'staging <- develop; main <- staging',
          why: 'a cadeia de promoção é afirmada como matriz de permissão em '
            + 'CLAUDE.md/AGENTS.md e imposta como mapeamento de base ref no job '
            + '`promotion-source`. Nenhum mecanismo ligava os dois: o bloco '
            + 'sync do check-adapter-sync.js cobre o texto CLAUDE.md<->AGENTS.md, '
            + 'nunca o YAML. Se o job for afrouxado ou removido, a prosa segue '
            + 'prometendo uma barreira que não existe — que é literalmente o que '
            + 'aconteceu com o lint que este bloco fixava antes.',
          required_in: [
            {
              file: '.github/workflows/pr-checks.yml',
              pattern: /staging\)\s*expected=develop[\s\S]*?main\)\s*expected=staging/,
            },
            {
              file: 'CLAUDE.md',
              pattern: /autonomous up to `develop`; explicit human permission required for `staging`\/`main`/,
            },
            {
              file: 'AGENTS.md',
              pattern: /autonomous up to `develop`; explicit human permission required for `staging`\/`main`/,
            },
          ],
        },
      ],
    },
  },
};
