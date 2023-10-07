
/*--------------------GLOBAL VARIABLES------------------------*/
/**The container-grid is selected and an eventListener is added to it.
 * In the function buttonClicked the different events are defined and
 * an action is given depending on the element that has been clicked.
 * kPressed is the querySelector of the html element and refers to the
 * eventListener of the keys of the keyboard pressed.
 * DisplayResult and displatOperation refer to the display of the
 * calculator.
 * The arrayOfOperations stores the operations that are put so that
 * I can create a record.
 */
const kPressed = document.querySelector("html");
const btnClicked = document.querySelector("#container-grid");
const displayResult = document.querySelector(".result-bottom");
const displayOperation = document.querySelector(".operations-top"); //Call it just when you put the result.
let arrayOfOperations = []; //To store the history of our calculations

kPressed.addEventListener("keyup", buttonKeyboard);
btnClicked.addEventListener("click", buttonClicked);
/*--------------------RECEIVES AN EVENT FROM THE EVENT LISTENER TO STUDY THE INTERACTION WITH THE DOM------------------------*/
/**
 * This function calls other functions depending on the elements that has
 * been clicked.
 * @param {*} event receives the information of the element clicked
 */
function buttonClicked(event) {
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(event.target.innerText) !== -1) showNumber(event.target.innerText);
  else if (["+", "-", "x", "/", "%", "±"].indexOf(event.target.innerText) !== -1) showOperator(event.target.innerText);
  else if (event.target.innerText === "=") calculateResult();
  else if (event.target.innerText === ".") showPoint();
  else if (event.target.innerText === "C") clearDisplay();
  else if (event.target.innerText === "del") deleteChar();
  else if (event.target.innerText === "()") showParenthesis();
  else if (event.target.innerText === "CLEAR HISTORY") clearHistory();
  else if (event.target.tagName === "INPUT") changeLightning();
}
/*--------------------RECEIVES AN EVENT FROM THE EVENT LISTENER TO STUDY WHICH KEY HAS BEEN PRESSED------------------------*/
/**
 * This function calls other functions depending on the key
 * of the keyboard that has been pressed.
 * @param {*} event receives the inf of the key of the keyboard pressed
 */
function buttonKeyboard(event) {
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(event.key) !== -1) showNumber(event.key);
  else if (["+", "-", "x", "/", "%"].indexOf(event.key) !== -1) showOperator(event.key);
  else if (event.key === "Enter") calculateResult();
  else if (event.key === ".") showPoint();
  else if (event.key === "c") clearDisplay();
  else if (event.key === "Backspace") deleteChar();
  else if (event.key === "(" || event.key === ")") showParenthesis();
}


//MAKE IT WORK WITH KEYBOARD KEYSSSS
/*--------------------SHOW A NUMBER ON THE DISPLAY------------------------*/
/**
 * Studies if the number clicked can be shown
 * on the display.
 * @param {*} num number of the button clicked
 */
function showNumber(num) {

  //If the only number is a "0" I do not want more irrelevant characters
  //after a 0 there is a point, i interpret it as wanting to put a decimal
  if (num === "0" && displayResult.innerText === "") displayResult.innerText = "0.";
  //same if it is after an operator
  else if (num === "0" && checkLastCharacter(displayResult.innerText)) displayResult.innerText += "0.";
  //If the result is being displayed, then remove it and put the number
  //Otherwise, just add the number.
  else {
    if (displayResult.getAttribute("result") !== null) {
      if (num === "0") {
        displayResult.innerText = "0.";
        displayOperation.innerText = "";
        displayResult.removeAttribute("result");
      }
      else {
        displayResult.innerText = num;
        displayOperation.innerText = "";
        displayResult.removeAttribute("result");
      }
    } else {
      displayResult.innerText += num;
    }
  }
}
/*--------------------SHOW AN OPERATOR ON THE DISPLAY------------------------*/
/**
 * Studies if the operator clicked can be shown
 * on the display.
 * @param {*} operator operator of the button clicked
 */
