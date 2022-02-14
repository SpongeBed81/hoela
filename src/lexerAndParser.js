const fs = require("fs")
const nodeEval = require('node-eval');
let rn = null
let variables = [

]

//the variables are hopeless like a person. Variables can't control themselves they are controlled by us and us are controlled by other people


const instructions = [{
        name: "cryLoud",
        process: "console.log(argument)",
        description: "crying endlessly is not an option"
    },
    {
        name: "create",
        process: `variables.push({owner: argument, value: argument})`,
        description: "values are hopeless like us"
    },
    {
        name: "overwrite",
        process: `
                const find = variables.find(el => el.owner == argument)
                if(find !== undefined) {
                    find.value = argument
                }
                `,
        description: "idk"
    },
    {
        name: "kill",
        process: `
        const find = variables.find(el => el.owner == argument)
        if(find !== undefined) {
            const getIndex2 = variables.indexOf(find)
            variables.splice(getIndex2, 1)
        }
        `,
        description: "the variables goes to hell lmao"
    }
]



fs.readFile('main.hl', {
        encoding: 'utf8',
        flag: 'r'
    },
    function (err, data) {
        if (err) {
            console.log(err);
        } else {
            function exec() {
                const SplitIntoChunks = data.split("\n")
                SplitIntoChunks.forEach(element => {
                    const getIndex = element.indexOf("=>")
                    const getName = element.substring(0, getIndex).trim().split(" ")
                    const findObject = instructions.find(el => el.name == getName[0])
                    if (findObject !== undefined) {
                        let arguments = element.slice(getIndex + 2).trim().split(" ")


                        let getArgument = element.slice(getIndex + 2).trim()
                        if (findObject.process.includes("owner: argument")) {
                            if (getArgument.startsWith('"') && getArgument.endsWith('"')) {
                                getArgument = getArgument.slice(1)
                                getArgument = getArgument.substring(0, getArgument.length - 1)
                            }
                            if (!isNaN(getArgument)) {
                                getArgument = Number(getArgument)
                            }
                            variables.push({
                                owner: getName[1],
                                value: getArgument
                            })
                        } else if (findObject.process.includes("const find = variables.find(el => el.owner == argument)") && !findObject.process.includes("getIndex2")) {
                            if (getArgument.startsWith('"') && getArgument.endsWith('"')) {
                                getArgument = getArgument.slice(1)
                                getArgument = getArgument.substring(0, getArgument.length - 1)
                            }
                            if (!isNaN(getArgument)) {
                                getArgument = Number(getArgument)
                            }
                            const find = variables.find(el => el.owner == getName[1])
                            if (find !== undefined) {
                                find.value = getArgument
                            }
                        } else {
                            let getProcess = findObject.process.replace("argument", getArgument)
                            try {
                                if(getProcess.includes("splice")) {
                                    const find = variables.find(el => el.owner == getArgument)
                                    if(find !== undefined) {
                                        const getIndex2 = variables.indexOf(find)
                                        variables.splice(getIndex2, 1)
                                    }
                                } else {
                                    nodeEval(getProcess)
                                }
                            } catch (e) {
                                if (e.message.includes("is not defined")) {
                                    const sliceIt = e.message.substring(0, e.message.length - 14).trim()
                                    const findIt = variables.find(el => el.owner == sliceIt)
                                    if (findIt !== undefined) {
                                        let last;
                                        if (!isNaN(getArgument)) {
                                            getProcess = getProcess.replace(getArgument, Number(findIt.value))
                                        } else {
                                            try{
                                                rn = JSON.parse(findIt.value)
                                            } catch(e) {}
                                            if(Array.isArray(rn)) {
                                                getProcess = getProcess.replace(getArgument, findIt.value)
                                            } else {
                                                getProcess = getProcess.replace(getArgument, '"' + findIt.value + '"')
                                            }
                                        }
                                        nodeEval(getProcess)
                                    }
                                }
                            }
                        }

                    }
                });
            }

            exec()
        }
    });