import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as path from 'path';

// You can define the path to the Python interpreter and the script in an environment variable or directly in the code
const pythonInterpreter: string = process.env.PYTHON_INTERPRETER || 'python3';
const root = '/Users/spankyed/Develop/Projects/PdfToVid/src/';
const pythonScript: string = process.env.PYTHON_SCRIPT || path.join(root, 'fetchTestPy.py'); 

// Spawn a child process
const python: ChildProcessWithoutNullStreams = spawn(pythonInterpreter, [pythonScript]);

let dataString: string = '';
let errorString: string = '';

// Listen for data on the stdout stream and append it to dataString
python.stdout.on('data', (data: Buffer) => {
  console.log('data: ', data.toJSON());
    dataString += data.toString();
});

// Listen for data on the stderr stream, which will include any error messages from Python, and append it to errorString
python.stderr.on('data', (data: Buffer) => {
    errorString += data.toString();
});

// When the Python script finishes, check for errors and log the output or errors
python.on('close', (code: number|null) => {
    if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error('Error string: ', errorString);
    } else {
        console.log('Python script finished successfully.');
        console.log('dataString: ', dataString);
        console.log('Data string: ', JSON.parse(dataString));
    }
});

// If an error occurs in the child process, log it
python.on('error', (err: Error) => {
    console.error('Failed to start Python script.', err);
});
