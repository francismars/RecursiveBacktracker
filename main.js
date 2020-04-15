const resolution = 10
const WIDTH = 600
const HEIGHT = 600
const STARTX = 0
const STARTY = 0
let animation = true
let cellGrid
let cellStack
let start

let Cell = function(x,y){
	this.x = x*resolution
	this.y = y*resolution
	this.visited = false
	this.top = true
	this.bottom = true
	this.left = true
	this.right = true
	
	this.draw = function() {
		if(this.top){
			line(this.x, this.y, this.x+resolution, this.y) // top			
		}
		if(this.bottom){
			line(this.x, this.y+resolution, this.x+resolution, this.y+resolution) // bottom
		}
		if(this.left){
			line(this.x, this.y, this.x, this.y+resolution) // left
		}
		if(this.right){
			line(this.x+resolution, this.y, this.x+resolution, this.y+resolution) // right
		}
	}
	
	this.neighbours = function () {
		let neighboursList = []
		if(this.x>0){
			neighboursList.push(cellGrid[x-1][y])
		}
		if(this.x<width-resolution){
			neighboursList.push(cellGrid[x+1][y])
		}
		if(this.y>0){
			neighboursList.push(cellGrid[x][y-1])
		}		
		if(this.y<height-resolution){
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
		if(cell1.y - cell2.y > 0){ // cell1 por baixo
			cell1.top = false
			cell2.bottom = false
		}
		else { // cell1 por cima
			cell1.bottom = false
			cell2.top = false			
		}
	}
	if(cell1.y - cell2.y == 0){
		if(cell1.x - cell2.x > 0){ // a direita
			cell1.left = false
			cell2.right = false
		} else { // a esquerda
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
	for(i=0;i<=width/resolution;i++){
		cellGrid[i] = []
		for(j=0;j<height/resolution;j++){
			cellGrid[i][j] = new Cell(i,j)
		}
	}
	cellStack = []
	start = cellGrid[STARTX][STARTY]
	start.visited = true
	cellStack.push(start)
}

function setup() {
	//frameRate(25)
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
	clear()
	if(animation){		
		if(cellStack.length>0){
			currentCell = cellStack.pop()
			noStroke()
			fill('#a1d6ff')		
			rect(currentCell.x,currentCell.y,resolution,resolution)
			for(i=0;i<=width/resolution;i++){
				for(j=0;j<height/resolution;j++){
					stroke('black')
					noFill()	
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
				cellStack.push(newNeighbour)
			}
		}		
	}
	else {		
		for(i=0;i<=width/resolution;i++){
			for(j=0;j<height/resolution;j++){
				cellGrid[i][j].draw()
			}
		}		
	}
}