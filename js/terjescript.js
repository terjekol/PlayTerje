class TerjeScript {
    constructor(svgId) {
        this.svgId = svgId;
        this.appContext = {
            path: '',
            programCounterIndex: 0,
            state: {
                x: 0,
                y: 0,
            },
        };
        const pathCommand = letter => function(args)  {
            this.appContext.path += `${letter} ${args.x} ${args.y} `;
            this.appContext.state.x = args.x;
            this.appContext.state.y = args.y;
        };
        this.commands = {
            hoppTil: {
                name: 'Hopp til punktet',
                params: ['x', 'y'],
                impl: pathCommand('M')
            },
            hopp: {
                name: 'Hopp',
                params: ['x', 'y'],
                impl: pathCommand('m')
            },
            tegnLinjeTil: {
                name: 'Tegn linje til punktet',
                params: ['x', 'y'],
                impl: pathCommand('L')
            },
            tegnLinje: {
                name: 'Tegn linje',
                params: ['x', 'y'],
                impl: pathCommand('l')
            },
            goto: {
                nameTxt: 'Gå til ',
                nameJs: 'tegnLinjeTilPunkt',
                params: ['instructionId'],
                programCounter(args){
                    const id = args.instructionId;
                    this.appContext.programCounterIndex = this.program.main.findIndex(instruction=>instruction.id===id);
                }
            }
        };
        this.program = {
            main: [
                { id: 'bbb', command: this.commands.tegnLinje, args: { x: 10, y: 0 } },
                { id: 'ccc', command: this.commands.lineTo, args: { x: 0, y: 10 } },
                { id: 'ddd', command: this.commands.goto, args: { instructionId: 'bbb' } },
            ],
            custom: {

            }
        }
    }
    uniqueIdentifierPart() {
        return (0x10000 | Math.random() * 0x10000).toString(16).substr(1);
    }
    uniqueIdentifier(tmp) {
        return tmp && tmp.length === 32 ? tmp : this.random128hex((tmp || '') + this.uniqueIdentifierPart());
    }
}