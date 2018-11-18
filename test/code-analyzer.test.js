import assert from 'assert';
import {parseCodeLocation, generateObject, generateTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCodeLocation('')),
            '{\\"type\\":\\"Program\\",\\"body\\":[],\\"sourceType\\":\\"script\\",\\"loc\\":{\\"start\\":{\\"line\\":0,\\"column\\":0},\\"end\\":{\\"line\\":0,\\"column\\":0}}}'.replace(/\\/g, '').replace(/\s/g, ''));});
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCodeLocation('let a = 1;')),
            '{\\"type\\":\\"Program\\",\\"body\\":[{\\"type\\":\\"VariableDeclaration\\",\\"declarations\\":[{\\"type\\":\\"VariableDeclarator\\",\\"id\\":{\\"type\\":\\"Identifier\\",\\"name\\":\\"a\\",\\"loc\\":{\\"start\\":{\\"line\\":1,\\"column\\":4},\\"end\\":{\\"line\\":1,\\"column\\":5}}},\\"init\\":{\\"type\\":\\"Literal\\",\\"value\\":1,\\"raw\\":\\"1\\",\\"loc\\":{\\"start\\":{\\"line\\":1,\\"column\\":8},\\"end\\":{\\"line\\":1,\\"column\\":9}}},\\"loc\\":{\\"start\\":{\\"line\\":1,\\"column\\":4},\\"end\\":{\\"line\\":1,\\"column\\":9}}}],\\"kind\\":\\"let\\",\\"loc\\":{\\"start\\":{\\"line\\":1,\\"column\\":0},\\"end\\":{\\"line\\":1,\\"column\\":10}}}],\\"sourceType\\":\\"script\\",\\"loc\\":{\\"start\\":{\\"line\\":1,\\"column\\":0},\\"end\\":{\\"line\\":1,\\"column\\":10}}}'.replace(/\\/g, '').replace(/\s/g, ''));});
});

describe('test table', () => {
    it('is generating function parameters', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(X, V, n){ }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, '')
            ,'[{"location":1,"type":"function declaration","nameOf":"binarySearch","condition":null,"value":null},{"location":1,"type":"variable declaration"," nameOf":"X","condition":null,"value":null},{"location":1,"type":"variable declaration","nameOf":"V","condition":null,"value":null},{"location":1,"type":"variable declaration","nameOf":"n","condition":null,"value":null}]'.replace(/\s/g, '')
        );
    });
    it('is generating uninitialized variable declerations', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(X, V, n){ let low; }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, '')
            ,'[{"location":1,"type":"functiondeclaration","nameOf":"binarySearch","condition":null,"value":null},{"location":1,"type":"variabledeclaration","nameOf":"X","condition":null,"value":null},{"location":1,"type":"variabledeclaration","nameOf":"V","condition":null,"value":null},{"location":1,"type":"variabledeclaration","nameOf":"n","condition":null,"value":null},{"location":1,"type":"variabledeclaration","nameOf":"low","condition":null,"value":null}]'.replace(/\s/g, '')
        );
    });
});

describe('The javascript parser', () => {
    it('is generating initialized variable expression', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n){ let low=0; }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, '')
            ,'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"low\\",\\"condition\\":null,\\"value\\":0}]'.replace(/\\/g, '').replace(/\s/g, ''));});
    it('is generating full function', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(X, V, n){ let low, high, mid; low = 0; high = n - 1; while (low <= high) { mid = (low + high)/2; if (X < V[mid]) high = mid - 1; else if (X > V[mid]) low = mid + 1; else return mid; } return -1; }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, '')
            ,'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"X\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"V\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"low\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"high\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"mid\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"low\\",\\"condition\\":null,\\"value\\":0},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"high\\",\\"condition\\":null,\\"value\\":\\"n-1\\"},{\\"location\\":1,\\"type\\":\\"whilestatement\\",\\"nameOf\\":null,\\"condition\\":\\"low<=high\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"mid\\",\\"condition\\":null,\\"value\\":\\"low+high/2\\"},{\\"location\\":1,\\"type\\":\\"ifstatement\\",\\"nameOf\\":null,\\"condition\\":\\"X<V[mid]\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"elseifstatement\\",\\"nameOf\\":null,\\"condition\\":\\"X>V[mid]\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"returnstatement\\",\\"nameOf\\":null,\\"condition\\":null,\\"value\\":\\"mid\\"}]'.replace(/\\/g, '').replace(/\s/g, ''));});
});

