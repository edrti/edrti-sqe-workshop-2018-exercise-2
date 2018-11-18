import $ from 'jquery';
import {generateObject, parseCodeLocation,generateTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCodeLocation(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let arr=[];
        generateObject(parsedCode['body'][0],arr);
        //$('#parsedCode').val(arr);
        let html=generateTable(arr);
        document.write(html);
    });
});
