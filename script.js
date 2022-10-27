const rightButton = document.getElementById('right-button');
const leftButton = document.getElementById('left-button');
const midButton = document.getElementById('middle-button');
const midArea = document.getElementById('middle');
const select_counter = document.getElementById('counter');
const select_plot = document.getElementById('plot');
const select_exp = document.getElementById('exp');

leftButton.disabled = true;
rightButton.disabled = true;
let counter = 0;

let myPlot_X = [];
let myPlot_Y = [];


let currentTime = 0;
let endTime = 0;

function middleButtonClick() {
    console.log('middle button clicked');

    rightButton.style.backgroundColor= "red";
    leftButton.style.backgroundColor = 'green';
    midButton.style.backgroundColor = 'green';
    leftButton.disabled = true;
    rightButton.disabled = false;
    midButton.disabled = true;
    currentTime = Date.now();
}

function rightButtonClick() {
    console.log('Right button clicked');
    rightButton.style.backgroundColor= "green";
    leftButton.style.backgroundColor = 'red';
    leftButton.disabled = false;
    rightButton.disabled = true;

}

function generateRandomNumber() {
    return Math.floor(Math.random() * 25);
}
function generateRandomNumberForDistance() {
    return Math.floor(Math.random() * 300);
}

let myMargin = 0;
let my_m = 0;
let my_c= 0;

function leftButtonClick() {
    console.log('Left button clicked');

    let w = rightButton.offsetWidth;
    let dis = myMargin + midArea.offsetWidth / 2;

    let new_width = generateRandomNumber();
    let new_dist = generateRandomNumberForDistance();
    rightButton.style.width = new_width + '%' ;
    leftButton.style.width = new_width + '%';

    leftButton.style.marginRight = new_dist + 'px';
    rightButton.style.marginLeft = new_dist + 'px';
    myMargin = new_dist;

    rightButton.style.backgroundColor= "green";
    leftButton.style.backgroundColor = 'green';
    midButton.style.backgroundColor = 'red';

    leftButton.disabled = true;
    rightButton.disabled = true;
    midButton.disabled = false;

    endTime = Date.now();
    let timeElapsed = (endTime - currentTime) / 1000;
    let ID = Math.log2(2 * dis / w);

    myPlot_X.push(ID);
    myPlot_Y.push(timeElapsed);

    currentTime = 0;
    endTime = 0;
    if(myPlot_X.length === 20){
        select_exp.style.display = 'none';
        select_plot.style.display = "block";
        draw();
        alert("b = " + my_m + "   " + 'a = ' + my_c);
    }
    counter++;
    select_counter.textContent= 'Times clicked ' + counter + ' of 20';
}

midButton.onclick = middleButtonClick;
rightButton.onclick = rightButtonClick;
leftButton.onclick = leftButtonClick;


function draw() {

    var trace = {
        x: myPlot_X,
        y: myPlot_Y,
        mode: 'markers',
        type: 'scatter'
    };
    var trace3 = lineRegression();

    var myData = [trace, trace3];
    Plotly.newPlot('plot', myData, { annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0,
        xanchor: 'right',
        y: 1,
        yanchor: 'bottom',
        text: 'Time',
        showarrow: false
      }, {
        xref: 'paper',
        yref: 'paper',
        x: 1,
        xanchor: 'left',
        y: 0,
        yanchor: 'top',
        text: 'ID',
        showarrow: false
      }]});
}
function lineRegression(){
    let x_sum = 0;
    myPlot_X.forEach(element => {
        x_sum += element;
    });
    
    let y_sum = 0;

    myPlot_Y.forEach(element => {
        y_sum += element;
    });

    let xmulty = 0;
    for(let i = 0; i < myPlot_X.length; i++){
        xmulty += myPlot_Y[i] * myPlot_X[i];
    }    

    let x_square = 0;
    myPlot_X.forEach(element => {
        x_square += element*element;
    });

    let y_square = 0;
    myPlot_Y.forEach(element => {
        y_square += element*element;
    });

    let m = ((myPlot_X.length * xmulty) - (x_sum * y_sum))/(myPlot_X.length * x_square - x_sum*x_sum);
    let c = (x_square * y_sum - x_sum * xmulty)/(myPlot_X.length * x_square - x_sum * x_sum);
    console.log(m);
    console.log(c);
    my_m = m;
    my_c = c;
    
    let mx = Math.max(...myPlot_X);
    let mn = Math.min(...myPlot_X);
    let values_y = [];
    let values_x = [];
    for(let i = mn; i < mx+1; i+=0.25){
        values_x.push(i);
        values_y.push(m * i + c);
    }
    let trace2 = {
        x: values_x,
        y: values_y,
        mode: 'lines',
        type: 'scatter'
    };
    return trace2;
}
