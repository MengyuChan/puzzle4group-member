let moves = 0;
let textMoves;
let timeStamp = 0;
// let dragStart = 0;
// let dragEnd = 0;

// select the list items
let ul = document.querySelectorAll('li');;
// const letters = ["A", "B", "C", "D", "E", "F", "G", "H", ""]
// 1,   2,   3,   4,   5,    6,  7 ,  8,
// const letters= ["B", "G", "H", "A", "F", "C", "D", "E", " "]   // --0
// const letters= ["J", " ", "C", "D", "B", "A", "F", "H", "E", "N", "G", "K", "I", "M", "O", "L"] // to test task difficulty --1
// const letters= ["6", "10", "5", "2", "1", "14", "4", "11", "9", "3", "8", "12", "13", "15", "7", " "] // to test task difficulty --26 moves
const letters= ["6", "5", "2", "4", "1", "10", "3", "8", "9", "14", "7", "11", "13", "15", "12", " "] // to test task difficulty --14 moves
// const letters= ["B", "H", "C", "A", " ", "G", "D", "F", "E"]  // --2  283107465
// const goal = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", ""]
const goal = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", ""]
//  1,   2,   3,   4,   5,   6,   7,   8,   9,   10,  11,  12,  13,  14,  15
// J ''CDBAFHENGKIMOL

function setUp() {
    fillGrid(ul, letters);
    setId(ul)

    state.content = getState(ul);
    state.dimension = getDimension(state);

    // set up the droppable and draggable contents
    setDroppable(ul);
    setDraggable(ul);
    // console.log("The state dimension", state.dimension)
    // console.log("The state content", state.content)

    textMoves = document.getElementById('moves');


    // initialize log entries
    R7Insight.init({
        token: '7dbafd94-5f1a-4efc-801f-a378f8ff68b4',
        region: 'us3'
    });
    R7Insight.log("Log event");

    // generate a unique user id
    var userId = Math.floor(Math.random() * 26) + Date.now();
    console.log('user id: ', userId);
// set local storage of user id in browser
    window.localStorage.setItem("userId", userId);
// window.localStorage.setItem("userId", window.localStorage.getItem("userId"));
    console.log('user id: ', window.localStorage.getItem("userId"));
}



const state = {}
state.content = letters;


/**
 * Getters
 */
const getState = (items) => {
    const content = [];
    items.forEach((item, i) => {
        content.push(item.innerText)
    });
    return content;
}

// this function is to get the 2D positions of empty tile from the 1D index
const getEmptyCell = () => {
    const emptyCellNumber = state.emptyCellIndex + 1;
    const emptyCellRow = Math.ceil(emptyCellNumber / 4);
    const emptyCellCol = 4 - (4 * emptyCellRow - emptyCellNumber);
    // emptyCellRow holds the actual row number the empty tile falls into in a 9-cell grid
    // the array index will be one less than its value. Same goes for emptyCellCol
    return [emptyCellRow - 1, emptyCellCol - 1]
}

const getDimension = (state) => {
    let j = 0;
    let arr = [];
    const { content } = state;
    for (let i = 0; i < 4; i++) {
        arr.push(content.slice(j, j + 4));
        j += 4;
    }

    return arr;
}


/**
 * setters
 */
const setDroppable = (items) => {
    items.forEach((item, i) => {
        if (!item.innerText) {
            // this line is to store the index of the empty tile
            state.emptyCellIndex = i;
            item.setAttribute("ondrop", "drop_handler(event);");
            item.setAttribute("ondragover", "dragover_handler(event);");
            item.setAttribute("class", "empty");
        }
        return;
    })

    // get new state after dropping
    state.content = getState(ul);
    // get new dimension from the state after dropping
    state.dimension = getDimension(state);

    console.log("userId:" + window.localStorage.getItem("userId"),"The new state content:", JSON.stringify(state.content))
    R7Insight.log("userId:" + window.localStorage.getItem("userId"),"The new state content:" + JSON.stringify(state.content));

    console.log("userId:" + window.localStorage.getItem("userId"), "The new state dimension:", JSON.stringify(state.dimension))
    R7Insight.log("userId:" + window.localStorage.getItem("userId"), "The new state dimension:" + JSON.stringify(state.dimension));
}

const removeDroppable = (items) => {
    items.forEach((item) => {
        item.setAttribute("ondrop", "");
        item.setAttribute("ondragover", "");
        item.setAttribute("draggable", "false");
        item.setAttribute("ondragstart", "");
        item.setAttribute("ondragend", "");
    })

}


const setDraggable = (items) => {
    const [row, col] = getEmptyCell();

    let left, right, top, bottom = null;
    if (state.dimension[row][col - 1]) left = state.dimension[row][col - 1];
    if (state.dimension[row][col + 1]) right = state.dimension[row][col + 1];

    if (state.dimension[row - 1] != undefined) top = state.dimension[row - 1][col];
    if (state.dimension[row + 1] != undefined) bottom = state.dimension[row + 1][col];


    // make its right and left dragabble
    items.forEach(item => {
        if (item.innerText == top ||
            item.innerText == bottom ||
            item.innerText == right ||
            item.innerText == left) {
            item.setAttribute("draggable", "true");
            item.setAttribute("ondragstart", "dragstart_handler(event)");
            item.setAttribute("ondragend", "dragend_handler(event)")
        }

    })


}

