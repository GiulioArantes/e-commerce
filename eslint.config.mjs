import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended, // Usa as regras recomendadas do ESLint
  prettier, // Desativa regras do ESLint que conflitam com o Prettier
  {
    files: ["**/*.js"], // Aplica as regras a todos os arquivos .js
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // Variáveis globais do navegador
      },
    },
    rules: {
      // Regras personalizadas
      indent: ["error", 2], // Indentação de 2 espaços
      "linebreak-style": ["error", "unix"], // Estilo de quebra de linha UNIX
      quotes: ["error", "single"], // Usa aspas simples
      semi: ["error", "always"], // Sempre usa ponto-e-vírgula
      "no-unused-vars": "warn", // Avisa sobre variáveis não utilizadas
      "no-console": "off", // Permite o uso de console.log
      eqeqeq: "error", // Força o uso de === em vez de ==
      "no-var": "error", // Prefere let/const em vez de var
      "prefer-const": "error", // Sugere o uso de const quando possível
      "object-shorthand": "error", // Prefere shorthand para propriedades de objetos
      "arrow-spacing": ["error", { before: true, after: true }], // Espaçamento em funções arrow
    },
  },
];