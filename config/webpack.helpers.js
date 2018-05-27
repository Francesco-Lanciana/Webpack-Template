const path = require('path');
const fs = require('fs');

/* All React components that are contained within a module with the same name as it's containing foler
   will be aliased. These rules can be changed to suit the project needs. */
const createComponentAliases = (componentsDirectory) => {
    const componentPaths = walkDirectorySync(componentsDirectory);

    return componentPaths.reduce((aliases, filePath) => {
        const fileName = path.basename(filePath).split('.')[0];
        const parentDirName = path.dirname(filePath).split(path.sep).pop();

        // Apply filters here
        if (fileName !== parentDirName) return aliases;

        const alias = 'Components:' + fileName;

        aliases[alias] = filePath;

        return aliases;
    }, {});
};

/* 
Recursively search a provided directory, compiling the full paths of all modules
containing a React component. The rootLevel parameter allows special files at the 
root of the directory (e.g. the project entrypoint) to go un-aliased.
*/
const walkDirectorySync = (dir, rootLevel=true) => {
    const resources = fs.readdirSync(dir);

    let filePaths = [];

    resources.forEach((resource) => {
        const resourcePath = path.resolve(dir, resource);

        if (fs.statSync(resourcePath).isDirectory()) {
            filePaths = [...filePaths, ...walkDirectorySync(resourcePath, false)];
        }
        else if (!rootLevel && resourcePath.match(/^[^.]+.jsx?$/)) {
            filePaths.push(resourcePath);
        }; 
    });
    
    return filePaths;
};


exports.generateAliases = () => {
    const appAliases = {};

    const srcDirectory = path.resolve(__dirname, '../src');
    const componentsDirectory = path.resolve(srcDirectory, 'Components');

    Object.assign(appAliases, createComponentAliases(componentsDirectory));

    // Images, app wide styles, and generic javascript functions
    appAliases["Images"] = path.resolve(srcDirectory, "Images");
    appAliases["Styles"] = path.resolve(srcDirectory, "Styles");
    appAliases["Modules"] = path.resolve(srcDirectory, "Modules");

    return appAliases;
}