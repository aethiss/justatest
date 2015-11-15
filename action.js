/**
 * Created by aethiss on 14/11/15.
 */

/**
 * Asserts "expected" versus "actual",
 * 'failing' the assertion (via Error) if a difference is found.
 *
 * @param {String} message The comparison message passed by the user
 * @param {*} expected The expected item
 * @param {*} actual The actual item
 */
function assertEquals(message, expected, actual) {

  var failure = new Object();

  if (defineType(expected) != defineType(actual)) {

    failure.message = message + " Expected type " + defineType(expected) + " but found " + defineType(actual);
    throw failure;

  } else if (defineType(expected) == 'Array') {    // If Arrays check length

    if (expected.length != actual.length) {
      failure.message = message+' Expected array length '+expected.length+' but found '+actual.length;
      throw failure;
    }

  } else if (defineType(expected) == 'Object') {  // Objects

    var checkObj = testObj(expected, actual);
    if (checkObj.error) {
      failure.message = message+" Expected "+checkObj.msg;
      throw failure;
    }

  } else { // If primitive data, compare
    if (expected != actual) {
      failure.message = message+' Expected "'+expected+'" but found "'+actual+'"';
      throw failure
    }
  }


}


function defineType(data) {

  return Object.prototype.toString.call(data).slice(8, -1)
}


function testObj(obj, expObj) {

  //var typeObj = defineType(obj);

  for (var i in obj) {
    if (typeof(obj[i]) == 'object') {  // Array and Object are 'objects' with typeof
      var isCorrect = testObj(obj[i], expObj[i]);
      if (isCorrect.error) {

        var newMsg = "";

        // Format String Error
        if (defineType(obj) == 'Array') {
          newMsg = "["+i+"]."+isCorrect.msg;
        } else {
          if (defineType(obj[i]) == 'Array') {
            newMsg = i+isCorrect.msg;
          } else { // Assume is object
            newMsg = i+"."+isCorrect.msg;
          }
        }


        return {error: true, msg:newMsg}; break;
      }
    } else {

      // check if exist props
      if (expObj[i] == undefined) {
        //console.log(i+" but was not found");
        return {error: true, msg: i+" but was not found"}
      }

      // compare values
      if (obj[i] != expObj[i]) {
        //console.log(i+' "'+obj[i]+'" but found "'+expObj[i]+'"');
        //console.log(typeObj);
        return {error: true, msg: i+' "'+obj[i]+'" but found "'+expObj[i]+'"'}
      }

      //console.log (obj[i], i, expObj[i]);
    }
  }

  return {error: false, msg: ''};
}



/* -- Test running code:  --- */

/**
 * Runs a "assertEquals" test.
 *
 * @param {String} message The initial message to pass
 * @param {Array} assertionFailures List of messages that will be displayed on the UI for evaluation
 * @param {*} expected Expected item
 * @param {*} actual The actual item
 */
function runTest(message, assertionFailures, expected, actual) {
  try {
    assertEquals(message, expected, actual);
  } catch (failure) {
    assertionFailures.push(failure.message);
  }
}

function runAll() {

  var complexObject1 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1,
      propC: 2
    }
  };
  var complexObject1Copy = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1,
      propC: 2
    }
  };
  var complexObject2 = {
    propA: 1,
    propB: {
      propB: 1,
      propA: [1, { propA: 'a', propB: 'c' }, 3],
      propC: 2
    }
  };
  var complexObject3 = {
    propA: 1,
    propB: {
      propA: [1, { propA: 'a', propB: 'b' }, 3],
      propB: 1
    }
  };

  // Run the tests
  var assertionFailures = [];
  runTest('Test 01: ', assertionFailures, 'abc', 'abc');
  runTest('Test 02: ', assertionFailures, 'abcdef', 'abc');
  runTest('Test 03: ', assertionFailures, ['a'], {0: 'a'});
  runTest('Test 04: ', assertionFailures, ['a', 'b'], ['a', 'b', 'c']);
  runTest('Test 05: ', assertionFailures, ['a', 'b', 'c'], ['a', 'b', 'c']);
  runTest('Test 06: ', assertionFailures, complexObject1, complexObject1Copy);
  runTest('Test 07: ', assertionFailures, complexObject1, complexObject2);
  runTest('Test 08: ', assertionFailures, complexObject1, complexObject3);
  runTest('Test 09: ', assertionFailures, null, {});


  // Output the results
  var messagesEl = document.getElementById('messages');
  var newListEl;
  var i, ii;

  for (i = 0, ii = assertionFailures.length; i < ii; i++) {
    newListEl = document.createElement('li');
    newListEl.innerHTML = assertionFailures[i];
    messagesEl.appendChild(newListEl);
  }
}

runAll();
