const INT_MAX = 50;
const INT_MIN = -50;

var Tarray = new Array; 

var alphabet = {
     1 : 'a',  2 : 'b',  3 : 'c',  4 : 'd',  5 : 'e',  6 : 'f',  7 : 'g',
     8 : 'h',  9 : 'i', 10 : 'j', 11 : 'k', 12 : 'l', 13 : 'm', 14 : 'n',
    15 : 'o', 16 : 'p', 17 : 'q', 18 : 'r', 19 : 's', 20 : 't', 21 : 'u',
    22 : 'v', 23 : 'w', 24 : 'x', 25 : 'y', 26 : 'z',
};


function rmSliderFromId(strinid) {

    strinid = strinid.replace("slider", "");

    if (strinid.includes("X")) {
        strinid = strinid.replace("X", "x");
    } else {
        strinid = strinid.replace("Y", "y");
    }
    return strinid;
}

$(document).ready( function() {
    var sliderOpts = {
        min : -50 ,
        max : 50 ,
        slide : function ( e, ui ) {

            let strinid = rmSliderFromId(this.id);

            
            $("#" + strinid).val( String(ui.value) );
            console.log(`sliding ${this.id}, ${strinid}, ${ui.value}, event = ${e}`);
        },
        stop : function( e, ui ) {
            
            

            let strinid = rmSliderFromId(this.id);
            
            handleErrorMessage(strinid, String(ui.value));
            validateFormOnSubmit(e);
        },
    }
    var tabs = $("#tabs").tabs();
 
    
    $("#button").click(validateFormOnSubmit);

    
    $("input").on('input', validateEntryOnInput);

    
    $("#close-all-tabs").click( function (e) {

        
        e.preventDefault();
        
        
        $(".ui-tabs-tab").remove();

        
        for ( let i = 0; i < Tarray.length; i++ ) {
            let id = alphabet[i + 1];
            $("#" + id).remove();
            
        }
        Tarray.length = 0;
    })

    
    $("#sliderXBegin").slider( sliderOpts );
    $("#sliderXEnd").slider( sliderOpts );
    $("#sliderYBegin").slider( sliderOpts );
    $("#sliderYEnd").slider( sliderOpts );

    tabs.on( "click", "span.ui-icon-close", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
      });
});


function validateEntryOnInput() {

    console.log(`validateEntryOnInput(): A user is typing.`);

    handleErrorMessage(this.id, this.value, isValidNumber(this.value));
}

function returnTypeOfError( value ) {

    console.log(`returnTypeOfError(): value = ${value}, type = ${typeof(value)}`);
    console.log(`value includes e? ${String(value).includes('e')}`);

    if ( isNaN(Number(value)) ) { 
        return "The value is not a number.";
    } else if ( parseInt(value) > INT_MAX) {
        return "Too large. Enter a value less than 50";
    } else if ( parseInt(value) < INT_MIN ) {
        return "Too small. Enter a value greater than 50";
    } else if ( !Number.isSafeInteger(Number(value)) ) { 
        return "You  entered a floating point number. Please enter an integer.";
    } else if ( value === "" ) {
        return "Unrecognized entry. Please enter an integer.";
    } else if ( value.includes('e') ) {
        return "Scientific notation is not allowed. Only integers.";
    } else {
        return "";
    }
}

function handleErrorMessage(id, value, isValid=false) {
    
    console.log(`handleErrorMessage(): id = ${id}, value = ${value}, isValid = ${isValid}`);
    
    let errorM, Cname, icon;
    
    if ( isValid === false ) { isValid = isValidNumber( value ); }

    if ( isValid ) {
        errorM = "";
        Cname = "validField";
        icon = "  ✓ ";
    } else {
        errorM = returnTypeOfError(value);
        Cname = "errorField";
        icon = "  ❌ ";
    }

    console.log(`handleErrorMessage(): icon = ${icon}, Cname = ${Cname}, errorM = ${errorM}`);
    if (id.includes("x")) {
        console.log(`true, contains x`);
        id = id.replace("x", "X");
    } else {
        console.log(`false, contains y`);
        id = id.replace("y", "Y");
    }
    id = "span" + id;
    $("#" + id).text(icon + errorM);
    $("#" + id).attr('class', Cname);
    console.log(`handleErrorMessage(): id = ${id}`);
}

