# Conversor TXT para PDF

Aplicação para conversão de arquivos de texto em PDF. O projeto conta com uma versão Desktop (Electron) e uma versão de Linha de Comando (CLI) compatível com Docker.

## 📦 Funcionalidades
1. **Desktop (Interface):** Seleção de arquivos via janela visual.
2. **CLI (Terminal):** Automação via linha de comando e Docker.

## 🚀 Como usar (CLI / Terminal)

Caso você tenha o Node.js instalado e queira rodar localmente:

```bash
# Converter especificando entrada e saída
node cli.js --input "meuarquivo.txt" --output "meupdf.pdf"

# Converter apenas especificando entrada (saída automática na mesma pasta)
node cli.js --input "meuarquivo.txt"
```

## 🐳 Como rodar com Docker

Para executar a aplicação em qualquer ambiente sem instalar o Node.js, utilize o Docker.

### 1. Construir a imagem
No terminal, dentro da pasta do projeto:

```bash
docker build -t txt-to-pdf .
```

### 2. Executar a conversão
Para o Docker funcionar, precisamos "emprestar" a pasta do seu computador para o container (Volume).

**No Linux/Mac/PowerShell:**
```bash
docker run --rm -v ${PWD}:/app/files txt-to-pdf --input /app/files/seu-arquivo.txt --output /app/files/saida.pdf
```

**No Prompt de Comando (CMD) do Windows:**
```cmd
docker run --rm -v %cd%:/app/files txt-to-pdf --input /app/files/seu-arquivo.txt --output /app/files/saida.pdf
```