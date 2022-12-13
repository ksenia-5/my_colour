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
var pixelSizeMin = 1;          //pixellate function - max pixel size
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
    //Calculate aspect ratio of image for canvas creation
    source = images[imageIndex];
    asp = source.height/source.width;
    //cnv = createCanvas(int(0.86*windowWidth),int(0.86*windowWidth*asp)); 
    cnv = createCanvas(source.width,source.height); 
    cnv.style = 'display','block';
    //p5.Element.parent() to move canvas inside HTML element with the same id
    cnv.parent('interact-box');
    colorMode(RGB,255,255,255,255);
    //pixelDensity(1);
    //frameRate(10);
    noStroke();
    background(150);
    
}


function windowResized() {
    //Calculate aspect ratio of image for canvas creation
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
  // put drawing code here
    
    // if new image, write image to source
    if (newImageBool) {
        //update image to display
        source = images[imageIndex];
        asp = source.height/ source.width;
        
        //indicate that the image has been processed
        newImageBool = false;
        //!!! will need to comment out later when pixel sorting is working
        //image(source,0,0,width,width*asp);
        
    }
    
    source.loadPixels();
    
    //sort horizontally on even numbered frames
    if (frameCount%2==0) {
        for (var x = 0; x < source.width - 1; x++) {
            for (var y = 0; y < source.height; y++ ) {
          
                // Calculate the 1D location of pixel from a 2D grid
                let loc = (x + y*source.width)*4;
                // Get the R,G,B values from image
                //let r,g,b;
        
        
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
     if (frameCount%20==0) {
         //image(source,0,0,int(0.86*windowWidth),int(0.86*windowWidth/asp));
         //loadPixels();
         //let pixelSize = 30;
         //mouse position above canvas is read as negative numbers and breaks the code
         //maybe use constrain() instead
         var pixelSize = int(map(abs(mouseY),0,windowHeight,pixelSizeMin,pixelSizeMax));
         var alpha = int(map(abs(mouseX),0,windowWidth, alphaMin, alphaMax));
        
        for (var i = 0; i < source.width-pixelSize; i+= pixelSize) {
            for (var j =0; j< source.height - pixelSize; j += pixelSize) {
                //let offset = (i + j*source.width)*4;
                //let pixelColour = color(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
                let pixelColour = source.get(i,j);
                fill(red(pixelColour),green(pixelColour),blue(pixelColour), alpha);
                //fill(pixelColour);
                rect(i,j,pixelSize,pixelSize);
            }
        }  
    } 
    else if  (frameCount%2==1){
        
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

function mousePressed() {
    var previousImageIndex = imageIndex;;     //to keep track of indexx
    imageIndex = int(random(maxImages)); //assign randomly new index from array
    while (previousImageIndex == imageIndex) {
        imageIndex = int(random(maxImages));
    }
    newImageBool= true;
}

/*

// to sort by colour specified as R, G, B
//var sortByColour = "red"


var r_temp;
var g_temp; 
var b_temp;







    
    source.loadPixels();
    
    
    //sort horizontally on even numbered frames
    if (frameCount%2==0) {
        for (var x = 0; x < source.width - 1; x++) {
            for (var y = 0; y < source.height; y++ ) {
          
                // Calculate the 1D location of pixel from a 2D grid
                let loc = (x + y*source.width)*4;
                // Get the R,G,B values from image
                //let r,g,b;
        
        
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
    } else if  (frameCount%2==1){
        
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

                
            
                
                var c2 = color(source.pixels[loc + source.width + 0],source.pixels[loc + source.width + 1],source.pixels[loc + source.width + 2]);
                var c1 = color(source.pixels[loc + 0],source.pixels[loc + 1],source.pixels[loc + 2]);
                // compare pixel value to neighbour's value
                if (brightness(c1) < brightness(c2)){
                  //save neighbour's value before the swap
                  source.pixels[loc + source.width + 0] = red(c1);
                  source.pixels[loc + source.width + 1] = green(c1);
                  source.pixels[loc + source.width + 2] = blue (c1);

                  //overwrite neighbour's pixel value with current pixel value
                  source.pixels[loc + 0] = red(c2);
                  source.pixels[loc + 1] = green(c2);
                  source.pixels[loc + 2] = blue(c2);
                }
                
          
  
    
    //pixelate and display every 10-20 frames to display, comment out line 55
    if (frameCount%20==0) {
        var pixelSize = int(map(mouseY,0,windowHeight,pixelSizeMin,pixelSizeMax));
        //var pixelSize = 25;
        
        for (var p = 0; p < source.width - pixelSize; p += pixelSize) {
            for (var q = 0; q < source.height - pixelSize; q += pixelSize) {
                var locP = (p + q*windowWidth);
                
                let cR = source.pixels[locP*4 + 0];
                let cG = source.pixels[locP*4 + 1];
                let cB = source.pixels[locP*4 + 2]; 
                fill(cR, cG, cB, int(map(mouseX,0, windowWidth,alphaMin,alphaMax)));
                rect(p,q,pixelSize,pixelSize);
            }
        }
        //image(source,0,0,width,width*asp);
    }

    source.updatePixels();
    
    
        
  
 
    source.loadPixels();
    
    //display pixels every other frame (to increase processing speed)
    if (frmaeCount%2==0) {
        for (var i = 0; i < source.width-1; i++) {
            for (var j = 0; j < source.height; j++) {
                var loc = i + j*source.width;
                
                //Get RGB values of pixel queried
                var c1 = color(source.pixels[loc]);
                
                //Get RGB values of pixel neighbour
                var c2 = color(source.pixels[loc+1]);
                
                // Image Processing goes here
                
                //if true swap pixel with neighbour
                //here based on hue
                if (hue(c1) < hue(c2)) {
                    source.pixels[loc+1] = c1;
                    source.pixels[loc] = c2;
                } else {}   
            }
        }
    } else {
        //on odd numbered pixels, compare pixels vertically
        for(var i = 0; i < source.width; i++) {
            for (var j = 0; j < source.height-1; j++) {
                var loc = i + j*source.width;
                
                //Get RGB values of pixel queried
                var c1 = color(source.pixels[loc]);
                //Get RGB values of pixel's vertical neighbour queried
                var c2 = color(source.pixels[loc+source.width]);
                
        
                //Image processing logic
                if (red(c1) < red(c2)) {
                    source.pixels[loc+source.width] = c1;
                    source.pixels[loc] = c2;
                } else {}
            }
        }
        
        
    }
    
    //pixelate image on display without altering source pixels
    pixelSize = int(map(mouseY,0,height,1,33)); //10 works well or 2-33
    
    if (frameCount%10==0) {
        for (var i = 0; i < width-pixelSize; i+= pixelSize) {
            for (var j =0; j< height - pixelSize; j += pixelSize) {
                var locD = i + width*j;
                var cD = color(source.pixels[locD]);
                
                fill(red(cD),green(cD),blue(cD), map(mouseX,0,width,60,100));
                rect(i,j,pixelSize,pixelSize);
            }
        }
    }
    
    source.updatePixels();
    println(frameCount);
    
    
}





*/