function validateFormOnSubmit(event) {

    
    if (event.type == "click") { event.preventDefault(); }
    console.log(`validateFormOnSubmit(): target = ${event.target}, type = ${event.type}`);

    clearErrorAndTable();

    let values = getValues(); 
    let error = document.querySelector('#error');

    
    let validRange = true;
    for ( let i of values ) {
        if ( isValueInRange(i) === false ) {
            validRange = false;
            break;
        }
    }

    console.log(`validateFormOnSubmit(): validRange = ${validRange}`);

    
    if ( !validEntries(values) ) {
        error.innerHTML = `One or more invalid entries.
                           Please enter only integers.`;
        return;
    
    } else if ( !validRange ) {
        error.innerHTML = `You have entered one or more values that is too 
                        large.<br>Please enter integers between -50 and 50.`;
        return;
    } else {
        main(values);
    }
}

function main( values ) {

    clearErrorAndTable();

    let [ Cstart, colEnd, rstart, rowEnd ] = values;
    
     
    [ Cstart, colEnd ] = returnMinMax(Cstart, colEnd);
    [ rstart, rowEnd ] = returnMinMax(rstart, rowEnd);

    let Cvals = makeRange(Cstart, colEnd);
    let rVals = makeRange(rstart, rowEnd);

    
    let table = makeTwoDimensionalArray(Cvals, rVals);

    createTab(Cstart, colEnd, rstart, rowEnd);
    makeTable(table);
}

function createTab(xStart, xEnd, yStart, yEnd) {

    if (Tarray.length >= Object.keys(alphabet).length) {
        
        return;
    }
    

    let curr = Tarray.length + 1;

    Tarray.push(`<li><a href="#${alphabet[curr]}">[${xStart}, ${xEnd}] x [${yStart}, ${yEnd}]</a>
<span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>`);
    
    $("#tabs-list").append(Tarray[Tarray.length - 1]);

    
    $("#tabs").append(`<div id="${alphabet[curr]}"><div id="table-container">
<div id="table-wrapper"><table id="dyn-table-${alphabet[curr]}">
</table></div></div></div>`);

    $("#tabs").tabs("refresh");
}

function makeTwoDimensionalArray( Cvals, rVals ) {

    let row = [];
    let table = [];

    
    table.push(Cvals);
    for ( let i = 0; i < rVals.length; i++ ) {
        
        row.push(rVals[i]);
        for ( let j = 0; j < Cvals.length; j++ ) {
            row.push(Cvals[j] * rVals[i]);
        }
        table.push(row);
        row = [];
    }
    
    table[0].unshift("");

    return table;
}

function addCell( tr, val ) {
    
    let td = document.createElement('td');
    td.innerHTML = val;
    tr.appendChild(td);
}

function addHeaderCell( tr, val, addClass=undefined ) {
    
    let th = document.createElement('th');

    th.innerHTML = val;
    if ( addClass === "column" ) {
        th.Cname = "column-head";
    }
    if ( addClass === "row" ) {
        th.Cname = "row-head";
    }
    tr.appendChild(th);
}

function addRow( tbl, vals ) {

    let tr = document.createElement('tr');
    
    for ( let i = 0; i < vals.length; i++ ) {
        if ( i == 0 ) {
            addHeaderCell(tr, vals[i], "row");
            continue;
        }
        addCell(tr, vals[i]);
    }
    tbl.appendChild(tr);
}

function addHeaderRow( tbl, vals ) {

    let tr = document.createElement('tr');

    for ( let i = 0; i < vals.length; i++ ) {
        addHeaderCell(tr, vals[i], "column");
    }
    tbl.appendChild(tr);
}

function makeTable( table ) {

    console.assert( !(table === undefined) || table.length > 0 );

    
    tabId = "#dyn-table-" + alphabet[Tarray.length];
    tbl = document.querySelector(tabId);
    
    
    
    
    addHeaderRow(tbl, table[0], "column");
    for (let i = 1; i < table.length; i++) {
        addRow(tbl, table[i], "row");
    }

    
}

function makeRange( a, b ) {

    const start = parseInt(a);
    const end = parseInt(b);
    const length = end - start + 1;

    let range = [];

    for ( let i = start; i <= end; i++ ) {
        range.push(i);
    }
    return range;
}

