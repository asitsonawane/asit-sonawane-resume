

const commandInput = document.getElementById('command-input');
const outputDiv = document.getElementById('output');
const commandPrompt = document.getElementById('command-prompt');
const body = document.body;

commandInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

const filesystem = {
  '/': {
    type: 'directory',
    content: ['home'],
    parent: null
  },
  '/home': {
    type: 'directory',
    content: ['file1.txt', 'file2.txt', 'projects'],
    parent: '/'
  },
  '/home/file1.txt': {
    type: 'file',
    content: 'This is the content of file1.txt',
    parent: '/home'
  },
  '/home/file2.txt': {
    type: 'file',
    content: 'This is the content of file2.txt',
    parent: '/home'
  },
  '/home/projects': {
    type: 'directory',
    content: [],
    parent: '/home'
  }
};

let currentDirectory = '/home';
let commandHistory = [];
let commandIndex = 0;

commandInput.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    autocompleteCommand();
  } else if (event.ctrlKey && event.key === ' ') {
    event.preventDefault();
    autocompleteCommand();
  } else if (event.key === 'Enter') {
    const command = commandInput.value.trim();
    executeCommand(command);
    commandHistory.push(command);
    commandIndex = commandHistory.length;
    commandInput.value = '';
    updateCommandPrompt();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    navigateCommandHistory(-1);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    navigateCommandHistory(1);
  }
});

function executeCommand(command) {
  const output = document.createElement('p');
  const prompt = getCommandPrompt();
  output.innerText = prompt + command;

  const commandParts = command.split(' ');
  const commandName = commandParts[0];

  switch (commandName) {

    case 'sudo':
      const sudoImage = document.createElement('img'); // Create an <img> element
      sudoImage.src = 'sudoImg.jpg'; // Set the source of the image
      sudoImage.classList.add('sudo'); // Add the "sudo" class to the image
      output.appendChild(sudoImage); // Append the image to the output
      break;

    case 'help':
      const helpText = 'Available commands:\n' +
        '- help: Display available commands.\n' +
        '- ls: List files and directories in the current directory.\n' +
        '- clear: Clear the screen.\n' +
        '- cd [directory]: Change to the specified directory.\n' +
        '- cat [file]: Display the content of the specified file.';
      output.innerText += '\n' + helpText;
      break;

      case 'ls':
        const currentDirectoryContent = filesystem[currentDirectory].content;
        let lsOutput = '';
        for (let i = 0; i < currentDirectoryContent.length; i++) {
          const item = currentDirectoryContent[i];
          const itemInfo = filesystem[resolvePath(item)];
          if (itemInfo) {
            const itemType = itemInfo.type === 'directory' ? 'directory' : 'file';
            lsOutput += `<span class="${itemType}">${item}</span><br>`;
          }
        }
        output.innerHTML += '<br>' + lsOutput;
        break;
    case 'cd':
      const targetDirectory = resolvePath(commandParts[1]);
      if (!targetDirectory) {
        output.innerText += '\nMissing target directory.';
      } else if (targetDirectory === '/') {
        currentDirectory = '/';
      } else if (targetDirectory in filesystem && filesystem[targetDirectory].type === 'directory') {
        currentDirectory = targetDirectory;
      } else {
        output.innerText += '\nDirectory not found: ' + commandParts[1];
      }
      break;

    case 'cat':
      const targetFile = resolvePath(commandParts[1]);
      if (!targetFile) {
        output.innerText += '\nMissing target file.';
      } else if (targetFile in filesystem && filesystem[targetFile].type === 'file') {
        const fileContent = filesystem[targetFile].content;
        output.innerText += '\n' + fileContent;
      } else {
        output.innerText += '\nFile not found: ' + commandParts[1];
      }
      break;

    case 'theme':
      toggleColorScheme();
      break;

    case 'clear':
      clearOutput();
      break;

    default:
      output.innerText += `\n${command}: command not found. \n Type "help" for available commands.`;
      break;
  }

  outputDiv.appendChild(output);
  window.scrollTo(0, document.body.scrollHeight);

}

function clearOutput() {
  while (outputDiv.firstChild) {
    outputDiv.removeChild(outputDiv.firstChild);
  }
}

function navigateCommandHistory(direction) {
  commandIndex += direction;
  if (commandIndex < 0) {
    commandIndex = 0;
  } else if (commandIndex >= commandHistory.length) {
    commandIndex = commandHistory.length - 1;
    commandInput.value = '';
  } else {
    commandInput.value = commandHistory[commandIndex];
  }
}

function resolvePath(path) {
  if (!path || path === '/') {
    return '/';
  }

  const currentDir = currentDirectory === '/' ? '' : currentDirectory;
  const newPath = currentDir + '/' + path;
  const resolvedPath = newPath.split('/').filter(Boolean);
  const resolvedPathArray = [''];

  for (let i = 0; i < resolvedPath.length; i++) {
    if (resolvedPath[i] === '..') {
      if (resolvedPathArray.length > 1) {
        resolvedPathArray.pop();
      }
    } else {
      resolvedPathArray.push(resolvedPath[i]);
    }
  }

  return resolvedPathArray.join('/');
}

function getCommandPrompt() {
  const username = 'root';
  const hostname = 'asit.avidlogic.tech';
  const directory = currentDirectory === '/' ? '~' : `~${currentDirectory}`;
  const prompt = `${username}@${hostname}:${directory}$ `;
  return prompt;
}

function updateCommandPrompt() {
  commandPrompt.innerText = getCommandPrompt()``;
}

function autocompleteCommand() {
  const command = commandInput.value.trim();
  const commandParts = command.split(' ');
  const partialCommand = commandParts[0];
  const options = Object.keys(filesystem).filter(item => item.startsWith(partialCommand));

  if (options.length === 1) {
    const autocompletedCommand = options[0] + ' ';
    commandInput.value = autocompletedCommand;
  } else if (options.length > 1) {
    const commonPrefix = findCommonPrefix(options);
    const autocompletedCommand = commonPrefix;
    commandInput.value = autocompletedCommand;
  }
}

function findCommonPrefix(strings) {
  if (strings.length === 0) {
    return '';
  }

  const sortedStrings = strings.slice().sort();
  const firstString = sortedStrings[0];
  const lastString = sortedStrings[sortedStrings.length - 1];
  const minLength = Math.min(firstString.length, lastString.length);

  let commonPrefix = '';
  for (let i = 0; i < minLength; i++) {
    if (firstString[i] !== lastString[i]) {
      break;
    }
    commonPrefix += firstString[i];
  }

  return commonPrefix;
}

function toggleColorScheme() {
  body.classList.toggle('easter-egg-color-scheme');
}