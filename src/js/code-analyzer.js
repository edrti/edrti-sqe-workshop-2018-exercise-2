import * as esprima from 'esprima';

const parseCodeLocation = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};

function Info(_location,_type,_name,_condition,_value){
    this.location=_location;
    this.type=_type;
    this.nameOf=_name;
    this.condition=_condition;
    this.value=_value;
}

const mapToFunction = {
    FunctionDeclaration : functionParser,
    Identifier: IdentifierParser,
    VariableDeclaration: variableDeclarationParser,
    VariableDeclarator: variableDeclaratorParser,
    ExpressionStatement: expressionStatementParser,
    AssignmentExpression: assignmentExpressionParser,
    BinaryExpression: parseBinaryExpression,
    WhileStatement: parseWhileStatement,
    IfStatement: parseIfStatement,
    ForStatement: parseForStatement,
    UpdateExpression: parseUpdateExpression
};

function generateObject (parsedCode,arr){
    let type = parsedCode['type'];
    mapToFunction[type](parsedCode,arr);
}

function IdentifierParser(parsedCode,arr){
    arr.push(new Info(parsedCode['loc']['start']['line'],'variable declaration',parsedCode['name'],null,null));
}

function functionParser (parsedCode,arr){
    let nameOfFunction = parsedCode['id']['name'];
    arr.push(new Info(parsedCode['loc']['start']['line'],'function declaration',nameOfFunction,null,null));
    for(let i=0;i<parsedCode['params'].length;i++)
        generateObject(parsedCode['params'][i],arr);
    let functionBody=parsedCode['body']['body'];
    for(let i=0;i<functionBody.length;i++){
        functionParserEzer(parsedCode,arr,functionBody,i);
    }
}

function functionParserEzer(parsedCode,arr,functionBody,i){
    if(functionBody[i]['type']!='ReturnStatement'){
        if(functionBody[i]['type']=='IfStatement')
            parseIfStatement(functionBody[i],arr,0);
        else generateObject(functionBody[i],arr);
    }
}

function variableDeclarationParser (parsedCode,arr){
    for(let i=0;i<parsedCode['declarations'].length;i++)
        generateObject(parsedCode['declarations'][i],arr);
}

function variableDeclaratorParser (parsedCode,arr){
    if(parsedCode['init']==null)
        arr.push(new Info(parsedCode['loc']['start']['line'],'variable declaration',parsedCode['id']['name'],null,null));
    else
        arr.push(new Info(parsedCode['loc']['start']['line'],'variable declaration',parsedCode['id']['name'],null,getExpressionValue(parsedCode['init'])));
}

function expressionStatementParser (parsedCode,arr){
    if(parsedCode['expression']['type']=='AssignmentExpression')
        assignmentExpressionParser(parsedCode['expression'],arr,0);
    else if(parsedCode['expression']['type']=='BinaryExpression')
        parseBinaryExpression(parsedCode['expression'],arr,0);
    else if(parsedCode['expression']['type']=='UpdateExpression')
        parseUpdateExpression(parsedCode['expression'],arr,0);
    else IdentifierParser(parsedCode['expression'],arr,0);
}


function assignmentExpressionParser (parsedCode,arr){
    let value = getExpressionValue(parsedCode['right']);
    arr.push(new Info(parsedCode['loc']['start']['line'],'assignment expression',parsedCode['left']['name'],null,value));
}

function getBinaryExpressionValue(parsedCode){
    let leftValue=getBinaryExpressionSideValue(parsedCode,'left').toString();
    let rightValue=getBinaryExpressionSideValue(parsedCode,'right').toString();
    let op=leftValue.concat(' ',parsedCode['operator'].toString());
    return op+' '+(rightValue);
}

function getBinaryExpressionSideValue(parsedCode,side){
    if (parsedCode[side]['type']=='BinaryExpression')
        return getBinaryExpressionValue(parsedCode[side]);
    else if(parsedCode[side]['type']=='Identifier')
        return parsedCode[side]['name'];
    else if(parsedCode[side]['type']=='Literal')
        return parsedCode[side]['value'];
    else if(parsedCode[side]['type']=='MemberExpression')
        return getMemberExpressionValue(parsedCode[side]);
    return parsedCode[side]['operator']+getExpressionValue(parsedCode[side]['argument']);
}