function validEntries( entries ) {
    
    if ( entries.length != 4 ) {
        return false;
    }
    for ( let entry of entries ) {
        if ( !isValidNumber(entry) ) {
            return false;
        }
    }
    return true;
}

function isValidNumber( value ) {
    
    console.log(`isValidNumber(): value = ${value}, type = ${typeof(value)}`)

    if ( value &&
         !isNaN(Number(value)) &&
         Number.isSafeInteger(Number(value)) &&
         !value.includes('e') &&
         isValueInRange(value) ) { return true; }
    return false;
}

function isValueInRange( value ) {

    

    if ( parseInt(value) < INT_MIN || parseInt(value) > INT_MAX ) {
        return false;
    }
    return true;

}

function getValues() {

    let Cstart = document.querySelector('#xBegin').value;
    let colEnd = document.querySelector('#xEnd').value;
    let rstart = document.querySelector('#yBegin').value;
    let rowEnd = document.querySelector('#yEnd').value;

    return [ Cstart, colEnd, rstart, rowEnd ];
}

function returnMinMax( first, second ) {
    first = parseInt(first);
    second = parseInt(second);

    if ( first > second ) {
        return [ second, first ];
    } else {
        return [ first, second ];
    }
}

function clearErrorAndTable() {

    
    document.querySelector('#error').innerHTML = "";
}




function runTests() {

    console.log(`********************************`);
    console.log(`Begin output of unit tests.`);
    console.log(`********************************`);
    testValidEntries();
    testReturnMinMax();
    testMakeRange();
    testInRange();
    console.log(`********************************`);
    console.log(`End output of unit tests.`);
    console.log(`********************************`);
}

function testValidEntries() {

    let testVals;
    testVals = [ 1, 2, 3, 4 ];
    console.assert(validEntries(testVals),
                   'Case 1 failed with %s.', testVals.toString());

    testVals = [ -1, 2, 9, 10 ];
    console.assert(validEntries(testVals),
                   'Case 2 failed with %s.', testVals.toString());

    testVals = [ -55, -45, -2, -1 ];
    console.assert(validEntries(testVals),
                   'Case 3 failed with %s.', testVals.toString());

    testVals = [ 1, 2, 3, ];
    console.assert(!validEntries(testVals),
                   'Case 4 failed with %s.', testVals.toString());

    testVals = [ 1, 2, "3", 4 ];
    console.assert(validEntries(testVals),
                   'Case 5 failed with %s.', testVals.toString());

    testVals = [ 1, 2, "foo", 4 ];
    console.assert(!validEntries(testVals),
                   'Case 6 failed with %s.', testVals.toString());

    testVals = [ 1, 2, "", 4 ];
    console.assert(!validEntries(testVals),
                   'Case 7 failed with %s.', testVals.toString());

    testVals = [ 1, 3.14, 8, 4 ];
    console.assert(!validEntries(testVals), 
                   'Case 8 failed with %s.', testVals.toString());
}

function testReturnMinMax() {

    let a = 1, b = 2;
    console.assert(testArraysAreEqual(returnMinMax(a, b), [a, b]),
                    'Case 1 failed with [%s]', [a, b].toString());

    console.assert(testArraysAreEqual(returnMinMax(b, a), [a, b]),
                    'Case 2 failed with [%s]', [a, b].toString());
}

function testMakeRange() {

    let testVals;

    a = 1, b = 4;
    console.assert(testArraysAreEqual(makeRange(a, b), [1, 2, 3, 4]),
                    'Case 1 failed with [%s]', makeRange(a, b).toString());
}

function testisValueInRange() {

    let testVals;

    console.assert(!isValueInRange(-51),
                   'Case 1 failed with [%s]', -51);

    console.assert(!isValueInRange(1000),
                   'Case 2 failed with [%s]', 1000);

    console.assert(isValueInRange(1),
                   'Case 3 failed with [%s]', 1);
}


function testArraysAreEqual( a, b ) {

    if ( a === b ) { return true; }
    if ( a.length != b.length ) { return false; }
    for ( let i = 0; i < a.length; i++ ) {
        if ( !(a[i] === b[i]) ) { return false; }
    }
    return true;
}

 Number.isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' && 
      isFinite(value) && 
      Math.floor(value) === value;
  };

  Number.isSafeInteger = Number.isSafeInteger || function (value) {
    return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
 };