function updateTime() {
  const currentTimeElement = document.getElementById('currentTime');
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const currentTimeString = `${hours}:${minutes}:${seconds}`;
  currentTimeElement.textContent = currentTimeString;
}

// Update the time every second (1000 milliseconds)
setInterval(updateTime, 1000);

// Initial update
updateTime();

// Function to set focus on the input element when the page loads
function setFocus() {
  var inputElement = document.getElementById("command-input");
  inputElement.focus();
}

// Call the setFocus function when the page is fully loaded
document.addEventListener("DOMContentLoaded", setFocus);

// Add an event listener to capture clicks on the entire document
document.addEventListener("click", function(event) {
  var inputElement = document.getElementById("command-input");
  // Check if the click target is not the input element itself
  if (event.target !== inputElement) {
    // Set focus on the input element
    inputElement.focus();
  }
});

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
    content: ['edu.txt', 'projects.txt', 'work', 'exp.txt'],
    parent: '/'
  },
  '/home/work': {
    type: 'directory',
    content: ['exp.txt'],
    parent: '/home'
  },
  '/home/edu.txt': {
    type: 'file',
    content: `
    <table class='edu'>
    <tr class='edu'>
        <td class='edu'>Trinity Academy of Engineering, Savitribai Phule Pune University</td>
        <td class='edu'>August 2019 – June 2023</td>
    </tr>
    <tr class='edu'>
        <td class='edu'>Bachelor of Technology in Computer Science and Engineering Pune, India</td>
        <td class='edu'>Pune, India</td>
    </tr>
  </table>`,
    parent: '/home'
  },
  '/home/projects.txt': {
    type: 'file',
    content: `<br> =======================================

    <p><b>CMS CI/CD with Docker Compose and GitHub Actions</b></p>
    <p>Developed a guide to walk users through the process of setting up complete LEMP stack development environment for WordPress using Docker Compose, and then deploying the website to a hosting platform using GitHub Actions.This allows for easy development and deployment without worrying about complex configuration.</p>
    <a href="https://github.com/asitsonawane/wordpress-docker-compose/tree/main" target="_blank">https://github.com/asitsonawane/wordpress-docker-compose/tree/main</a>

    <br> =======================================

    <p><b>Dynamic Load Balancer using Weighted Round Robin Algo with Automatic Scaling</b></p>
    <p>Designed and implemented Automatic Scaling Load Balancer system, employing round-robin and weighted round-robin algorithms for efficient request distribution. Demonstrated adeptness in multithreading and race condition handling, ensuring seamless parallel processing of requests and accurate statistics collection.</p>
    <a href="https://github.com/asitsonawane/Building-an-Automatic-Scaling-Load-Balancer-with-Go" target="_blank">https://github.com/asitsonawane/Building-an-Automatic-Scaling-Load-Balancer-with-Go</a>
    
    <br> =======================================
    `,
    parent: '/home'
  },
  '/home/work/exp.txt': {
    type: 'file',
    content: `
    <br> =======================================
    
    <p><b>Assetcues Private Limited | DevOps Engineer</b></p>
    <p>February 2023 - Present</p>
    <ul>
      <li><p>CI/CD Pipeline Transformation: By designing and implementing Jenkins CI/CD pipelines, I reduced deployment cycle times bya remarkable 91.11% and enhanced cross-team collaboration along with DevSecOps practices using OWASP and Sonarqube which resulted in improvement of pipeline as well as product security by 80%.</p></li>
      <li><p>Handled critical multi-tenant SaaS infrastructure across production stacks which is responsible for running 300,000 devices forFortune 500 clients like Grasim and Mitsubishi. Built with Kubernetes, Azure App Service, Azure CDN, PostgreSQL, and Redisspread across AWS and Azure.</p></li>
      <li><p>Implemented CI/CD across the organization using Jenkins and re-modeled 4+ projects to use containerization which laid the groundwork for architecture standardization across internal and client projects</p></li>
    </ul>

    <br> =======================================

    <p><b>Prospera Web Solutions | Web Developer & Cloud Engineer</b></p>
    <p>November 2020 - Present</p>
    <ul>
      <li><p>Led multi-cloud infrastructure management (AWS, Azure, GCP) with a focus on scalability and security, achieving a 20% cost reduction through optimization.</p></li>
      <li><p>Automated infrastructure deployment using Terraform and CloudFormation, reducing deployment times by 40%, and orchestrated containerized apps with Kubernetes for seamless scaling.</p></li>
      <li><p>Implemented robust CI/CD pipelines with Jenkins, improved monitoring with CloudWatch, and enabled enterprise login across customer-facing products through Single-Sign-On with Key cloak. Developed and deployed APIs using ExpressJS, MongoDB,and AWS ECS, while staying updated with the latest cloud tech trends and fostering knowledge sharing.</p></li>
    </ul>

    <br> =======================================

    <p><b>ImpulseChitra, Bangalore | Web Developer</b></p>
    <p>November 2021 - January 2022</p>
    <ul>
      <li><p>Developed responsive web applications with HTML5, CSS3, and JavaScript, utilizing frameworks like React and Angular for exceptional user interfaces. Collaborated closely with design teams to ensure a seamless user experience.</p></li>
      <li><p>Optimized front-end performance, achieving a remarkable 30% reduction in page load times. Integrated RESTful APIs and third-party services to enhance website functionality, ensuring efficient code management with Git for effective team collaboration and version control.</p></li>
      <li><p>Maintained high code quality standards through regular code reviews and debugging. Stayed up-to-date with industry trends and emerging web technologies, contributing to continuous improvement efforts in web development practices.</p></li>
    </ul>

    <br> =======================================
    `,
    parent: '/home/work'
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

    case 'top':
      const topText = `
        <p>
          top - up 22 years, 1 user, load average: 1.13, 0.44, 0.28<br>
          Tasks: 20 total, 20 running, 0 sleeping, 0 stopped, © zombie<br>
          %Cpu(s) : 14.4 Us, 1.0 sy, 0.0 ni, 84.6 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st<br>
          MiB Mem : 7974.8 total, 5649.8 free, 1306.6 used, 1018.4 buff/cache<br>
          MiB Swap: 4095.5 total, 4095.5 free, 0.0 used. 6397.9 avail Mem
        </p>
        <br>
        <table>
          <tr>
              <th>PID</th>
              <th>LANGUAGES & RUNTIMES</th>
              <th>CLOUD</th>
              <th>INFRASTRUCTURE TOOLS</th>
              <th>DATABASES</th>
              <th>OTHER TOOLS</th>
              <th>TIME+</th>
          </tr>
          <tr>
              <td>1</td>
              <td>Python</td>
              <td>GCP</td>
              <td>Ansible</td>
              <td>PostgreSQL</td>
              <td>Jenkins</td>
	            <td>0:02.30</td>
          </tr>
          <tr>
              <td>2</td>
              <td>HCL</td>
              <td>AWS</td>
              <td>Kubernetes</td>
              <td>MySQL</td>
              <td>GitHub Actions</td>
              <td>0:01.45</td>
          </tr>
          <tr>
              <td>3</td>
              <td>JavaScript</td>
              <td>Azure</td>
              <td>Docker</td>
              <td>Redis</td>
              <td>Nginx</td>
              <td>0:02.10</td>
          </tr>
          <tr>
              <td>4</td>
              <td>NodeJS</td>
              <td>Digital Ocean</td>
              <td>Terraform</td>
              <td>MongoDB</td>
              <td>Apache</td>
              <td>0:02.25</td>
          </tr>
          <tr>
              <td>5</td>
              <td>Git</td>
              <td></td>
              <td>Grafana</td>
              <td></td>
              <td></td>
              <td>0:01.50</td>
          </tr>
          <tr>
              <td>6</td>
              <td>Groovy</td>
              <td></td> 
              <td>CloudWatch</td>
              <td></td>
              <td></td>
              <td>0:25.05</td>
          </tr>
        </table><br>
        <italics>the level and skills are only for the GUI context and not actual rating</italics>`;
      output.innerHTML += '<br>' + topText;
      break;

    case 'whoami':
      const whoamiText = '<br><img src="whoami.png" alt="AsitSonawane" id="sudo" /> Asit Sonawane<br>' +
      '<a href="https://www.linkedin.com/in/asit-sonawane/" target="_blank">LinkedIn @asit-sonawane</a>';
      output.innerHTML += '<br>' + whoamiText;
      break;

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
        "- whoami: displays the user's name"+
        '- top: shows the processes and other details'
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
        output.innerHTML += '\n' + fileContent;
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