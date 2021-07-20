class TerjeScript {
    constructor(svgId) {
        this.svgId = svgId;
        this.pathCommand = letter => function (args) {
            this.appContext.path += `${letter} ${args.x} ${args.y} `;
            this.appContext.state.x = args.x;
            this.appContext.state.y = args.y;
        };
        this.initCommands();
        this.initProgram();
        this.initElements();
    }
    initCommands() {
        this.commands = [
            {
                id: 'hoppTil',
                name: 'Hopp til punktet',
                params: ['x', 'y'],
                impl: this.pathCommand('M').bind(this),
            },
            {
                id: 'hopp',
                name: 'Hopp i retning',
                params: ['x', 'y'],
                impl: this.pathCommand('m').bind(this),
            },
            {
                id: 'tegnLinjeTil',
                name: 'Tegn linje til punktet',
                params: ['x', 'y'],
                impl: this.pathCommand('L').bind(this),
            },
            {
                id: 'tegnLinje',
                name: 'Tegn linje i retning',
                params: ['x', 'y'],
                impl: this.pathCommand('l').bind(this),
            },
            {
                id: 'goTo',
                nameTxt: 'Gå til ',
                nameJs: 'tegnLinjeTilPunkt',
                params: ['instructionId'],
                programCounter(args) {
                    const id = args.instructionId;
                    this.appContext.programCounterIndex = this.program.main.findIndex(instruction => instruction.id === id);
                }
            }
        ];
    }
    initProgram() {
        this.programs = [
            {
                selectedIndex: 0,
                steps: [
                    { id: 'bbb', command: 'tegnLinje', args: { x: 10, y: 0 } },
                    { id: 'ccc', command: 'tegnLinje', args: { x: 0, y: 10 } },
                    //{ id: 'ddd', command: this.commands.goto, args: { instructionId: 'bbb' } },
                ],
            }
        ];
    }
    getCommand(id) {
        return this.commands.find(cmd => cmd.id === id);
    }
    getSteps(programIndex) {
        const program = this.programs[programIndex];
        return program.steps;
    }
    getCommands() {
        return this.commands;
    }
    moveCommandInProgram(delta, programIndex) {
        const program = this.programs[programIndex || 0];
        const index = program.selectedIndex;
        const newIndex = index + delta;
        const element = program.steps.splice(index, 1)[0];
        program.steps.splice(newIndex, 0, element);
        this.setSelectedIndex(newIndex, programIndex);
    }
    deleteCommandInProgram(programIndex) {
        const program = this.programs[programIndex || 0];
        const index = program.selectedIndex;
        program.steps.splice(index, 1);
        this.setSelectedIndex(index, programIndex);
    }
    setSelectedIndex(index, programIndex) {
        const program = this.programs[programIndex || 0];
        program.selectedIndex = Math.min(Math.max(index, 0), program.steps.length - 1);
    }
    getSelectedIndex(programIndex) {
        const program = this.programs[programIndex];
        return program.selectedIndex;
    }
    initElements() {
        this.canvas = document.getElementsByTagName('terjescript-canvas')[0];
        this.editor = document.getElementsByTagName('terjescript-editor')[0];
        //this.canvas.registerCore(this);
        this.editor.registerCore(this);
    }
    initAppContext() {
        this.appContext = {
            path: 'M 0 0 ',
            programCounterIndex: 0,
            state: {
                x: 0,
                y: 0,
            },
        };
    }

    uniqueIdentifierPart() {
        return (0x10000 | Math.random() * 0x10000).toString(16).substr(1);
    }
    uniqueIdentifier(tmp) {
        return tmp && tmp.length === 32 ? tmp : this.random128hex((tmp || '') + this.uniqueIdentifierPart());
    }
    run() {
        this.initAppContext();
        for (let step of this.programs[0].steps) {
            const command = this.getCommand(step.command);
            command.impl(step.args);
        }
        this.canvas.updateView(this.appContext.path);
    }
}