function showOperator(operator) {

  if (operator === "±") {
    //able to change sign only if the result is not showing
    if (displayResult.getAttribute("result") === null) {

      //This array stores each element like this ["2","+","34","-","45","x","5"]
      let arrayOfNums = displayResult.innerText.split(/([^0-9.])/g);

      //I clean the array from empty strings created when two elements
      //that split are together.
      for (let i = 0; i < arrayOfNums.length; i++) {
        if (arrayOfNums[i] == "") arrayOfNums.splice(i, 1);
      }

      //If there is no parenthesis
      if (!displayResult.innerText.includes("(") && !displayResult.innerText.includes(")") && displayResult.innerText !== "0") {
        //If there are only "+" "-" operators
        if ((displayResult.innerText.includes("+") || displayResult.innerText.includes("-")) &&
          !(displayResult.innerText.includes("x") || displayResult.innerText.includes("/") || displayResult.innerText.includes("%"))) {
          //I go through the loop and study if the sign has to be changed or not.
          for (let i = 0; i < arrayOfNums.length; i++) {
            //If the "+", "-" is in the position 1 then the first number has assumed
            //"+" sign and has to be changed.
            if (i == 1 && ["+", "-"].indexOf(arrayOfNums[1]) !== -1) {
              arrayOfNums.unshift("-");
              //Otherwise, change the "+" by "-" and viceversa
            } else if (["+", "-"].indexOf(arrayOfNums[i]) !== -1) {
              if (arrayOfNums[i] === "+") arrayOfNums[i] = "-";
              else if (arrayOfNums[i] === "-") arrayOfNums[i] = "+";
            }
          }
        } else if ((displayResult.innerText.includes("x") || displayResult.innerText.includes("/") || displayResult.innerText.includes("%"))) {

          //I go through the loop and study if the sign has to be changed or not.
          for (let j = 0; j < arrayOfNums.length; j++) {
            //If the second element is "x", "/", "%", it mean there is something like this : 9x6
            //and the sign of 9 has to be changed. 9x6 -> -9x6
            if (j === 1 && ["x", "/", "%", "+", "-"].indexOf(arrayOfNums[j]) !== -1) {
              arrayOfNums.unshift("-");
              //if 6x-6, i do not want the "-" to be changed
            } else if (["x", "/", "%"].indexOf(arrayOfNums[j - 1]) !== -1 && ["+", "-"].indexOf(arrayOfNums[j]) !== -1) {
              j++; //Next one will be a number, and with j++ we avoid an unnecesary loop
            } else if (["+", "-"].indexOf(arrayOfNums[j]) !== -1) {
              if (arrayOfNums[j] === "+") arrayOfNums[j] = "-";
              else if (arrayOfNums[j] === "-") arrayOfNums[j] = "+";
            }
          }
          //If there is just a number like 2 or 23 -> -2 ,  -23
        } else if (arrayOfNums.length == 1) {
          arrayOfNums.unshift("-");
        }
        //store the result
        //I subprogrammed it so that I do not repeat it two times.
        showChange(arrayOfNums);

        //parenthesis
      } else {
        let whichParenthesis = ""; //this variable will be equal to "(" or ")"

        //Loop to store in the variable the last parenthesis
        for (let i = 0; i < displayResult.innerText.length; i++) {
          if (["(", ")"].indexOf(displayResult.innerText[i]) != -1) whichParenthesis = displayResult.innerText[i];
        }
        if (whichParenthesis == "(") {
          //Here I show the user that he has to close parenthesis to be able
          //to make the change
          showError("CLOSE PARENTHESIS");
        } else { //Here we have both parenthesis and ")" is the last one.
          let inside = false; //to differenciate when the loop is inside a ().

          for (let i = 0; i < arrayOfNums.length; i++) {
            //When it is inside I do not change its sign.
            //It is only necessary to change it correctly outside.
            if (i > 0 && arrayOfNums[i - 1] === "(") inside = true;
            else if (i > 0 && arrayOfNums[i - 1] === ")") inside = false;

            //if it is not inside
            if (!inside) {
              //If it is here, then its sign can be changed and is not inside
              //a parenthesis
              //If first element is a parenthesis, change its sign to "-" (5-4) -> -(5-4)
              //We want to avoid an unnecessary loop since the array's length has increased
              //If the first element is a number add a "-" in front
              //9(2-3) -> -9(2-3)
              if (i === 0 && (["x", "/", "%", "+", "-"].indexOf(arrayOfNums[i]) === -1)) {
                arrayOfNums.unshift("-");
                i++;
                //If there is a "x", "/", "%" next to "+", "-", do not change the last ones
              } else if (["x", "/", "%"].indexOf(arrayOfNums[i - 1]) !== -1 && ["+", "-"].indexOf(arrayOfNums[i]) !== -1) {
                i++; //avoid an unnecesary loop

                //Last case if there is a simple "+","-" outside the parenthesis
              } else if (["+", "-"].indexOf(arrayOfNums[i]) !== -1) {
                if (arrayOfNums[i] === "+") arrayOfNums[i] = "-";
                else if (arrayOfNums[i] === "-") arrayOfNums[i] = "+";
              }
            }
          }
          //store the result
          showChange(arrayOfNums);
        }
      }
    } else { //If the result is showing, it can not change its sign
      //Here I show the user that he can not change the result's sign
      showError("CAN NOT CHANGE SIGN TO THE RESULT");
    }
  }
  //If the operator is not "±"
  else if ([".", "+", "-"].indexOf(displayResult.innerText[displayResult.innerText.length - 1]) === -1) {
    if ((operator === "+" || operator === "-")) {
      //See if we have a number previously. If true, show operator
      displayResult.innerText += operator;

      //If the operator is "x", "/", "%", check that there isn't any operator before,
      //there is some element at least
    } else if (displayResult.innerText.length > 0 &&
      (["/", "x", "%", "("].indexOf(displayResult.innerText[displayResult.innerText.length - 1]) === -1)) {
      displayResult.innerText += operator;
    }
    //Is the result attribute exists, remove it so that we can operate normally.

    if (displayResult.getAttribute("result") !== null) {
      displayResult.removeAttribute("result");
      displayOperation.innerText = "";
    }
  }
}
/*--------------------SHOW HOW THE CHANGE OF SIGN HAS BEEN MADE DISPLAY------------------------*/
/**
 * Shows how the sign change has been made.
 * It is made in an array. This function converts the
 * array in a string concatenating its elements.
 * @param {*} arrayChanged array of elements of 
 * operation changed
 * It is called by other functions.
 */