describe('The javascript parser', () => {
    it('another coverage branches', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n){ let n=V[4]+(-2); }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, '')
            ,'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":\\"V[4]+-2\\"}]'.replace(/\\/g, '').replace(/\s/g, ''));});

    it('is generating initialized variable expression', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n){ for(let i=0;i<=5;i++){ if(n==2) n=1; } let n=V[4]+V[2]; for(;i<=5;){} }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, '')
            ,'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"forstatement\\",\\"nameOf\\":null,\\"condition\\":\\"i<=5\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"i\\",\\"condition\\":null,\\"value\\":0},{\\"location\\":null,\\"type\\":\\"updateexpression\\",\\"nameOf\\":null,\\"condition\\":null,\\"value\\":\\"i++\\"},{\\"location\\":1,\\"type\\":\\"ifstatement\\",\\"nameOf\\":null,\\"condition\\":\\"n==2\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":\\"V[4]+V[2]\\"},{\\"location\\":1,\\"type\\":\\"forstatement\\",\\"nameOf\\":null,\\"condition\\":\\"i<=5\\",\\"value\\":null}]'.replace(/\\/g, '').replace(/\s/g, ''));});
});


describe('more table testing', () => {
    it('is generating full function with special cases', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n){ let low=-2; 4-V[n]; i++; for(let i=0;i<=5;i=i++){} }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, ''),'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"low\\",\\"condition\\":null,\\"value\\":\\"-2\\"},{\\"location\\":1,\\"type\\":\\"binaryexpression\\",\\"condition\\":null,\\"value\\":\\"4-V[n]\\"},{\\"location\\":null,\\"type\\":\\"updateexpression\\",\\"nameOf\\":null,\\"condition\\":null,\\"value\\":\\"i++\\"},{\\"location\\":1,\\"type\\":\\"forstatement\\",\\"nameOf\\":null,\\"condition\\":\\"i<=5\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"i\\",\\"condition\\":null,\\"value\\":0},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"i\\",\\"condition\\":null,\\"value\\":\\"i++\\"}]'.replace(/\\/g, '').replace(/\s/g, ''));
    });
    it('add cases for full coverage', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n){ let low=-2; let s; s=4; 4-V[n]; i++; 2+8; for(let i=0;i<=5;i=i++){ j++; j=(2+4)+v[n]; } while(n){} }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, ''),'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"low\\",\\"condition\\":null,\\"value\\":\\"-2\\"},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"s\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"s\\",\\"condition\\":null,\\"value\\":4},{\\"location\\":1,\\"type\\":\\"binaryexpression\\",\\"condition\\":null,\\"value\\":\\"4-V[n]\\"},{\\"location\\":null,\\"type\\":\\"updateexpression\\",\\"nameOf\\":null,\\"condition\\":null,\\"value\\":\\"i++\\"},{\\"location\\":1,\\"type\\":\\"binaryexpression\\",\\"condition\\":null,\\"value\\":\\"2+8\\"},{\\"location\\":1,\\"type\\":\\"forstatement\\",\\"nameOf\\":null,\\"condition\\":\\"i<=5\\",\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"i\\",\\"condition\\":null,\\"value\\":0},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"i\\",\\"condition\\":null,\\"value\\":\\"i++\\"},{\\"location\\":null,\\"type\\":\\"updateexpression\\",\\"nameOf\\":null,\\"condition\\":null,\\"value\\":\\"j++\\"},{\\"location\\":1,\\"type\\":\\"assignmentexpression\\",\\"nameOf\\":\\"j\\",\\"condition\\":null,\\"value\\":\\"2+4+v[n]\\"},{\\"location\\":1,\\"type\\":\\"whilestatement\\",\\"nameOf\\":null,\\"condition\\":\\"n\\",\\"value\\":null}]'.replace(/\\/g, '').replace(/\s/g, ''));
    });
    it('identifier test', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n,X){ n; if(V[4]) X=V[4]; }');
        generateObject(parsedCode['body'][0],arr);
        assert.equal(JSON.stringify(arr).replace(/\s/g, ''),'[{\\"location\\":1,\\"type\\":\\"functiondeclaration\\",\\"nameOf\\":\\"binarySearch\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"X\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"variabledeclaration\\",\\"nameOf\\":\\"n\\",\\"condition\\":null,\\"value\\":null},{\\"location\\":1,\\"type\\":\\"ifstatement\\",\\"nameOf\\":null,\\"condition\\":\\"V[4]\\",\\"value\\":null}]'.replace(/\\/g, '').replace(/\s/g, ''));
    });
});

describe('test html generator', () => {
    it('test if html generator works', () => {
        let arr=[];
        let parsedCode=parseCodeLocation('function binarySearch(n){ let low=-2;}');
        generateObject(parsedCode['body'][0],arr);
        let html=generateTable(arr);
        assert.equal((html).replace(/\s/g, ''),'<html><body><tableborder=\\"1\\"><tbody><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>functiondeclaration</td><td>binarySearch</td><td></td><td></td></tr><tr><td>1</td><td>variabledeclaration</td><td>n</td><td></td><td></td></tr><tr><td>1</td><td>variabledeclaration</td><td>low</td><td></td><td>-2</td></tr></tbody></table></body></html>'.replace(/\\/g, '').replace(/\s/g, ''));
    });

});
