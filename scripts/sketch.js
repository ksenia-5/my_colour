//create canvas variable
var cnv;

//variables to load image array
var images = [];
var imageIndex = 0;
var maxImages = 13;

//update image on mouse press
var newImageBool = true;
var source;

//aspect ratio of image
let asp;   

//pixelation and alpha values to map
var pixelSizeMin = 1;          //pixellate function - min pixel size
var pixelSizeMax = 80;          //pixellate function - max pixel size
var alphaMin = 0;
var alphaMax = 255;
var cR;
var cG;
var cB; 
var locP;

//pixel sorting 
var r_temp;
var g_temp; 
var b_temp;

function preload() {
    for (var i = 0; i < maxImages; i++){
        var imageName = "../scripts/data/cd" + nf(i,3) + ".jpg";
        images[i] = loadImage(imageName);
    }
}


function setup() {
    pixelDensity(1);
    source = images[imageIndex];
    asp = source.height/source.width;
    cnv = createCanvas(source.width,source.height); 
    cnv.style = 'display','block';
    cnv.parent('interact-box'); // move canvas inside HTML element with the same id
    colorMode(RGB,255,255,255,255);
    noStroke();
    background(150);
}


function windowResized() {
    //Calculate aspect ratio of image for canvas creation and resizing
    asp = source.height/source.width;
    cnv = resizeCanvas(int(0.86*windowWidth),int(0.86*windowWidth*asp));
    cnv.parent('interact-box');
}

function centerCanvas() {
    var x = (windowWidth - width) /2;
    var y = (windowHeight - height) /2
    cnv.position(x,y);
    
}
function draw() {

    // if new image is being loaded, write image to source
    if (newImageBool) {
        //update image to display
        source = images[imageIndex];
        asp = source.height/ source.width;
        //indicate that the image has been processed
        newImageBool = false;
    }
    
    source.loadPixels();
    
    //sort horizontally on even numbered frames
    if (frameCount%2==0) {
        for (var x = 0; x < source.width - 1; x++) {
            for (var y = 0; y < source.height; y++ ) {
          
                // Calculate the 1D location of pixel from a 2D grid, 4 values for each pixel
                let loc = (x + y*source.width)*4;
        
                // compare pixel value to neighbour's value
                if (source.pixels[loc] > source.pixels[loc+4]){
                  //save neighbour's value before the swap
                  r_temp = source.pixels[loc + 4 + 0];
                  g_temp = source.pixels[loc + 4 + 1];
                  b_temp = source.pixels[loc + 4 + 2];

                  //overwrite neighbour's pixel value with current pixel value
                  source.pixels[loc + 4 + 0] = source.pixels[loc + 0];
                  source.pixels[loc + 4 + 1] = source.pixels[loc + 1];
                  source.pixels[loc + 4 + 2] = source.pixels[loc + 2];
                  source.pixels[loc + 0] = r_temp;
                  source.pixels[loc + 1] = g_temp;
                  source.pixels[loc + 2] = b_temp;
                }
            }
        }
    }
    
    //pixelate image on display without altering source pixels
     if (frameCount%20==0) { //only render image every 20th frame to improve efficiency
         var pixelSize = int(map(abs(mouseY),0,windowHeight,pixelSizeMin,pixelSizeMax));
         var alpha = int(map(abs(mouseX),0,windowWidth, alphaMin, alphaMax));
        
        for (var i = 0; i < source.width-pixelSize; i+= pixelSize) {
            for (var j =0; j< source.height - pixelSize; j += pixelSize) {
                let pixelColour = source.get(i,j);
                fill(red(pixelColour),green(pixelColour),blue(pixelColour), alpha);
                //fill(pixelColour);
                rect(i,j,pixelSize,pixelSize);
            }
        }  
    } 

    else if  (frameCount%2==1){ // on odd frames sort vertically
        
        for (let x = 0; x < source.width; x++) {
            for (let y = 0; y < source.height-1; y++ ) {
          
                // Calculate the 1D location of pixel from a 2D grid
                let loc = (x + y*source.width)*4;
               
                if ((source.pixels[loc + 0] + source.pixels[loc + 1]+source.pixels[loc + 2]) < (source.pixels[loc + source.width*4 + 0] + source.pixels[loc + source.width*4 + 1] + source.pixels[loc + source.width*4 + 2])) {
                          r_temp = source.pixels[loc + source.width*4 + 0];
                          g_temp = source.pixels[loc + source.width*4 + 1];
                          b_temp = source.pixels[loc + source.width*4 + 2];

                          //overwrite neighbour's pixel value with current pixel value
                          source.pixels[loc + source.width*4 + 0] = source.pixels[loc + 0];
                          source.pixels[loc + source.width*4 + 1] = source.pixels[loc + 1];
                          source.pixels[loc + source.width*4 + 2] = source.pixels[loc + 2];
                          source.pixels[loc + 0] = r_temp;
                          source.pixels[loc + 1] = g_temp;
                          source.pixels[loc + 2] = b_temp;
                }  
            }
        }
    }
    source.updatePixels();
}

function mousePressed() { //load new image on mouse press
    var previousImageIndex = imageIndex;;     //to keep track of index
    imageIndex = int(random(maxImages)); //assign randomly new index from array
    while (previousImageIndex == imageIndex) {
        imageIndex = int(random(maxImages));
    }
    newImageBool= true;
}