function showChange(arrayChanged) {
  displayResult.innerText = "";
  for (let k = 0; k < arrayChanged.length; k++) {
    displayResult.innerText += arrayChanged[k];
  }
}
/*--------------------SHOW THE RESULT OF AN OPERATION------------------------*/
/**
 * Function called when the equal button is clicked
 * or when the enter key is pressed.
 * It gives as the result of an operation
 * if it can be given depending on the circumstance, since 
 * it should be a valid operation.
 * Not valid-> 2+
 * Valid-> -2x-3%(25.5/3)
 */
function calculateResult() {
  //If there is not already showing, the last char is not an operator or "(" and it has one operator at least it is true.
  if (displayResult.getAttribute("result") === null && ["+", "-", "x", "/", "%", ".", "("].indexOf(displayResult.innerText[displayResult.innerText.length - 1]) === -1
    && hasOperator()) {
    //I study first if it does not include parenthesis
    //since it is a lot easier and I do not want the code to go through
    //unnecessary loops
    if (!displayResult.innerText.includes("(") && !displayResult.innerText.includes(")")) {
      showResult(displayResult.innerText);
    } else {

      //Check that the last parenthesis is ")"
      let whichParenthesis = "";
      //This array stores each element like this ["2","+","34","-","45","x","5"]
      let arrayOfNumsP = displayResult.innerText.split(/([^0-9.])/g);

      //I clean the array from empty strings created when two elements
      //that split are together.
      for (let i = 0; i < arrayOfNumsP.length; i++) {
        if (arrayOfNumsP[i] == "") arrayOfNumsP.splice(i, 1);
        if (["(", ")"].indexOf(arrayOfNumsP[i]) !== -1) whichParenthesis = arrayOfNumsP[i];
      }
      //If the last one is ")", it means that it is properly closed
      //and it is possible to make oeprations with the combination given
      if (whichParenthesis === ")") {

        let inside = false; //indicates if the loop is inside or outside the "()"
        let opInParenthesis = []; //stores elements of operations inside a parenthesis
        let resultParenthesis; //stores result of the value inside the "()"
        let startParenthesis; //stores the value of the index of the starting position of the "("

        //Loop to go through the elements of the elements
        for (let j = 0; j < arrayOfNumsP.length; j++) {
          //If the previous element is a "(", then the loop is inside the "()"
          if (j > 0 && arrayOfNumsP[j - 1] === "(") {
            inside = true;
            startParenthesis = j - 1; //Store index of start of the "()"
          }

          //If the loop is inside the parenthesis, store its elements
          //operate and store its result and replace the parenthesis
          //with the actual value of the parenthesis
          if (inside) {
            //While the element of the array is !== ")"
            if (!(arrayOfNumsP[j] === ")")) {
              //Store the operation inside the parenthesis
              opInParenthesis.push(arrayOfNumsP[j]);
              //If it is ")", it means the it is going to go out of the "()"
              //and the parenthesis's content needs to be calculated so that
              //it can replace the parenthesis

            } else {
              inside = false; //Now the element is ")" and is outside the ()

              //Store the result of the operations inside the "()"
              //in a string so that I can send it to the calculate function to get the result
              let opInParenthesisString = "";
              for (let k = 0; k < opInParenthesis.length; k++) {
                opInParenthesisString += opInParenthesis[k];
              }

              resultParenthesis = calculate(opInParenthesisString);

              //If the "(" is position 0 or before I have "x", "/", "%", which does not change nothing,
              //just remove the parenthesis and add the result.
              //No undefined since if the first is true, the second one is not evaluated
              if (startParenthesis === 0 || ["x", "/", "%", "+", "-"].indexOf(arrayOfNumsP[startParenthesis - 1]) !== -1) {
                //If the operator before is a "+" or "-" and the operation inside is negative, I have to 
                //study this because I can not have two operators together.
                //Example: 9+(3-5) -> 9+-2; In this case "+" plus "-" equals a "-" -> 9-2
                // if we have 9-(3-5) -> 9--2; In this case "-" plus "-" equals a "+"--> 9+2
                if (["+", "-"].indexOf(arrayOfNumsP[startParenthesis - 1]) !== -1 && resultParenthesis < 0) {
                  if (arrayOfNumsP[startParenthesis - 1] === "+") {
                    arrayOfNumsP.splice(startParenthesis - 1, opInParenthesis.length + 3, resultParenthesis.toString());
                    startParenthesis -= 1;
                    j = startParenthesis; //change iterable variable since after splicing the array
                    // its length has changed and the j should as well

                  } else {
                    let resultInserted = "+" + (resultParenthesis * (-1)).toString();
                    arrayOfNumsP.splice(startParenthesis - 1, opInParenthesis.length + 3, resultInserted);
                    startParenthesis -= 1;
                    j = startParenthesis;

                  }
                  //If it is at the starting position or an operator is before. If it is "+" or "-" it has to be > 0
                } else {
                  arrayOfNumsP.splice(startParenthesis, opInParenthesis.length + 2, resultParenthesis.toString());
                  j = startParenthesis;
                }
                //If the element before is a number, add a "x" between them
              } else if (["x", "/", "%", "+", "-"].indexOf(arrayOfNumsP[startParenthesis - 1]) === -1) {

                let resultInserted = "x" + resultParenthesis.toString();

                arrayOfNumsP.splice(startParenthesis, opInParenthesis.length + 2, resultInserted);
                j = startParenthesis;

              }
              //If the next element is a number, add a "x" between them
              if (j !== arrayOfNumsP.length - 1 && ["x", "/", "%", "+", "-", "("].indexOf(arrayOfNumsP[j + 1]) === -1) {
                arrayOfNumsP.splice(j + 1, 0, "x");
              }
              opInParenthesis = []; //clean the variable that stores the "()" operation so that it can evaluate other operations
            }
          }

        }
        //Put the final operations cleaned, without parenthesis, into a string.
        let simplifiedOp = "";
        for (let k = 0; k < arrayOfNumsP.length; k++) {
          simplifiedOp += arrayOfNumsP[k];
        }
        //Show result function to show it in the display
        showResult(simplifiedOp);

      } else {
        //Show error to close parenthesis
        showError("CLOSE PARENTHESIS");
      }
    }//If the operation is not valid.
    //Example: 2+3-
  } else showError("NOT A MATHEMATICAL OPERATION");
}
/*--------------------SHOW THE RESULT OF THE OPERATION------------------------*/
/**
 * This function studies if the result can be shown complete
 * or if it has decimals, see if it needs to be rounded or not.
 * @param {*} operation 
 */
