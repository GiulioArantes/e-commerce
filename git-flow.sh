#!/bin/bash

# ---------------------------------------------------------------
# Configurações Personalizadas
# ---------------------------------------------------------------

# Tipos permitidos e mapeamento para emojis
declare -A EMOJI_MAP=(
  ["feat"]="✨"
  ["fix"]="🐛"
  ["docs"]="📚"
  ["style"]="💄"
  ["refactor"]="♻️"
  ["test"]="✅"
  ["chore"]="🔧"
  ["revert"]="⏪️"
)

# Escopos permitidos para branch e commit
VALID_BRANCH_SCOPES=("js/script" "js/cart" "css" "assets" "docs" "fix" "refactor" "Project" "repository")
VALID_COMMIT_SCOPES=("docs" "script" "cart" "css" "config" "repositor" "accessibility" "Project" "eslint")

DEFAULT_PR_BASE="main"        # Branch base para PRs
AUTO_FORMAT=true              # Executa Prettier antes de commits

# ---------------------------------------------------------------
# Validação de Parâmetros
# ---------------------------------------------------------------
# Agora o script espera 4 parâmetros obrigatórios:
# $1: tipo
# $2: branch scope
# $3: commit scope (pode ser múltiplo, separados por vírgula)
# $4: mensagem (descrição curta)
# $5: issue (opcional)

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Uso: $0 <tipo> <branch-scope> <commit-scope> \"<mensagem>\" [issue-number]"
    echo "Ex: $0 feat js/cart project/ecommerce \"add shopping cart functionality\" 123"
    exit 1
fi

# Valida o tipo (deve estar presente no EMOJI_MAP)
if [[ -z "${EMOJI_MAP[$1]}" ]]; then
    echo "Tipo inválido! Os tipos válidos são: feat, fix, docs, style, refactor, test, chore, revert"
    exit 1
fi

# Validação do branch scope
found_branch=false
for valid in "${VALID_BRANCH_SCOPES[@]}"; do
    if [ "$2" == "$valid" ]; then
        found_branch=true
        break
    fi
done
if [ "$found_branch" = false ]; then
    echo "Branch scope inválido! Escolha entre: ${VALID_BRANCH_SCOPES[*]}"
    exit 1
fi

# Validação do commit scope (suporte para múltiplos, separados por vírgula)
IFS=',' read -ra commit_scopes <<< "$3"
for scope in "${commit_scopes[@]}"; do
    # Remove espaços extras
    scope_trimmed=$(echo "$scope" | xargs)
    valid_scope=false
    for valid in "${VALID_COMMIT_SCOPES[@]}"; do
        if [ "$scope_trimmed" == "$valid" ]; then
            valid_scope=true
            break
        fi
    done

    # Se ainda não for válido, verifica se começa com "project/" (case-insensitive)
    if [ "$valid_scope" = false ]; then
        lowercase=$(echo "$scope_trimmed" | tr '[:upper:]' '[:lower:]')
        if [[ $lowercase == project/* ]]; then
            valid_scope=true
        fi
    fi

    if [ "$valid_scope" = false ]; then
        echo "Commit scope '$scope_trimmed' é inválido! Escopos válidos: ${VALID_COMMIT_SCOPES[*]}"
        exit 1
    fi
done

# ---------------------------------------------------------------
# Configuração Dinâmica
# ---------------------------------------------------------------

# A branch será nomeada APENAS com o escopo escolhido
BRANCH_NAME="$2"
# Recupera o emoji correspondente ao tipo
EMOJI=${EMOJI_MAP[$1]}
# Monta a mensagem de commit usando o commit scope (como fornecido, podendo conter vírgulas)
COMMIT_MSG="$1($3): $EMOJI $4"
PR_TITLE="$COMMIT_MSG"
PR_BODY_FILE=".github/pull_request_template.md"

# ---------------------------------------------------------------
# Funções de Apoio
# ---------------------------------------------------------------
branch_exists() {
    git show-ref --verify --quiet "refs/heads/$BRANCH_NAME" || 
    git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null
}

format_code() {
    if [ "$AUTO_FORMAT" = true ]; then
        echo "→ Formatando código com Prettier..."
        npx prettier --write "css/*.css" "js/*.js" --ignore-path .prettierignore
        echo "→ Verificando código com ESLint..."
        npx eslint . ---fix
    fi
}

# ---------------------------------------------------------------
# Fluxo Principal
# ---------------------------------------------------------------

format_code

if branch_exists; then
    echo "→ Atualizando branch existente: $BRANCH_NAME"
    git checkout "$BRANCH_NAME"
    git pull origin "$BRANCH_NAME"
else
    echo "→ Criando nova branch: $BRANCH_NAME"
    git checkout -b "$BRANCH_NAME"
fi

git add .
git commit -m "$COMMIT_MSG"

if git rev-parse --symbolic-full-name "@{u}" >/dev/null 2>&1; then
    git push
else
    git push -u origin "$BRANCH_NAME"
fi

# Cria o pull request via GitHub CLI se for uma branch nova
if ! branch_exists; then
    if [ -f "$PR_BODY_FILE" ]; then
        PR_BODY=$(cat "$PR_BODY_FILE")
    else
        PR_BODY="Descrição detalhada..."
    fi
    
    gh pr create \
        --title "$PR_TITLE" \
        --body "$PR_BODY" \
        --base "$DEFAULT_PR_BASE" \
        --head "$BRANCH_NAME" \
        ${5:+--issue $5}
fi

echo "✔ Fluxo concluído!"
echo "Trabalhe em:"
echo "  - CSS: file:///$PWD/css/style.css"
echo "  - JS:  file:///$PWD/js/script.js"
