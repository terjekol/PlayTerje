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
        this.commands = {
            hoppTil: {
                name: 'Hopp til punktet',
                params: ['x', 'y'],
                impl: this.pathCommand('M').bind(this),
            },
            hopp: {
                name: 'Hopp i retning',
                params: ['x', 'y'],
                impl: this.pathCommand('m').bind(this),
            },
            tegnLinjeTil: {
                name: 'Tegn linje til punktet',
                params: ['x', 'y'],
                impl: this.pathCommand('L').bind(this),
            },
            tegnLinje: {
                name: 'Tegn linje i retning',
                params: ['x', 'y'],
                impl: this.pathCommand('l').bind(this),
            },
            goto: {
                nameTxt: 'Gå til ',
                nameJs: 'tegnLinjeTilPunkt',
                params: ['instructionId'],
                programCounter(args) {
                    const id = args.instructionId;
                    this.appContext.programCounterIndex = this.program.main.findIndex(instruction => instruction.id === id);
                }
            }
        };
    }
    initProgram() {
        this.program = {
            selectedIndex: 0,
            main: [
                { id: 'bbb', command: this.commands.tegnLinje, args: { x: 10, y: 0 } },
                { id: 'ccc', command: this.commands.tegnLinje, args: { x: 0, y: 10 } },
                //{ id: 'ddd', command: this.commands.goto, args: { instructionId: 'bbb' } },
            ],
            custom: {

            }
        }
    }
    moveCommandInProgram(index, delta, program) {
        const element = this.program.main.splice(index, 1)[0];
        this.program.main.splice(index + delta, 0, element);
    }
    selectCommandInProgram(index) {
        this.program.selectedIndex = index;
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
        for (let step of this.program.main) {
            step.command.impl(step.args);
        }
        this.canvas.updateView(this.appContext.path);
    }
}