function showResult(operation) {
  //Show the operation at the top of the display
  displayOperation.innerText = displayResult.innerText;
  //save the result on a variable
  let resultP = calculate(operation);
  //If the number has no decimals, show it
  if (!resultP.toString().includes(".")) displayResult.innerText = resultP;
  //if it has more than 4 decimals, round the deciamls to have 4 maximum
  else {
    let arrayOfNumParts = resultP.toString().split(".");
    if (arrayOfNumParts[1].length > 4) displayResult.innerText = roundDecimals(resultP);
    else displayResult.innerText = resultP;
  }
  //Set the attribute result as displayed
  displayResult.setAttribute("result", "displayed");
  //save the operation and the result to the global array that stores it
  //and show it on the page with the function addOperation()
  arrayOfOperations.push([displayOperation.innerText, displayResult.innerText]);
  addOperation();
}
/*--------------------SHOW AN ERROR ON THE TOP OF THE DISPLAY------------------------*/
/**
 * This functions shows an error on the top of the display
 * for 1800 miliseconds.
 * @param {*} error Text that will be shown as an error
 */
function showError(error) {
  //Only show the error if it is not showing.
  if (document.querySelector(".show-error") === null) {
    let showErrorP = setTimeout(function () {
      let errorShowed = `<p class='show-error'>${error}</p>`;
      displayOperation.insertAdjacentHTML("beforeend", errorShowed);
    }, 100);

    setTimeout(function () {
      let errorP = document.querySelector(".show-error");
      if (errorP !== null) errorP.remove();
      clearTimeout(showErrorP);
    }, 2000);
  }
}



