const path = require('path');
const { dialog } = require('@electron/remote');
const AU = require('ansi_up')
var ansi_up = new AU.default;
const fs = require('fs');

const schedule = require('node-schedule');
const job = schedule.scheduleJob('0 6 * * *', async () => name());

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function errorInScriptOutput() {
    let text = getCommandOutput().innerHTML
    let n = text.includes("Error");

    if (n) {
        getCommandOutput().innerHTML = ""
        return true
    }
    return false
}

async function name() {
    startNox()
    await sleep(20000)
    startScript()
    await sleep(10000)
    while (errorInScriptOutput()) {
        // clear output
        startScript()
        await sleep(10000)
    }
}



window.onload = function () {
    try {
        console.log("Save File:");
        const rawdata = fs.readFileSync('save.json');
        const fileJson = JSON.parse(rawdata);
        console.log(fileJson);
        global.noxPath = fileJson.noxPath;
        global.scriptPath = fileJson.scriptPath;
        global.bashPath = fileJson.bashPath;

        // Does files exist?
        object = [global.noxPath, global.scriptPath, global.bashPath]
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (fs.existsSync(element)) {
                    console.log(element, " exists");
                    continue;
                }
                else {
                    console.log("err")
                    alert("Could not find: " + "\n" + element);
                }
            }
        }

    } catch (err) {
        console.log(err);
        global.noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe');
        global.scriptPath = path.normalize(path.join(__dirname, '../../../AFK-Daily/deploy.sh'));
        global.bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe');

        // Does files exist?
        object = [global.noxPath, global.scriptPath, global.bashPath]
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (fs.existsSync(element)) {
                    console.log(element, " exists");
                    continue;
                }
                else {
                    console.log("err")
                    alert("Could not find: " + "\n" + element);
                }
            }
        }

        const settings = {
            noxPath: global.noxPath,
            scriptPath: global.scriptPath,
            bashPath: global.bashPath
        };
        fs.writeFileSync('save.json', JSON.stringify(settings, null, 4), 'utf-8');
    }

    const save = document.getElementById('saveButton');
    save.addEventListener('click', (event) => {

        console.log("Saving...");
        try {

            const settings = {
                noxPath: global.noxPath,
                scriptPath: global.scriptPath,
                bashPath: global.bashPath
            };
            fs.writeFileSync('save.json', JSON.stringify(settings, null, 2), 'utf-8');
            alert('Saved! Savefile can be find: ' + path.normalize(path.join(__dirname, '/save.json')));
            updateBrowseVariables()
        }
        catch (e) {
            alert('Failed saving to file !');
        }
    });

    const reset = document.getElementById('resetButton');
    reset.addEventListener('click', (event) => {

        console.log("Resetting save file...");
        try {

            global.noxPath = path.normalize('C:/Program Files (x86)/Nox/bin/Nox.exe');
            global.scriptPath = path.normalize(path.join(__dirname, '../../../AFK-Daily/deploy.sh'));
            global.bashPath = path.normalize('C:/Program Files/Git/bin/sh.exe');

            const settings = {
                noxPath: global.noxPath,
                scriptPath: global.scriptPath,
                bashPath: global.bashPath
            };
            fs.writeFileSync('save.json', JSON.stringify(settings, null, 2), 'utf-8');
            alert('Save file has been reset: ' + path.normalize(path.join(__dirname, '/save.json')));
            updateBrowseVariables()
        }
        catch (e) {
            alert('Failed saving to file !');
        }
    });

    updateBrowseVariables()
};

function updateBrowseVariables() {
    document.getElementById("divBrowseNox").textContent = global.noxPath
    document.getElementById("divBrowseScript").innerHTML = global.scriptPath
    document.getElementById("divBrowseBash").innerHTML = global.bashPath
}

const noxFileInput = document.querySelector(
    "#file-nox-path input[type=file]"
);
noxFileInput.onchange = () => {
    if (noxFileInput.files.length > 0) {
        const fileName = document.querySelector(
            "#file-nox-path .file-name"
        );
        fileName.textContent = noxFileInput.files[0].name;
        global.noxPath = noxFileInput.files[0].path
        updateBrowseVariables()
    }
};

const scriptFileInput = document.querySelector(
    "#file-script-path input[type=file]"
);
scriptFileInput.onchange = () => {
    if (scriptFileInput.files.length > 0) {
        const fileName = document.querySelector(
            "#file-script-path .file-name"
        );
        fileName.textContent = scriptFileInput.files[0].name;
        global.scriptPath = scriptFileInput.files[0].path
        updateBrowseVariables()
    }
};

const bashFileInput = document.querySelector(
    "#file-bash-path input[type=file]"
);
bashFileInput.onchange = () => {
    if (bashFileInput.files.length > 0) {
        const fileName = document.querySelector(
            "#file-bash-path .file-name"
        );
        fileName.textContent = bashFileInput.files[0].name;
        global.bashPath = bashFileInput.files[0].path
        updateBrowseVariables()
    }
};

function appendOutput(msg) { getCommandOutput().innerHTML += (ansi_up.ansi_to_html(msg) + "<br />"); getCommandOutput().scrollTop = getCommandOutput().scrollHeight };
function setStatus(msg) { getStatus().innerHTML = msg; getStatus().scrollTop = getStatus().scrollHeight };

function startNox() {
    //command, args, callback
    console.log(global.noxPath);

    command = global.noxPath;
    run_script(`"${command.replaceAll('\\', '/')}"`);
    return;
}

function startScript() {
    //command, args, callback
    command = global.bashPath;
    scriptDir = path.dirname(global.scriptPath).replaceAll('\\', '/')
    scriptName = path.basename(global.scriptPath).replaceAll('\\', '/')

    args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -n"`]
    //"C:\Program Files\Git\bin\sh.exe" - c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

    run_script(`"${command.replaceAll('\\', '/')}"`, args);
    return;
}

const btnStartNox = document.getElementById('btnStartNox');
btnStartNox.onclick = () => {
    startNox()
};

const btnStartScript = document.getElementById('btnStartScript');
btnStartScript.onclick = () => {
    startScript()
};

// "C:\Program Files\Git\bin\sh.exe" -c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

//Uses node.js process manager

// This function will output the lines from the script
// and will return the full combined output
// as well as exit code when it's done (using the callback).
var childProcess = require("child_process");
function run_script(command, args, callback) {

    var child = childProcess.spawn(command, args, {
        encoding: "utf8",
        shell: true,
    });

    console.log('spawn called');
    console.log(command);
    console.log(args);

    // var child = child_process.spawn(command, args, {
    //     encoding: "utf8",
    //     shell: false,
    // });
    // You can also use a variable to save the output for when the script closes later
    child.on("error", (error) => {
        appendOutput(error);
        dialog.showMessageBox({
            title: "Title",
            type: "warning",
            message: "Error occured.\r\n" + error,
        });
    });

    child.stdout.on("data", (data) => {
        //Here is the output
        data = data.toString();
        appendOutput(data);
    });

    child.stderr.on("data", (data) => {
        //Here is the output from the command
        appendOutput(data);
    });

    child.on("close", (code) => {
        setStatus("Process ended:" + code);
    });
    if (typeof callback === "function") callback();
}
