const fs = require("fs");
const path = require("path");
const { program } = require('commander');

program
  .option('-s, --shift <number>', 'number of shifting')
  .option('-a, --action <action>', 'encode/decode')
  .option('-i, --input <text>', 'name of input file')
  .option('-o, --output <text>', 'name of output file')

program.parse(process.argv);

const options = program.opts();
if (!options.shift){
  console.error("\x1b[41m", 'The process has terminated because an argument shift is missing')
  process.exit(1)
};
if (!options.action){ 
  console.error("\x1b[41m", 'The process has terminated because an argument action is missing')
  process.exit(1)
};
if (options.action.toLowerCase() === 'encode') {
  console.log('Encode start')
} else if (options.action.toLowerCase() === 'decode') {
  console.log('Decode start')
} else {
  console.log('You can only use one of the two parameters here - encode/decode')
}

function getTextFromInput(title) {
  let string = fs.readFileSync(
    path.join(__dirname, title),
    "UTF-8",
    (err) => {
      if (err) throw err;
    }
  );

  let resultArray = string.split('');
  resultArray = resultArray.map(item => {
    const letterIndex = item.charCodeAt();
    if (
      letterIndex > 64 && letterIndex < 91 
      || 
      letterIndex > 96 && letterIndex < 123) {
        const newLetterIndex = letterIndex + 
         (options.action.toLowerCase() === 'encode' ? 
            parseInt(options.shift) % 26 
            : -(parseInt(options.shift) % 26));
        return String.fromCharCode(newLetterIndex);
      } else {
        return String.fromCharCode(letterIndex)
      }
  })
  return resultArray.join('');
}

if (options.input){ 
  if (fs.existsSync(options.input)) {
    if (fs.existsSync(options.output)) {
      fs.appendFile(
        path.join(__dirname, options.output),
        getTextFromInput(options.input),
        (err) => {
          if (err) throw err;
          console.log("File was updated");
        }
      );
    } else {
      console.log('stdout', getTextFromInput(options.input))
    }
    
  }
};