/*--------------------DESCRIBES WHEN THE POINT FOR DECIMALS CAN BE SHOWN------------------------*/
/**
 * Does not return nothing.
 * Does not receive nothing.
 * This function is called
 * when the putton "." is pressed
 * and studies whether it
 * can be shown or not.
 */
function showPoint() {
  //check that the display is not empty.
  //If it is not empty and the last character is not a ".", an operator or a parenthesis it is true.
  if (displayResult.innerText.length > 0 && ["+", "-", "x", "/", "%", "(", ")", "."].indexOf(displayResult.innerText[displayResult.innerText.length - 1]) === -1) {
    let operationSplitted = displayResult.innerText.split(/[^0-9.]/g); //split the display text by the operators
    //If the length is 1 that means that there is no operator and if it
    //does not include a "." already it adds it.
    //If the length is > 1, it takes the last number (last element of the array)
    //if it does not include a ".", it adds it.
    if (operationSplitted.length > 1) {
      if (!operationSplitted[operationSplitted.length - 1].includes("."))
        displayResult.innerText += ".";
    } else {
      if (!displayResult.innerText.includes(".")) {
        displayResult.innerText += ".";
      }
    }
    //If the attribute result exists, it means the result is showing.
    // We will put the "." if the result does not have a "." already,
    //and it will remove the "result" attribute
    if (displayResult.getAttribute("result") !== null) {
      displayResult.removeAttribute("result");
      displayOperation.innerText = "";
    }
  }
}
/*--------------------CLEARS THE DISPLAY------------------------*/
/**
 * Does not return nothing.
 * Does not receive nothing.
 * This function clears the display
 * making it equal to an empty string.
 * It is called when th button C is pressed
 */
function clearDisplay() {// COMPLETE
  if (displayResult.getAttribute("result") !== null) displayResult.removeAttribute("result");
  displayResult.innerText = "";
  displayOperation.innerText = "";
}
/*--------------------DELETES LAST CHARACTER------------------------*/
/**
 * Does not return or receive nothing.
 * This function deletes the last
 * character of the display is there is any.
 * It is activated when the button del is pressed.
 */
