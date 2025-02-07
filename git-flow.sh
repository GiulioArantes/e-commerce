#!/bin/bash

# ---------------------------------------------------------------
# Configurações Personalizadas
# ---------------------------------------------------------------
BRANCH_PREFIX="feat"          # Padrão: feat/fix/docs
VALID_SCOPES=("css" "js" "assets" "config" "project")  # Escopos personalizado
DEFAULT_PR_BASE="main"        # Branch base para PRs
AUTO_FORMAT=true              # Executa Prettier antes de commits

# ---------------------------------------------------------------
# Validação de Parâmetros
# ---------------------------------------------------------------
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
    echo "Uso: $0 <tipo> <escopo> \"<mensagem>\" [issue-number]"
    echo "Ex: $0 feat css \"Melhoria no grid system\" 123"
    exit 1
fi

if [[ ! " ${VALID_SCOPES[@]} " =~ " $2 " ]]; then
    echo "Escopo inválido! Escolha entre: ${VALID_SCOPES[*]}"
    exit 1
fi

# ---------------------------------------------------------------
# Configuração Dinâmica
# ---------------------------------------------------------------
BRANCH_NAME="$BRANCH_PREFIX/$2-$(echo $3 | tr ' ' '-' | tr '[:upper:]' '[:lower:]')"
COMMIT_MSG="$1($2): $3"
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
    fi
}

# ---------------------------------------------------------------
# Fluxo Principal
# ---------------------------------------------------------------
format_code

if branch_exists; then
    echo "→ Atualizando branch existente: $BRANCH_NAME"
    git checkout $BRANCH_NAME
    git pull origin $BRANCH_NAME
else
    echo "→ Criando nova branch: $BRANCH_NAME"
    git checkout -b $BRANCH_NAME
fi

git add .
git commit -m "$COMMIT_MSG"

if git rev-parse --symbolic-full-name "@{u}" >/dev/null 2>&1; then
    git push
else
    git push -u origin $BRANCH_NAME
fi

if ! branch_exists; then
    [ -f "$PR_BODY_FILE" ] && PR_BODY=$(cat "$PR_BODY_FILE") || PR_BODY="Descrição detalhada..."
    
    gh pr create \
        --title "$PR_TITLE" \
        --body "$PR_BODY" \
        --base $DEFAULT_PR_BASE \
        --head $BRANCH_NAME \
        ${4:+--issue $4}
fi

echo "✔ Fluxo concluído! Trabalhe em:"
echo "  - CSS: file:///$PWD/css/style.css"
echo "  - JS:  file:///$PWD/js/script.js"