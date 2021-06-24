

function updateBrowseVariables() {
    console.log("updated!");
    document.getElementById("divBrowseNox").textContent = global.settings.noxPath
    document.getElementById("divBrowseScript").innerHTML = global.settings.scriptPath
    document.getElementById("divBrowseBash").innerHTML = global.settings.bashPath
}

// Listen to variable change [noxPath, scriptPath, bashPath]
global.settings = {
    noxPathInternal: "",
    scriptPathInternal: "",
    bashPathInternal: "",
    aListener: (val) => updateBrowseVariables(),

    // Define Getters
    get noxPath() {
        return this.noxPathInternal;
    },
    get bashPath() {
        return this.bashPathInternal;
    },
    get scriptPath() {
        return this.scriptPathInternal;
    },

    // Define Setters
    set noxPath(val) {
        this.noxPathInternal = val;
        this.aListener(val);
    },
    set bashPath(val) {
        this.bashPathInternal = val;
        this.aListener(val);
    },
    set scriptPath(val) {
        this.scriptPathInternal = val;
        this.aListener(val);
    }
}

// Check if save file exist and if files exist on those paths

// Load save file, load default values if it doesnt exist
try {
    console.log("Save File:");
    const fileJson = JSON.parse(fs.readFileSync('save.json'));

    global.settings.noxPath = fileJson.noxPath;
    global.settings.scriptPath = fileJson.scriptPath;
    global.settings.bashPath = fileJson.bashPath;

} catch (err) {
    global.settings.noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe');
    global.settings.scriptPath = path.normalize(path.join(__dirname, '../../../AFK-Arena-Script/deploy.sh'));
    global.settings.bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe');
}

// Does files exist?
object = [global.settings.noxPath, global.settings.scriptPath, global.settings.bashPath]
alertMsg = [];
for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
        if (fs.existsSync(object[key]))
            continue;
        else
            alertMsg.push(object[key]);
    }
}

// Alert - if paths could not be resolved
if (alertMsg.length)
    alert("Could not find file on: " + "\n" + alertMsg.join("\n"))


const settings = {
    noxPath: global.settings.noxPath,
    scriptPath: global.settings.scriptPath,
    bashPath: global.settings.bashPath
};
fs.writeFileSync('save.json', JSON.stringify(settings, null, 4), 'utf-8');


const saveBtn = document.getElementById('saveButton');
saveBtn.addEventListener('click', () => eventSaveToSavefile());

const resetBtn = document.getElementById('resetButton');
resetBtn.addEventListener('click', () => eventResetSavefile());

const noxFileInput = document.querySelector("#file-nox-path input[type=file]");
noxFileInput.onchange = () => {
    const fileName = document.querySelector("#file-nox-path .file-name");
    fileName.textContent = noxFileInput.files[0].name;
    global.settings.noxPath = noxFileInput.files[0].path
};

const scriptFileInput = document.querySelector("#file-script-path input[type=file]");
scriptFileInput.onchange = () => {
    const fileName = document.querySelector("#file-script-path .file-name");
    fileName.textContent = scriptFileInput.files[0].name;
    global.settings.scriptPath = scriptFileInput.files[0].path
};

const bashFileInput = document.querySelector("#file-bash-path input[type=file]");
bashFileInput.onchange = () => {
    const fileName = document.querySelector("#file-bash-path .file-name");
    fileName.textContent = bashFileInput.files[0].name;
    global.settings.bashPath = bashFileInput.files[0].path
};



function eventSaveToSavefile() {
    console.log("Saving...");
    try {
        const settings = {
            noxPath: global.settings.noxPath,
            scriptPath: global.settings.scriptPath,
            bashPath: global.settings.bashPath
        };
        fs.writeFileSync('save.json', JSON.stringify(settings, null, 2), 'utf-8');
        alert('Saved! Savefile can be find: ' + path.normalize(path.join(__dirname, '/save.json')));
    }
    catch (e) {
        alert('Failed saving to file !');
    }
}

function eventResetSavefile() {

    console.log("Resetting save file...");
    try {
        global.settings.noxPath = global._default_noxPath
        global.settings.scriptPath = global._default_scriptPath
        global.settings.bashPath = global._default_bashPath

        const settings = {
            noxPath: global.settings.noxPath,
            scriptPath: global.settings.scriptPath,
            bashPath: global.settings.bashPath
        };
        fs.writeFileSync('save.json', JSON.stringify(settings, null, 2), 'utf-8');
        alert('Save file has been reset: ' + path.normalize(path.join(__dirname, '/save.json')));
    }
    catch (e) {
        alert('Failed saving to file !');
    }
}