function deleteChar() {//COMPLETE
  //If the last characters are "0.", the remove "0." since I do not want irrelevant 0
  if (displayResult.innerText[displayResult.innerText.length - 1] === "." &&
    displayResult.innerText[displayResult.innerText.length - 2] === "0") {
    displayResult.innerText = displayResult.innerText.substring(0, displayResult.innerText.length - 1);
  } //If the result is showing, delete everything. Otherwise, remove last character
  if (displayResult.getAttribute("result") !== null) {
    displayResult.innerText = "";
    displayOperation.innerText = "";
    displayResult.removeAttribute("result");
  } else {
    if (displayResult.innerText.length > 0) {
      displayResult.innerText = displayResult.innerText.substring(0, displayResult.innerText.length - 1);
    }
  }
}
/*--------------------DESCRIBES WHEN THE PARENTHESIS CAN BE SHOWN------------------------*/
/**
 * Does not return or receive nothing.
 * This function is called when the button ()
 * is pressed and it studies if the
 * parenthesis can be shown in the display.
 */
function showParenthesis() {//COMPLETE
  //If it does not include a "(" and the last char is not a ".", then show a "("
  if (!displayResult.innerText.includes("(") && displayResult.innerText[displayResult.innerText.length - 1] !== ".") {
    displayResult.innerText += "(";
    //If the result is being displayed and a "(" is added, remove the "result" attribute.
    if (displayResult.getAttribute("result") !== null) {
      displayResult.removeAttribute("result");
      displayOperation.innerText = "";
    }
    //If it includes a "(", does not include a ")" and the las char is not an operator a "." or a "(" it is true
  } else if (displayResult.innerText.includes("(") && !displayResult.innerText.includes(")") &&
    ["+", "-", "x", "/", "%", ".", "("].indexOf(displayResult.innerText[displayResult.innerText.length - 1]) === -1) {
    displayResult.innerText += ")";
    //If it includes both parenthesis it is true. Inside analys¡ses different circumstances
  } else if (displayResult.innerText.includes("(") && displayResult.innerText.includes(")")) {
    let whichParenthesis = ""; //this variable will be equal to "(" or ")"
    //Loop to store in the variable the last parenthesis
    for (let i = 0; i < displayResult.innerText.length; i++) {
      if (["(", ")"].indexOf(displayResult.innerText[i]) != -1) whichParenthesis = displayResult.innerText[i];
    }
    //If last parenthesis is "(" and the last char is not of the selected then add ")"
    if (whichParenthesis === "(" && ["+", "-", "x", "/", "%", ".", "("].indexOf(displayResult.innerText[displayResult.innerText.length - 1]) === -1) {
      displayResult.innerText += ")";
    }
    //If last parenthesis is ")" and the last char is not a "." then add "("
    else if (whichParenthesis === ")" && displayResult.innerText[displayResult.innerText.length - 1] !== ".") {
      displayResult.innerText += "(";
    }
  }
}
/*--------------------CLEAR HISTORY OF OPERATION------------------------*/
/**
 * This function does not return or receive nothing.
 * It is called when the button CLEAR HISTORY
 * is pressed and it clears the array that
 * stores it.
 */
function clearHistory() {//COMPLETE
  arrayOfOperations = []; //make the global variable empty
  //Hide the clear history button
  document.querySelector(".btn-clear-history").style.visibility = "hidden";
  //Call the addOperation() function so that it can be removed from the screen
  addOperation();
}
/*--------------------TO CHECK IF STRING HAS AN OPERATOR------------------------*/
/**
 * If it does not receive anything, it takes
 * as default the text of the display.
 * @param {*} str the operation displayed
 * @returns true if an operator is in the string
 */
function hasOperator(str = displayResult.innerText) {
  if (str.includes("+")) return true;
  else if (str.includes("-")) return true;
  else if (str.includes("x")) return true;
  else if (str.includes("/")) return true;
  else if (str.includes("%")) return true;
  else return false;
}

/*--------------------TO CHECK IF THE LAST CHAR IS AN OPERATOR------------------------*/
/**If it does not receive anything,
 * it takes the text of the display.
 * It is called by other functions that
 * need to make this comprobation.
 * If the last character is an operator
 * the function returns true.
 * Otherwise, returns false.
 */