function parseBinaryExpression(parsedCode,arr){
    arr.push(new Info(parsedCode['loc']['start']['line'],'binary expression',parsedCode['left']['name'],null,getBinaryExpressionValue(parsedCode)));
}

function parseWhileStatement(parsedCode,arr){
    arr.push(new Info(parsedCode['loc']['start']['line'],'while statement',null,getExpressionValue(parsedCode['test']),null));
    let whileBody=parsedCode['body']['body'];
    for(let i=0;i<whileBody.length;i++){
        if(whileBody[i]['type']=='IfStatement')
            parseIfStatement(whileBody[i],arr,0);
        else generateObject(whileBody[i],arr);
    }
}

function getMemberExpressionValue(parsedCode){
    let left = parsedCode['object']['name'];
    let inside = getExpressionValue(parsedCode['property']);
    let op=left+'[';
    let op2=inside+']';
    return op+op2;
}

function getExpressionValue(parsedCode){
    if(parsedCode['type']=='BinaryExpression')
        return getBinaryExpressionValue(parsedCode);
    else if(parsedCode['type']=='Identifier')
        return parsedCode['name'];
    else if(parsedCode['type']=='MemberExpression')
        return getMemberExpressionValue(parsedCode);
    else if(parsedCode['type']=='Literal')
        return parsedCode['value'];
    else return getExpressionValueEzer(parsedCode);
}

function getExpressionValueEzer(parsedCode){
    if(parsedCode['type']=='UnaryExpression')
        return parsedCode['operator']+getExpressionValue(parsedCode['argument']);
    return getExpressionValue(parsedCode['argument'])+parsedCode['operator'];
}

function parseIfStatement(parsedCode,arr,num){
    if(num==0)
        arr.push(new Info(parsedCode['loc']['start']['line'],'if statement',null,getExpressionValue(parsedCode['test']),null));
    else
        arr.push(new Info(parsedCode['loc']['start']['line'],'else if statement',null,getExpressionValue(parsedCode['test']),null));
    if(parsedCode['alternate']!=null){
        parseIfStatementEzer(parsedCode,arr);
    }
}

function parseIfStatementEzer(parsedCode,arr){
    if(parsedCode['alternate']['type']!=null && parsedCode['alternate']['type']=='IfStatement')
        parseIfStatement(parsedCode['alternate'],arr,1);
    else
        arr.push(new Info(parsedCode['alternate']['loc']['start']['line'],'return statement',null,null,getExpressionValue(parsedCode['alternate']['argument'])));
}

function parseForStatement(parsedCode,arr){
    arr.push(new Info(parsedCode['loc']['start']['line'],'for statement',null,getExpressionValue(parsedCode['test']),null));
    if(parsedCode['init']!=null)
        generateObject(parsedCode['init'],arr,0);
    if(parsedCode['update']!=null)
        generateObject(parsedCode['update'],arr,0);
    let forBody=parsedCode['body']['body'];
    for(let i=0;i<forBody.length;i++){
        if(forBody[i]['type']=='IfStatement')
            parseIfStatement(forBody[i],arr,0);
        else generateObject(forBody[i],arr);
    }
}

function parseUpdateExpression(parsedCode,arr){
    arr.push(new Info(null,'update expression',null,null,getExpressionValue(parsedCode['argument'])+parsedCode['operator']));
}

function generateTable(arr){
    let html='<html><body><table border="1"><tbody>';
    html=html+'<tr>'+'<td>'+'Line'+'</td>'+'<td>'+'Type'+'</td>';
    html=html+'<td>'+'Name'+'</td>';
    html=html+'<td>'+'Condition'+'</td>';
    html=html+'<td>'+'Value'+'</td>';
    html=html+'</tr>';
    for(let i=0;i<arr.length;i++){
        html=html+'<tr>';
        html=html+tableGeneratorEzer(arr[i].location);
        html=html+tableGeneratorEzer(arr[i].type);
        html=html+tableGeneratorEzer(arr[i].nameOf);
        html=html+tableGeneratorEzer(arr[i].condition);
        html=html+tableGeneratorEzer(arr[i].value);
        html=html+'</tr>';
    }
    html=html+'</tbody> </table></body></html>';
    return html;
}

function tableGeneratorEzer(element){
    if(element!=null)
        return '<td>'+element+'</td>';
    return '<td>'+''+'</td>';

}

export {parseCodeLocation,generateObject,generateTable};

