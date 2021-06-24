
const fs = require('fs')

let configPath = path.resolve(path.join(path.dirname(global.settings.scriptPath), 'config.sh'))
configPath = path.resolve(configPath)
console.log(configPath);

fs.readFile(configPath, (err, data) => {
    if (err) throw err;
    document.getElementById('configFileContent').innerHTML = data;
});
