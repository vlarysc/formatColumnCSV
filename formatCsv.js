const fsPromises = require('fs').promises;
const path = require('path');
let columnsUnformatted = ["old_id", "coordinator"];
let settingsOfColumns = columnsUnformatted.toString().replace(/,/g, ";");
let columnsProcessed = []

const formatColumns = async () => {
  try {
    const columnsConverting = await settingsOfColumns;
    let columns = [];
    columnsConverting.toLowerCase().includes("old_id") ? columns.push('leadId') : '';
    columnsConverting.toLowerCase().includes("consultor" || "consultor sdr") ? columns.push('consultorLead') : '';
    columnsConverting.toLowerCase().includes("consultor is") ? columns.push('consultorProposta') : '';
    columnsConverting.toLowerCase().includes("coordinator") ? columns.push('coordenadorSDR') : '';
    columnsConverting.toLowerCase().includes("proposal_coordinator") ? columns.push('coordenadorIS') : '';
    columnsConverting.toLowerCase().includes("gerente") ? columns.push('gerenteComercial') : '';
    return columns;
  } catch (err) {
    console.error(err);
  }
}

const formatCsv = async (inputFile, outputFile, typeFile, settingsOfColumns, columnsProcessed) => {
  try {
    const data = await fsPromises.readFile(path.join(__dirname, 'files', `${inputFile}.csv`), 'utf8');
    let removeHeader = JSON.stringify(data.replace(settingsOfColumns, ""));
    let res = JSON.parse(removeHeader).trim();
    await fsPromises.appendFile(path.join(__dirname, 'files', `${outputFile}_${typeFile}.csv`), `${columnsProcessed} \n` + res);
  } catch (err) {
    console.error(err)
  }
}

formatColumns().then(total => {
  columnsProcessed = total.toString().replace(/,/g, ";");
  formatCsv("Lead", "CRED-5983", "Leads", settingsOfColumns, columnsProcessed)
})

// estudar process.argv do Node by Will