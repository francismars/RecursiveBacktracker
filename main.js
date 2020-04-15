const RESOLUTION = 10
const WIDTH = 800
const HEIGHT = 600
const STARTX = 0
const STARTY = 0
let animation = true
let cellGrid
let cellStack
let start

let Cell = function(x,y){
	this.x = x*RESOLUTION
	this.y = y*RESOLUTION
	this.visited = false
	this.top = true
	this.bottom = true
	this.left = true
	this.right = true
	this.active = false
	
	this.draw = function() {
		stroke('black')
		if(this.top){
			line(this.x, this.y, this.x+RESOLUTION, this.y)		
		}
		if(this.bottom){
			line(this.x, this.y+RESOLUTION, this.x+RESOLUTION, this.y+RESOLUTION)
		}
		if(this.left){
			line(this.x, this.y, this.x, this.y+RESOLUTION)
		}
		if(this.right){
			line(this.x+RESOLUTION, this.y, this.x+RESOLUTION, this.y+RESOLUTION)
		}
		if(this.active){		
			fill('#a1d6ff').noStroke()
			rect(currentCell.x,currentCell.y,RESOLUTION,RESOLUTION)
		}		
	}
	
	this.neighbours = function () {
		let neighboursList = []
		if(this.x>0){
			neighboursList.push(cellGrid[x-1][y])
		}
		if(this.x<width-RESOLUTION){
			neighboursList.push(cellGrid[x+1][y])
		}
		if(this.y>0){
			neighboursList.push(cellGrid[x][y-1])
		}		
		if(this.y<height-RESOLUTION){
			neighboursList.push(cellGrid[x][y+1])
		}
		return neighboursList
	}
}

function filterNeighbours(list, visited){
	visitedList = []
	for(i in list){
		if(list[i].visited == visited){			
			visitedList.push(list[i])
		}
	}
	return visitedList
}

function removeWalls(cell1,cell2){
	if(cell1.x - cell2.x == 0){
		if(cell1.y - cell2.y > 0){ // cell1 bellow
			cell1.top = false
			cell2.bottom = false
		}
		else { // cell1 above
			cell1.bottom = false
			cell2.top = false			
		}
	}
	if(cell1.y - cell2.y == 0){
		if(cell1.x - cell2.x > 0){ // cell1 on the right
			cell1.left = false
			cell2.right = false
		} else { // on the left
			cell1.right = false
			cell2.left = false			
		}
	}
}

function recursiveBacktracker(){
	animation = false
	generateCellGrid()	
	while(cellStack.length>0){
		currentCell = cellStack.pop()
		neighboursList = currentCell.neighbours()
		nonVisitedNeighbours = filterNeighbours(neighboursList, false)
		if(nonVisitedNeighbours.length>0){			
			newNeighbour = nonVisitedNeighbours[floor(random(nonVisitedNeighbours.length))]
			removeWalls(currentCell,newNeighbour)
			cellStack.push(currentCell)
			newNeighbour.visited = true
			cellStack.push(newNeighbour)
		}
	}
} 

function activateAnimation(){
	generateCellGrid()
	animation = true
}

function generateCellGrid() {
	cellGrid = []
	for(i=0;i<=width/RESOLUTION;i++){
		cellGrid[i] = []
		for(j=0;j<=height/RESOLUTION;j++){
			cellGrid[i][j] = new Cell(i,j)
		}
	}
	cellStack = []
	start = cellGrid[STARTX][STARTY]
	start.visited = true
	cellStack.push(start)
}

function setup() {
	createCanvas(WIDTH, HEIGHT);
	generateCellGrid()
	
	button = createButton('Maze it!');
	button.position(WIDTH+100, 100);
	button.mousePressed(recursiveBacktracker);
	
	button2 = createButton('Animate it!');
	button2.position(WIDTH+100, 150);
	button2.mousePressed(activateAnimation);
}

function draw() {	
	if(animation){		
		if(cellStack.length>0){
			clear()
			currentCell = cellStack.pop()
			currentCell.active = true
			for(i=0;i<=width/RESOLUTION;i++){
				for(j=0;j<height/RESOLUTION;j++){	
					cellGrid[i][j].draw()
				}
			}	
			neighboursList = currentCell.neighbours()
			nonVisitedNeighbours = filterNeighbours(neighboursList, false)
			if(nonVisitedNeighbours.length>0){			
				newNeighbour = nonVisitedNeighbours[floor(random(nonVisitedNeighbours.length))]
				removeWalls(currentCell,newNeighbour)
				cellStack.push(currentCell)
				newNeighbour.visited = true
				currentCell.active = false
				cellStack.push(newNeighbour)
			}
		}		
	}
	else {		
		clear()
		for(i=0;i<=width/RESOLUTION;i++){
			for(j=0;j<height/RESOLUTION;j++){
				cellGrid[i][j].draw()
			}
		}		
	}
}