function checkLastCharacter(str = displayResult.innerText) {
  //COMPLETE
  const arrayOfOperator = ["+", "-", "x", "/", "%", "±"];
  if (arrayOfOperator.indexOf(str[str.length - 1]) !== -1) return true;
  else return false;
}
/*--------------------MAKE OPERATIONS------------------------*/
/**
 * Makes a mathematical operation
 * @param {*} strOperation this parameter is a
 * string with an operation like: "2+34-45*5"
 * This function will make this operation and
 * it takes into account the hierarchy of
 * operations between different operators.
 * PRE: parenthesis are NOT taken into account
 * @return result of the operation
 */

function calculate(strOperation) {
  //This array stores each element like this ["2","+","34","-","45","x","5"]
  let arrayOfElements = strOperation.split(/([^0-9.])/g);
  //clean array from spaces created when a split char is at the first position
  //or when two split char are next to each other
  //Example: "-20/+2" -> ["","-","20","/","","+","2"]
  for (let i = 0; i < arrayOfElements.length; i++) {
    if (arrayOfElements[i] == "") arrayOfElements.splice(i, 1);
  }
  //Change numbers from string type to float so that it is possible to operate with them
  for (let elem in arrayOfElements) {
    if (checkLastCharacter(arrayOfElements[elem]) !== true) {
      arrayOfElements[elem] = parseFloat(arrayOfElements[elem]);
    }
  }

  if ((arrayOfElements[0] === "-" || arrayOfElements[0] === "+")) {
    if (arrayOfElements[0] === "-") arrayOfElements.splice(0, 2, arrayOfElements[1] * -1);
    else arrayOfElements.splice(0, 1);
  }
  if (arrayOfElements.length === 1) return arrayOfElements[0];

  let result = 0; //variable to return
  //First we go through the multiplication, division and modular operations since they have
  //a preference. Betwen them, the one that is before has preference.
  if (arrayOfElements.includes("x") || arrayOfElements.includes("/") || arrayOfElements.includes("%")) {
    //This loop allows us to do operations such as -20/-2 or 20*+2
    //It checks if there is a "+" or "-" after a "x", "/" or "%"
    //If there is, it means that it has to be appended to the next number
    //Example: "-20/+2" -> [-20,"/","-",2]. We need to make it [-20,"/",-2]
    for (let k = 1; k < arrayOfElements.length - 1; k++) {
      if (["+", "-"].indexOf(arrayOfElements[k]) !== -1 && ["x", "/", "%"].indexOf(arrayOfElements[k - 1]) !== -1) {

        //If it is a "+", just remove it
        if (arrayOfElements[k] === "+") arrayOfElements.splice(k, 1);
        //If it is "-", multiply next number by (-1)
        else if (arrayOfElements[k] === "-") arrayOfElements.splice(k, 2, arrayOfElements[k + 1] * -1);

      }
    }


    let i = 0;
    //Loop to go trough all elements
    while (i < arrayOfElements.length) {
      switch (arrayOfElements[i]) { //element of the arrayOfElements array

        case "x": //if the element is "x", multiply the number before and after
          result = arrayOfElements[i - 1] * arrayOfElements[i + 1];
          //Replace both numbers and operator by the result.
          arrayOfElements.splice(i - 1, 3, result);
          //The array's length has changed (-2), so we keep the position after the result, next operator if exists
          i = i;
          break;

        case "/": //if the element is "/", divide the number before and after
          result = arrayOfElements[i - 1] / arrayOfElements[i + 1];
          arrayOfElements.splice(i - 1, 3, result);
          i = i;
          break;

        case "%": //if the element is "x", modular division between the number before and after
          result = arrayOfElements[i - 1] % arrayOfElements[i + 1];
          arrayOfElements.splice(i - 1, 3, result);
          i = i;
          break;

        default: i++;
      }
    }
  }

  //Now we analyse the operators with the least preference.
  //If they have any it enters. The algorithm is the same as the switch before.
  if (arrayOfElements.includes("+") || arrayOfElements.includes("-")) {
    let j = 0;
    while (j < arrayOfElements.length) {
      switch (arrayOfElements[j]) {
        case "+":
          result = arrayOfElements[j - 1] + arrayOfElements[j + 1];
          arrayOfElements.splice(j - 1, 3, result);
          j = j;
          break;

        case "-":
          result = arrayOfElements[j - 1] - arrayOfElements[j + 1];
          arrayOfElements.splice(j - 1, 3, result);
          j = j;
          break;

        default: j++;
      }
    }
  }
  if (result === - 0) result = 0;
  return result;
}
//console.log(calculate("+3-2"));
//console.log(calculate("-20x+2-10x-3"));
//console.log(calculate("21%18"));
/*--------------------ROUND DECIMALS------------------------*/
/**
 * @param {*} num with more than 4 decimals
 * @return num rounded to 4 decimals
 */
