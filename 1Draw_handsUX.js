// ----=  HANDS  =----
// USING THE GESTURE DETECTORS (check their values in the debug menu)
// detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"
let brushCursorImage; //variables for images
let brushImage;
let colourImage;
let borderImage;
/* load images here */
function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
  brushCursorImage = loadImage('/images/Brush_Cursor.PNG')
  brushImage = loadImage('/images/Brush.PNG')
  colourImage = loadImage('/images/Colour (1).PNG')
  borderImage = loadImage('/images/border.PNG')
}

//////////////////NOTE: TO SWITCH BETWEEN BRUSHES, OPEN PALM FOR BASIC BRUSH, PEACE FOR CIRCLE BRUSH, THUMBS UP FOR TRICOLOR BRUSH, FIST FOR SQUARE BRUSH/////////////

let px = 0;
let py = 0;
let colors = [];
let selectedColor;
let Yvalue = 0
let selectedBrush = 1 //variable for determining which brush is active


function drawInteraction(faces, hands) {
  colors = [
    color(199, 18, 69), // red 
    color(34, 18, 122), // blue 
    color(40, 110, 19), // green
    color(207, 156, 19), // orange

  ];
/////
  selectedColor = colors[int(map(Yvalue, 0, height, 0, colors.length))]

  image(borderImage, 0, 0,) //the border image
  image(brushImage, 100, 100, 200, 200) //image to display the current brush in use
  image(colourImage, 100, 220, 200, 200) // image to show current colour
  stroke(0)
  strokeWeight(7)
  fill(selectedColor)
  ellipse(260, 340, 50) // shows current colour
  
  //these show the current brush in use
  if (selectedBrush == 1){
    fill(selectedColor)
    stroke(selectedColor)
    ellipse(250, 210, 16)
  }
  if (selectedBrush == 2){
    stroke(0);//black
    fill(selectedColor)
    strokeWeight(7);
    circle(250, 210, 20)
  }
  if (selectedBrush == 3){
    strokeWeight(1)
    stroke(selectedColor)
    fill(selectedColor);
    circle(250, 210, 30);
    stroke(127);//gray
    fill(127)//gray
    circle(250, 210, 20);
    stroke(10);//black
    fill(10) //black
    circle(250, 210, 8);
  }
  if(selectedBrush == 4){
    fill(selectedColor)
    stroke(0)
    strokeWeight(8)
    square(230, 180, 50)
  }
  
  // hands part
  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    // console.log(hand);
    if (showKeypoints) {
      drawConnections(hand)
    }
    /*
    Start drawing on the hands here
    */
    if (hand.handedness === "Left") {
      Yvalue = hand.index_finger_tip.y; // this will stay as zer untill the program sees a left hand 
      let whatGesture = detectHandGesture(hand)
      if(whatGesture == "Open Palm"){ //these are the gesture controls to switch between different brushes with the left hand
        selectedBrush = 1
      }
      if(whatGesture == "Peace"){
        selectedBrush = 2
      }
      if(whatGesture == "Thumbs Up"){
        selectedBrush = 3
      }
      if(whatGesture == "Fist"){
        selectedBrush = 4
      }
    }
  


    if (hand.handedness === "Right") { // draw when pinching right hand 
      let indexFingerTipX = hand.index_finger_tip.x;
      let indexFingerTipY = hand.index_finger_tip.y;
      let thumbTipX = hand.thumb_tip.x;
      let thumbTipY = hand.thumb_tip.y;

      let x = (indexFingerTipX + thumbTipX) * 0.5; // find half way between the index and thumn
      let y = (indexFingerTipY + thumbTipY) * 0.5;

      let d = dist(indexFingerTipX, indexFingerTipY, thumbTipX, thumbTipY);

      fill(selectedColor)
      image(brushCursorImage, x - 20, y - 100, 120, 120) //image of a brush to act as a cursor and show where on canvas you are drawing

      if (d < 50) {
        if (selectedBrush == 1){
          painting.stroke(selectedColor); //this sequence of if statements is what initiates the brush switching on canvas
          painting.strokeWeight(16);
          painting.line(px, py, x, y);
        }
        //^^^basic brush^^^
        if (selectedBrush == 2){
          painting.stroke(0);
          painting.fill(selectedColor)
          painting.strokeWeight(7);
          painting.circle(x, y, 20)
        }
        //^^^circle brush^^^
        if (selectedBrush == 3){
          painting.stroke(selectedColor);
          painting.strokeWeight(30);
          painting.line(px, py, x, y);
          painting.stroke(50);//gray
          painting.strokeWeight(20);
          painting.line(px, py, x, y);
          painting.stroke(10);//black
          painting.strokeWeight(8);
          painting.line(px, py, x, y);
        }
        //^^^tricolor brush^^^
        if (selectedBrush == 4){
          painting.fill(selectedColor)
          painting.stroke(0)//black
          painting.strokeWeight(8)
          painting.square(x, y, 50)
        }
        //^^^square brush^^^
      }
      px = x;
      py = y;
    }
    /*
    Stop drawing on the hands here
    */
  }
  // You can make addtional elements here, but keep the hand drawing inside the for loop. 
  //------------------------------------------------------



}

function drawConnections(hand) {
  // Draw the skeletal connections
  push()
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop()
}

// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {
  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 10);
  }
  pop()

}