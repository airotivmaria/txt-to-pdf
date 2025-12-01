const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs-extra');
const path = require('path');
const PDFDocument = require('pdfkit');

// configuração dos argumentos da linha de comando
const argv = yargs(hideBin(process.argv))
  .option('input', {
    alias: 'i',
    type: 'string',
    description: 'Caminho do arquivo TXT de entrada',
    demandOption: true
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Caminho do arquivo PDF de saída (Opcional)'
  })
  .help()
  .argv;

async function run() {
  try {
    // resolve os caminhos
    const inputPath = path.resolve(argv.input);
    
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Erro: O arquivo '${inputPath}' não foi encontrado.`);
      process.exit(1);
    }

    let outputPath;
    if (argv.output) {
      outputPath = path.resolve(argv.output);
    } else {
      const dir = path.dirname(inputPath);
      const name = path.basename(inputPath, '.txt');
      outputPath = path.join(dir, `${name}.pdf`);
    }

    console.log(`📄 Lendo: ${inputPath}`);

    // lê e trata o texto
    let text = await fs.readFile(inputPath, 'utf-8');
    text = text.replace(/^\uFEFF/, '');

    // gera o PDF
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputPath);

    doc.pipe(writeStream);
    doc.font('Helvetica').fontSize(12);
    
    // tratamento básico para evitar caracteres inválidos
    const safeText = text.replace(/[^\x00-\x7F]/g, ""); 
    
    doc.text(text, { align: 'left' });
    doc.end();

    writeStream.on('finish', () => {
      console.log(`✅ Sucesso! PDF criado em: ${outputPath}`);
    });

    writeStream.on('error', (err) => {
      console.error('❌ Erro na escrita do PDF:', err);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    process.exit(1);
  }
}

run();