function roundDecimals(num) {//COMPLETE
  num *= 10 ** 4;
  num = Math.round(num);
  num /= 10 ** 4;
  return num;
}
//console.log(roundDecimals("12.34567890"));
/*--------------------TO SHOW CALCULATIONS RECORD------------------------*/
/**
 * Adds an operation to the history of calculations
 * and shows it ot removes it from the screen
 */
function addOperation() {
  let operations = document.querySelectorAll(".addedOp"); //NodeList of operations
  //selection of the element before the added paragraphs so that we can add them right after
  const recordText = document.querySelector(".record-title");
  //If there are operations, study how to show them
  //Otherwise, it means that clearHistory button has been pressed and thr operations
  //will be removed
  if (arrayOfOperations.length > 0) {
    //Show button clear history
    const btnHistory = document.querySelector(".btn-clear-history");
    btnHistory.style.visibility = "visible"; //make it visible

    let opInserted = `<p class = "addedOp">${displayOperation.innerText} = ${displayResult.innerText}</p>`;
    //If it is large, put it in two different lines.
    if (opInserted.length > 47) {
      opInserted = `<p class = "addedOp">${displayOperation.innerText} = <br> ${displayResult.innerText}</p>`;
    }
    //If the number of operation is > 6, then remove last one
    //and add new one above and remove last one.
    //Otherwise, just add one add the beginning
    if (arrayOfOperations.length > 6) {

      recordText.insertAdjacentHTML("afterend", opInserted);
      operations[operations.length - 1].remove();
    } else {
      recordText.insertAdjacentHTML("afterend", opInserted);
    }

  } else {
    //if the array's length is 0, remove the elements from the screen and html
    for (let i = 0; i < operations.length; i++) {
      operations[i].remove();
    }
  }
}
/*--------------------CHANGES FROM LIGHT-MODE TO DARK-MODE------------------------*/
/**
 * This function does not return or receive nothing.
 * It is called when the switch button is pressed
 * and changes from light mode to dark mode.
 */
function changeLightning() {//COMPLETE
  const colorFondo = document.querySelector("html");
  colorFondo.classList.toggle("dark-mode");
}

/*--------------------TO SHOW CURRENT TIME AND DATE ON THE RIGHT OF THE WEBSITE------------------------*/
/**
 * This function does not return or receive nothing.
 * It is called automatically to run when the
 * page loads.
 * It shows the current time on the page.
 */
function clock() {
  const showTime = document.querySelector(".current-time");
  //Repeat each second so that it keeps the hour constantly updated
  setInterval(function () {
    let time = new Date();
    showTime.innerHTML = `<p>${time.toLocaleTimeString("es-ES", { hour12: false, })}</p>`;
  }, 1000);
}
clock();

/**
 * This function does not return or receive nothing.
 * It is called automatically to run when the
 * page loads.
 * It shows the current date on the page.
 */
function date() {
  const showDate = document.querySelector(".date-today");
  //I created an array of the months and the weekdays being Sunday the position 0
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
  const dayofWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

  let today = new Date();
  let day = today.getDay();   //number of the day of the week
  let dayNumber = today.getDate(); //number of the day of the month
  let month = today.getMonth();  //get the number of the month
  let year = today.getFullYear(); //get the year
  showDate.innerHTML = `<p>${dayofWeek[day]}, ${dayNumber} ${months[month]} ${year}</p>`;
}
date();
