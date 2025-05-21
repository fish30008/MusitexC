# MIDI Generator

This application parses a custom syntax file and converts it into a MIDI file.

## Prerequisites

Before running this code, ensure you have the following dependencies installed:

- Python 3.x
- Required Python modules (you may need to install these using pip):
```bash
pip install midiutil
```
## Project Structure

The code consists of several modules:
- `new_parser.py`: Contains the `Parser` class for parsing tokens into an abstract syntax tree
- `lexer.py`: Contains the `Tokenizer` class for converting source code into tokens
- `simplify.py`: Contains functions to simplify and resolve AST elements
- `ai_ast.py`: Contains AST traversal utilities
- `midigen.py`: Contains functions to generate MIDI output from the AST

## Usage

To run the code, use the following command:

```bash
python main.py <input_file> [output_file]
```

Where:
- `<input_file>` is the path to your input file with the custom syntax
- `[output_file]` (optional) is the name for the output MIDI file

If no output file is specified, the program will generate one based on the input filename.

### Example

```bash
python main.py ./examples/twinkle.mtex
```

This will read `./examples/twinkle.mtex` and produce `twinkle.midi`.

Or, with a custom output filename:

```bash
python main.py ./examples/twinkle.mtex my_output.midi
```

## Input File Format

The input file should use the custom syntax that can be parsed by the system. This includes:
- Musical notation
- Macro definitions
- Repeats and grouping expressions


## How It Works

1. The code tokenizes the input file using the `Tokenizer` class.
2. The tokens are parsed into an abstract syntax tree (AST) using the `Parser` class.
3. Several simplification passes are applied to the AST:
   - `resolve_repeats`: Handles repeat structures
   - `flatten_expr_group`: Flattens grouped expressions
   - `resolve_macros`: Processes macro definitions
4. Finally, the AST is converted into a MIDI file using `gen_midi()`.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