// this function sets a unique id for each list item, in the form 'li0' to 'li8'
const setId = (items) => {
    for (let i = 0; i < items.length; i++) {
        items[i].setAttribute("id", `li${i}`)
    }
}

const isSolvable = (arr) => {
    let number_of_inv = 0;
    // get the number of inversions
    for (let i = 0; i < arr.length; i++) {
        // i picks the first element
        for (let j = i + 1; j < arr.length; j++) {
            // check that an element exist at index i and j, then check that element at i > at j
            if ((arr[i] && arr[j]) && arr[i] > arr[j]) number_of_inv++;
        }
    }
    // if the number of inversions is even
    // the puzzle is solvable
    return (number_of_inv % 2 == 0);
}

const isCorrect = (solution, goal) => {
    if (JSON.stringify(solution) == JSON.stringify(goal)) return true;
    return false;
}


// shuffled version - this function fill in each list item with an element from the letters array, accessing it with the index i
// const fillGrid = (items, letters) => {
//     let shuffled = shuffle(letters);
//     // console.log(shuffled);
//     // shuffle the letters array until there is a combination that is solvable
//     while (!isSolvable(shuffled)) {
//         shuffled = shuffle(letters);
//     }
//
//     items.forEach((item, i) => {
//         item.innerText = shuffled[i];
//     })
// }


// without shuffling - this function fill in each list item with an element from the letters array, accessing it with the index i -- shuffled version
const fillGrid = (items, letters) => {

    items.forEach((item, i) => {
        item.innerText = letters[i];
    })
}

// fillGrid(ul, letters);

// shuffle the array
const shuffle = (arr) => {
    const copy = [...arr];
    // console.log(copy);
    // loop over the array
    for (let i = 0; i < copy.length; i++) {
        // for each index,i pick a random index j
        let j = parseInt(Math.random() * copy.length);
        // swap elements at i and j
        let temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }
    return copy;

}


/**
 * Drag and drop handlers
 */

const dragstart_handler = ev => {
    // console.log("dragstart")
    ev.dataTransfer.setData("text/plain", ev.target.id)
    ev.dataTransfer.dropEffect = "move";
    // let dragStart = new Date();
    // console.log("dragStartTime " + dragStart);

}

const dragover_handler = ev => {
    // console.log("dragOver");
    ev.preventDefault();
}

const drop_handler = ev => {
    // console.log("drag")
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/plain");
    // console.log(document.getElementById(data).innerText)
    const lastMove = {};
    lastMove['letter'] = document.getElementById(data).innerText;
    ev.target.innerText = document.getElementById(data).innerText;

    // once dropped, unempty the cell :)
    ev.target.classList.remove("empty")
    ev.target.setAttribute("ondrop", "");
    ev.target.setAttribute("ondragover", "");

    document.getElementById(data).innerText = "";
    let index = state.content.indexOf(lastMove['letter'])
    lastMove['from'] = [Math.floor(index / 4), index % 4]
    // get new state after dropping
    state.content = getState(ul);

    index = state.content.indexOf(lastMove['letter'])
    lastMove['to'] = [Math.floor(index / 4), index % 4]
    let timeStamp = new Date();
    console.log("userId:" + window.localStorage.getItem("userId"), JSON.stringify(lastMove), "timeStamp:" + timeStamp)
    R7Insight.log("userId:" + window.localStorage.getItem("userId"), JSON.stringify(lastMove), "timeStamp:" + timeStamp);
    // get new dimension from the state after dropping
    // console.log(state.dimension)

    incrementMoves();
}

const dragend_handler = ev => {
    // console.log("dragEnd");
    // Remove all of the drag data
    ev.dataTransfer.clearData();
    // remove all droppable attributes
    removeDroppable(document.querySelectorAll('li'));

    // set new droppable and draggable attributes
    setDroppable(document.querySelectorAll('li'));
    setDraggable(document.querySelectorAll('li'))

    // let dragEnd = new Date()
    // console.log("dragEnd " + "time" + dragEnd);

    // if correct

    // new Promise(function (resolve, reject) {
    //     resolve(alert('提交成功'))
    // }).then(() => {
    //     window.location.reload();
    // })

    if (isCorrect(goal, state.content)) {

        // console.log("userId:" + window.localStorage.getItem("userId"), "Completed in " + moves + " moves.")
        R7Insight.log("userId:" + window.localStorage.getItem("userId"), "Correct! Completed in " + moves + " moves."); //"Moves:"+ moves
        alert("Congratulations! You solved the puzzle in " + moves + " moves. Please click OK to continue the study.");


        // var w = window.open("postsurvey.html", "_self");
        // setTimeout(() => { window.open("postsurvey.html", "_self"); }, 100);

    }

    // location.href="postsurvey.html";



}

/**
 * The counts of movement
 */
//this function is to compute the count of move

function incrementMoves() {
    moves++;
    if (textMoves) {     // This is necessary.
        textMoves.innerHTML = moves;
    }
}

