import $ from 'jquery';
import {parseCodeLocation, symbolizeCode,findStart} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let inputVector = $('#input').val();
        let parsedCode = parseCodeLocation(codeToParse);
        let symbolized=symbolizeCode(codeToParse,parsedCode);
        let index=findStart(parsedCode);
        let init=generateInit(inputVector,symbolized[0][index],symbolized[1]);
        let html=generateAnswer(symbolized[0],init);
        document.write(html);
    });
});

function generalInitEzer(locals,init,paramsArray,inputArray){
    for(let i=0;i<inputArray.length;i++){
        init = init+'let ' + paramsArray[i] + '=' + inputArray[i] + ';';
    }
    for(let i=0;i<locals.length;i++){
        init = init + 'let ' + locals[i].nameOfLocal + '=' + locals[i].value + ';';
    }
    return init;
}

function checkCondition(conditionLine,init){
    if(conditionLine!=null)
        conditionLine = conditionLine.substring(conditionLine.indexOf('(')+1,conditionLine.lastIndexOf(')'));
    init=init+' '+conditionLine;
    return eval(init);
}

function generateAnswer(stringArray,init){
    let html='<html><body>';
    for(let i=0;i<stringArray.length;i++){
        if(stringArray[i].trim()!='' && !stringArray[i].includes('if (')) {
            html=html+'<div>';
            html=addSpaces(html,stringArray,i);
            html=html+stringArray[i];
            html=html+'</div>';
        }
        else if(stringArray[i].trim()!=''){
            html=generateAnswerEzer1(stringArray,init,html,i);
        }
    }
    html=html+'</body></html>';
    return html;
}

function addSpaces(html,stringArray,i){
    for(let j=0;j<numberOfSpaces(stringArray[i]);j++)
        html=html+'&nbsp;';
    return html;
}

function generateAnswerEzer1(stringArray,init,html,i){
    let isTrue = checkCondition(stringArray[i],init);
    if(isTrue){
        html=html+'<div style="background-color:green;">';
        for(let j=0;j<numberOfSpaces(stringArray[i]);j++)
            html=html+'&nbsp;';
        html=html+stringArray[i];
        html=html+'</div>';
    }
    else{
        html=html+'<div style="background-color:red;">';
        for(let j=0;j<numberOfSpaces(stringArray[i]);j++)
            html=html+'&nbsp;';
        html=html+stringArray[i];
        html=html+'</div>';
    }
    return html;
}

function numberOfSpaces(line){
    let counter=0;
    for(let i=0;i<line.length;i++){
        if(line.charAt(i)==' ')
            counter++;
    }
    return counter;
}



function generateInit(inputVector,params,locals){
    let init='';
    let inputArray=inputVector.split(',');
    if(params!=null)
        params = params.substring(params.indexOf('(')+1,params.indexOf(')'));
    let paramsArray = params.split(',');
    for(let i=0;i<paramsArray.length;i++)
        paramsArray[i]=paramsArray[i].trim();
    for(let i=0;i<inputArray.length;i++)
        inputArray[i]=inputArray[i].trim();
    init=generalInitEzer(locals,init,paramsArray,inputArray);
    return init;
}

