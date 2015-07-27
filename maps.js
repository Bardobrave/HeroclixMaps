function Board(cellSize, numHCells, numVCells) {
    this.cellSize = cellSize;
    this.numHCells = numHCells;
    this.numVCells = numVCells;
    this.Board = document.getElementById("myBoard");
    this.maxWidth = this.Board.clientWidth;
    this.currentTerrainType = "";
    this.currentElevation = 2;
    this.backgroundImage;
    this.canvasObj = {};
    this.context = {};
    this.board = new Array(numHCells);
    
    this.canvasObj = document.createElement("canvas");
    this.canvasObj.height = (cellSize * numVCells) + 1;
    this.canvasObj.width = (cellSize * numHCells) + 1;
    this.context = this.canvasObj.getContext("2d");
    this.Board.appendChild(this.canvasObj);

    this.source = null;
    this.target = null;

    this.drawReticle();
};

Board.prototype = (function () {

    //Método privado que traduce la posición actual del ratón a las coordenadas del canvas del objeto.
    function relMouseCoords(event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this.canvasObj;

        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while (currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return { x: canvasX, y: canvasY }
    }

    //Método privado que dibuja una línea de color en los laterales de un cuadro en función de un tipo de dato y la existencia de dicho tipo
    //de dato en las casillas de alrededor
    function drawTerrainOnCell(x, y) {
        var terrainColors = {
            "hasWallAt": "#000", "isWater": "#00f", "elevation": "#f00", "isStartingArea": "#f0f", "isHindering": "#0a0", "isBlocked": "#ff9553"
        }
        for (var terrainType in terrainColors) {
            if (this.board[x][y][terrainType]) {
                this.context.strokeStyle = terrainColors[terrainType];
                if ((terrainType != "hasWallAt" && (y == 0 || (y > 0 && (!this.board[x][y - 1][terrainType] || (this.board[x][y - 1][terrainType]
                    && this.board[x][y - 1][terrainType] < this.board[x][y][terrainType]))))) || (terrainType == "hasWallAt"
                    && this.board[x][y].hasWallAt.indexOf("T") != -1)) {
                    this.context.strokeRect((this.cellSize * x) + this.board[x][y].grosorL + 1, (this.cellSize * y) + this.board[x][y].grosorT + 1,
                        this.cellSize - this.board[x][y].grosorL - this.board[x][y].grosorR - 1, 1);
                    this.board[x][y].grosorT++;
                }
                if ((terrainType != "hasWallAt" && y < this.board[0].length && (!this.board[x][y + 1][terrainType]
                    || (this.board[x][y + 1][terrainType] && this.board[x][y + 1][terrainType] < this.board[x][y][terrainType])))
                    || (terrainType == "hasWallAt" && this.board[x][y].hasWallAt.indexOf("B") != -1)) {
                    this.context.strokeRect((this.cellSize * x) + this.board[x][y].grosorL + 1, (this.cellSize * (y + 1))
                        - this.board[x][y].grosorB - 1, this.cellSize - this.board[x][y].grosorL - this.board[x][y].grosorR - 1, 1);
                    this.board[x][y].grosorB++;
                }
                if ((terrainType != "hasWallAt" && (x == 0 || (x > 0 && (!this.board[x - 1][y][terrainType] || (this.board[x - 1][y][terrainType]
                    && this.board[x - 1][y][terrainType] < this.board[x][y][terrainType]))))) || (terrainType == "hasWallAt"
                    && this.board[x][y].hasWallAt.indexOf("L") != -1)) {
                    this.context.strokeRect((this.cellSize * x) + this.board[x][y].grosorL + 1, (this.cellSize * y) + this.board[x][y].grosorT + 1,
                        1, this.cellSize - this.board[x][y].grosorT - this.board[x][y].grosorB - 1);
                    this.board[x][y].grosorL++;
                }
                if ((terrainType != "hasWallAt" && x < this.board.length && (!this.board[x + 1][y][terrainType]
                    || (this.board[x + 1][y][terrainType] && this.board[x + 1][y][terrainType] < this.board[x][y][terrainType])))
                    || (terrainType == "hasWallAt" && this.board[x][y].hasWallAt.indexOf("R") != -1)) {
                    this.context.strokeRect((this.cellSize * (x + 1)) - this.board[x][y].grosorR - 1, (this.cellSize * y)
                        + this.board[x][y].grosorT + 1, 1, this.cellSize - this.board[x][y].grosorT - this.board[x][y].grosorB - 1);
                    this.board[x][y].grosorR++;
                }
                if (terrainType == "elevation" && this.board[x][y].changeToLevel) {
                    this.context.fillStyle = "#f00";
                    var midCell = this.cellSize / 2;
                    var fourthCell = this.cellSize / 4;
                    var quintCell = this.cellSize / 5;
                    switch (this.board[x][y].changeToLevelAt) {
                        case 1: this.context.moveTo((this.cellSize * x) + quintCell, (this.cellSize * y));
                            this.context.beginPath();
                            this.context.lineTo((this.cellSize * x) + midCell, (this.cellSize * y) - midCell);
                            this.context.lineTo((this.cellSize * (x + 1)) - quintCell, (this.cellSize * y));
                            this.context.lineTo((this.cellSize * x) + midCell, (this.cellSize * y) + midCell);
                            this.context.lineTo((this.cellSize * x) + quintCell, (this.cellSize * y));
                            this.context.closePath();
                            this.context.fill();
                            this.context.fillStyle = "#000";
                            this.context.strokeStyle = "#000";
                            this.context.textBaseline = "middle";
                            this.context.textAlign = "center";
                            this.context.strokeRect((this.cellSize * x), (this.cellSize * y), this.cellSize, 0.5);
                            this.context.fillText(this.board[x][y].changeToLevel, (this.cellSize * x) + midCell, (this.cellSize * y) - fourthCell);
                            this.context.fillText(this.board[x][y].elevation, (this.cellSize * x) + midCell, (this.cellSize * y) + fourthCell);
                            break;
                        case 2:
                            this.context.moveTo((this.cellSize * (x + 1)), (this.cellSize * y) + quintCell);
                            this.context.beginPath();
                            this.context.lineTo((this.cellSize * (x + 1)) + midCell, (this.cellSize * y) + midCell);
                            this.context.lineTo((this.cellSize * (x + 1)), (this.cellSize * (y + 1)) - quintCell);
                            this.context.lineTo((this.cellSize * x) + midCell, (this.cellSize * y) + midCell);
                            this.context.lineTo((this.cellSize * (x + 1)), (this.cellSize * y) + quintCell);
                            this.context.closePath();
                            this.context.fill();
                            this.context.fillStyle = "#000";
                            this.context.strokeStyle = "#000";
                            this.context.textBaseline = "middle";
                            this.context.textAlign = "center";
                            this.context.strokeRect((this.cellSize * (x + 1)), (this.cellSize * y), 0.5, this.cellSize);
                            this.context.fillText(this.board[x][y].changeToLevel, (this.cellSize * (x + 1)) + fourthCell,
                                (this.cellSize * y) + midCell);
                            this.context.fillText(this.board[x][y].elevation, (this.cellSize * (x + 1)) - fourthCell,
                                (this.cellSize * y) + midCell);
                            break;
                        case 3: this.context.moveTo((this.cellSize * x) + quintCell, (this.cellSize * (y + 1)));
                            this.context.beginPath();
                            this.context.lineTo((this.cellSize * x) + midCell, (this.cellSize * (y + 1)) + midCell);
                            this.context.lineTo((this.cellSize * (x + 1)) - quintCell, (this.cellSize * (y + 1)));
                            this.context.lineTo((this.cellSize * x) + midCell, (this.cellSize * (y + 1)) - midCell);
                            this.context.lineTo((this.cellSize * x) + quintCell, (this.cellSize * (y + 1)));
                            this.context.closePath();
                            this.context.fill();
                            this.context.fillStyle = "#000";
                            this.context.strokeStyle = "#000";
                            this.context.textBaseline = "middle";
                            this.context.textAlign = "center";
                            this.context.strokeRect((this.cellSize * x), (this.cellSize * (y + 1)), this.cellSize, 0.5);
                            this.context.fillText(this.board[x][y].changeToLevel, (this.cellSize * x) + midCell,
                                (this.cellSize * (y + 1)) + fourthCell);
                            this.context.fillText(this.board[x][y].elevation, (this.cellSize * x) + midCell,
                                (this.cellSize * (y + 1)) - fourthCell);
                            break;
                        case 4: this.context.moveTo((this.cellSize * x), (this.cellSize * y) + quintCell);
                            this.context.beginPath();
                            this.context.lineTo((this.cellSize * x) + midCell, (this.cellSize * y) + midCell);
                            this.context.lineTo((this.cellSize * x), (this.cellSize * (y + 1)) - quintCell);
                            this.context.lineTo((this.cellSize * x) - midCell, (this.cellSize * y) + midCell);
                            this.context.lineTo((this.cellSize * x), (this.cellSize * y) + quintCell);
                            this.context.closePath();
                            this.context.fill();
                            this.context.fillStyle = "#000";
                            this.context.strokeStyle = "#000";
                            this.context.textBaseline = "middle";
                            this.context.textAlign = "center";
                            this.context.strokeRect((this.cellSize * x), (this.cellSize * y), 0.5, this.cellSize);
                            this.context.fillText(this.board[x][y].changeToLevel, (this.cellSize * x) - fourthCell, (this.cellSize * y) + midCell);
                            this.context.fillText(this.board[x][y].elevation, (this.cellSize * x) + fourthCell, (this.cellSize * y) + midCell);
                            break;
                    }
                }
            }
        }
    }

    return {
        //Método que, ante un click, detecta la celda, identifica sus coordenadas en el array y llama al método que la redibuja
        cellClick: function (event) {
            var coords = relMouseCoords.call(this, event);
            var x = parseInt(coords.x / this.cellSize);
            var y = parseInt(coords.y / this.cellSize);
            switch (this.currentTerrainType) {
                case "blocked":
                    this.board[x][y].isBlocked = !this.board[x][y].isBlocked;
                    break;
                case "elevation":
                    if (this.board[x][y].elevation == this.currentElevation)
                        delete this.board[x][y].elevation;
                    else
                        this.board[x][y].elevation = this.currentElevation;

                    if (y > 0 && this.board[x][y - 1].possibleElevationAtEntries) {
                        delete this.board[x][y - 1].possibleElevationAtEntries;
                        if (this.board[x][y - 1].changeToLevelAt == 3) {
                            delete this.board[x][y - 1].changeToLevel;
                            delete this.board[x][y - 1].changeToLevelAt;
                        }
                    }
                    if (x < this.board.length && this.board[x + 1][y].possibleElevationAtEntries) {
                        delete this.board[x + 1][y].possibleElevationAtEntries;
                        if (this.board[x + 1][y].changeToLevelAt == 4) {
                            delete this.board[x + 1][y].changeToLevel;
                            delete this.board[x + 1][y].changeToLevelAt;
                        }
                    }
                    if (y < this.board[0].length && this.board[x][y + 1].possibleElevationAtEntries) {
                        delete this.board[x][y + 1].possibleElevationAtEntries;
                        if (this.board[x][y + 1].changeToLevelAt == 1) {
                            delete this.board[x][y + 1].changeToLevel;
                            delete this.board[x][y + 1].changeToLevelAt;
                        }
                    }
                    if (x > 0 && this.board[x - 1][y].possibleElevationAtEntries) {
                        delete this.board[x - 1][y].possibleElevationAtEntries;
                        if (this.board[x - 1][y].changeToLevelAt == 2) {
                            delete this.board[x - 1][y].changeToLevel;
                            delete this.board[x - 1][y].changeToLevelAt;
                        }
                    }
                    break;
                case "hindering":
                    this.board[x][y].isHindering = !this.board[x][y].isHindering;
                    break;
                case "levelChange":
                    if (this.board[x][y].elevation) {
                        var changeToLevel = this.board[x][y].elevation - 1;
                        if (!this.board[x][y].possibleElevationAtEntries) {
                            this.board[x][y].possibleElevationAtEntries = [];
                            if (y > 0 && (this.board[x][y - 1].elevation == changeToLevel || (changeToLevel == 1
                                && !this.board[x][y - 1].elevation)) && !this.board[x][y - 1].isBlocked) {
                                this.board[x][y].possibleElevationAtEntries.push(1);
                            }
                            if (x < this.board.length && (this.board[x + 1][y].elevation == changeToLevel || (changeToLevel == 1
                                && !this.board[x + 1][y].elevation)) && !this.board[x + 1][y].isBlocked) {
                                this.board[x][y].possibleElevationAtEntries.push(2);
                            }
                            if (y < this.board[0].length && (this.board[x][y + 1].elevation == changeToLevel || (changeToLevel == 1
                                && !this.board[x][y + 1].elevation)) && !this.board[x][y + 1].isBlocked) {
                                this.board[x][y].possibleElevationAtEntries.push(3);
                            }
                            if (x > 0 && (this.board[x - 1][y].elevation == changeToLevel || (changeToLevel == 1
                                && !this.board[x - 1][y].elevation)) && !this.board[x - 1][y].isBlocked) {
                                this.board[x][y].possibleElevationAtEntries.push(4);
                            }
                        } 

                        this.board[x][y].changeToLevel = changeToLevel;
                        if (!this.board[x][y].changeToLevelAt)
                            this.board[x][y].changeToLevelAt = this.board[x][y].possibleElevationAtEntries[0];
                        else {
                            var currentPoint = this.board[x][y].possibleElevationAtEntries.indexOf(this.board[x][y].changeToLevelAt);
                            this.board[x][y].changeToLevelAt = (currentPoint == this.board[x][y].possibleElevationAtEntries.length) ?
                                this.board[x][y].possibleElevationAtEntries[0] : this.board[x][y].possibleElevationAtEntries[currentPoint + 1];
                        }
                    }
                    break;
                case "startingArea":
                    this.board[x][y].isStartingArea = !this.board[x][y].isStartingArea;
                    break;
                case "wall":
                    var midCell = this.cellSize / 2;
                    var quartCell = this.cellSize / 4;
                    var isInTop = coords.y <= (this.cellSize * y) + quartCell && coords.y >= this.cellSize * y;
                    var isInBottom = coords.y <= (this.cellSize * (y + 1)) && coords.y >= (this.cellSize * (y + 1)) - quartCell;
                    var isInLeft = coords.x >= (this.cellSize * x) && coords.x <= (this.cellSize * x) + quartCell;
                    var isInRight = coords.x <= (this.cellSize * (x + 1)) && coords.x >= (this.cellSize * (x + 1)) - quartCell;
                    var quadrant = (isInTop && !isInLeft && !isInRight) ? "T" : (!isInTop && isInRight && !isInBottom) ? "R" : (isInBottom
                        && !isInLeft && !isInRight) ? "B" : (isInLeft && !isInTop && !isInBottom) ? "L" : "N";
                    if (!this.board[x][y].hasWallAt)
                        this.board[x][y].hasWallAt = [quadrant];
                    else
                        if (this.board[x][y].hasWallAt.indexOf(quadrant) != -1)
                            this.board[x][y].hasWallAt.splice(this.board[x][y].hasWallAt.indexOf(quadrant), 1);
                        else
                            this.board[x][y].hasWallAt.push(quadrant);
                    break;
                case "water":
                    this.board[x][y].isWater = !this.board[x][y].isWater;
                    break;
            }
            if (!this.backgroundImage) {
                var fromColumn = (x == 0) ? 0 : x - 1;
                var toColumn = (x == this.board.length) ? x : x + 1;
                var fromRow = (y == 0) ? 0 : y - 1;
                var toRow = (y == this.board[0].length) ? y : y + 1;
                for (var c = fromColumn; c <= toColumn; c++) {
                    for (var r = fromRow; r <= toRow; r++) {
                        this.clearCell(c, r);
                        drawTerrainOnCell.call(this, c, r);
                    }
                }
                this.clearCell(x, y);
                drawTerrainOnCell.call(this, x, y);
            } else {
                this.context.drawImage(this.backgroundImage, 0, 0, this.cellSize * this.numHCells, this.cellSize * this.numVCells);
                var that = this;
                that.drawReticle();
                that.loadTerrain();
            }
        },
        clear: function () {
            this.context.fillStyle = "#fff";
            this.context.fillRect(0, 0, this.canvasObj.width, this.canvasObj.height);
        },
        clearCell: function (x, y) {
            this.context.fillStyle = "#fff";
            this.context.fillRect((this.cellSize * x) + 1, (this.cellSize * y) + 1, this.cellSize - 1, this.cellSize - 1);
            this.board[x][y].grosorT = 0;
            this.board[x][y].grosorR = 0;
            this.board[x][y].grosorB = 0;
            this.board[x][y].grosorL = 0;
        },
        drawLineOfSight: function () {
            this.context.fillStyle = "#ddd";
            var xStart = (this.source.col * this.cellSize) + (this.cellSize / 2);
            var xEnd = (this.target.col * this.cellSize) + (this.cellSize / 2);
            var yStart = (this.source.row * this.cellSize) + (this.cellSize / 2);
            var yEnd = (this.target.row * this.cellSize) + (this.cellSize / 2);
            var stepNumber = Math.max(Math.abs(xEnd - xStart), Math.abs(yEnd - yStart));
            var xStep = (xEnd - xStart) / stepNumber;
            var yStep = (yEnd - yStart) / stepNumber;
            var x = xStart;
            var y = yStart;
            while (Math.abs(x - xEnd) >= 1 && Math.abs(y - yEnd) >= 1) {
                //iluminar la celda del punto x, y
                var column = parseInt(x / this.cellSize);
                var row = parseInt(y / this.cellSize);
                if (!this.board[column][row].highlighted) {
                    this.board[column][row].highlighted = true;
                    this.context.fillRect((column * this.cellSize) + 1, (row * this.cellSize) + 1, this.cellSize - 1, this.cellSize - 1);
                }
                x = x + xStep;
                y = y + yStep;
            }
            //Marcamos de nuevo target y source, y dibujamos la línea de visión para comprobar visualmente que está ok
            this.context.fillStyle = "#666";
            this.context.strokeStyle = "#000";
            this.context.fillRect((this.source.col * this.cellSize) + 1, (this.source.row * this.cellSize) + 1, this.cellSize - 1,
                this.cellSize - 1);
            this.context.fillRect((this.target.col * this.cellSize) + 1, (this.target.row * this.cellSize) + 1, this.cellSize - 1,
                this.cellSize - 1);
            this.context.beginPath();
            this.context.moveTo(xStart, yStart);
            this.context.lineTo(xEnd, yEnd);
            this.context.stroke();
            this.context.closePath();
        },
        drawReticle: function () {
            this.context.fillStyle = "#000";
            for (var x = 0; x <= this.numHCells; x++) {
                this.context.fillRect(x * this.cellSize, 0, 1, this.canvasObj.height);
                if (!this.board[x])
                    this.board[x] = new Array(this.numVCells);
                for (var y = 0; y <= this.numVCells; y++) {
                    if (!this.board[x][y])
                        this.board[x][y] = { col: x, row: y, grosorT: 0, grosorR: 0, grosorB: 0, grosorL: 0 };
                    else {
                        this.board[x][y].grosorT = 0;
                        this.board[x][y].grosorR = 0;
                        this.board[x][y].grosorB = 0;
                        this.board[x][y].grosorL = 0;
                    }
                    this.context.fillRect(0, y * this.cellSize, this.canvasObj.width, 1);
                }
            }
        },
        loadTerrain: function () {
            for (var pointx in this.board) {
                var x = parseInt(pointx);
                for (var pointy in this.board[x]) {
                    var y = parseInt(pointy);
                    drawTerrainOnCell.call(this, x, y);
                }
            }
        }
    }
}());

function updateAccion(texto) {
    var operacion = document.getElementById("operacion");
    operacion.innerHTML = texto;
}

var myBoard = new Board(40, 20, 20);
myBoard.canvasObj.addEventListener("click", function (event) { myBoard.cellClick(event); });

var controlPanel = document.getElementById("controlPanel");
var controlsImage = document.getElementById("imageBackground");
var controlsHCells = document.getElementById("hCells");
var controlsVCells = document.getElementById("vCells");
var controlsCellSize = document.getElementById("cellSize");
var controlsClear = document.getElementById("clear");
var controlsHindering = document.getElementById("hindering");
var controlsBlocked = document.getElementById("blocked");
var controlsWater = document.getElementById("water");
var controlsStartingArea = document.getElementById("startingArea");
var controlsElevation = document.getElementById("elevation");
var controlsCurrentElevation = document.getElementById("elevationLevel");
var controlsLevelChange = document.getElementById("levelChange");
var controlsWalls = document.getElementById("walls");
var controlsFakeFile = document.getElementById("fakeFile");
var controlsSave = document.getElementById("save");

controlsHCells.addEventListener("change", function (event) {
    myBoard.clear();
    if (myBoard.numHCells > this.value) {
        for (var x = parseInt(this.value) ; x <= myBoard.numHCells; x++) {
            delete myBoard.board[x];
        }
    }
    myBoard.numHCells = parseInt(this.value);
    if ((myBoard.numHCells * myBoard.cellSize) + 1 > myBoard.maxWidth) {
        myBoard.cellSize = (myBoard.maxWidth - 1) / myBoard.numHCells;
        controlsCellSize.value = myBoard.cellSize;
        myBoard.canvasObj.height = (myBoard.numVCells * myBoard.cellSize) + 1;
    }
    myBoard.canvasObj.width = (myBoard.numHCells * myBoard.cellSize) + 1;
    myBoard.drawReticle();
    myBoard.loadTerrain();
});

controlsVCells.addEventListener("change", function (event) {
    myBoard.clear();
    if (myBoard.numVCells > this.value) {
        for (var x = 0; x < myBoard.board.length; x++) {
            for (var y = parseInt(this.value) ; y <= myBoard.numVCells; y++) {
                delete myBoard.board[x][y];
            }
        }
    }
    myBoard.numVCells = parseInt(this.value);
    myBoard.canvasObj.height = myBoard.numVCells * myBoard.cellSize + 1;
    myBoard.drawReticle();
    myBoard.loadTerrain();
});

controlsCellSize.addEventListener("change", function (event) {
    myBoard.clear();
    myBoard.cellSize = this.value;
    if ((myBoard.cellSize * myBoard.numHCells) + 1 > myBoard.maxWidth) {
        myBoard.numHCells = Math.floor((myBoard.maxWidth - 1) / myBoard.cellSize);
        controlsHCells.value = myBoard.numHCells;
    }
    myBoard.canvasObj.width = (myBoard.numHCells * myBoard.cellSize) + 1;
    myBoard.canvasObj.height = (myBoard.numVCells * myBoard.cellSize) + 1;
    myBoard.drawReticle();
    myBoard.loadTerrain();
});

controlsImage.addEventListener("change", function (event) {
    var backgroundWidth = myBoard.cellSize * myBoard.numHCells;
    var backgroundHeight = myBoard.cellSize * myBoard.numVCells;
    myBoard.backgroundImage = new Image();
    myBoard.backgroundImage.onload = function () {
        myBoard.context.drawImage(this, 0, 0, backgroundWidth, backgroundHeight);
    }
    myBoard.backgroundImage.src = URL.createObjectURL(event.target.files[0]);
    var delay = window.setTimeout(function () {  //Hay que retrasar el redibujado de la cuadrícula para evitar que se dibuje antes que el background
        myBoard.drawReticle();
        myBoard.loadTerrain();
    }, 100);
});
controlsClear.addEventListener("click", function (event) { myBoard.clear(); });
controlsHindering.addEventListener("click", function (event) { myBoard.currentTerrainType = "hindering"; updateAccion("Añadiendo terreno obstaculizado"); });
controlsBlocked.addEventListener("click", function (event) { myBoard.currentTerrainType = "blocked"; updateAccion("Añadiendo terreno bloqueado"); });
controlsWater.addEventListener("click", function (event) { myBoard.currentTerrainType = "water"; updateAccion("Añadiendo agua"); });
controlsStartingArea.addEventListener("click", function (event) { myBoard.currentTerrainType = "startingArea"; updateAccion("Añadiendo zona de inicio"); });
controlsElevation.addEventListener("click", function (event) { myBoard.currentTerrainType = "elevation"; updateAccion("Añadiendo zona elevada"); })
controlsCurrentElevation.addEventListener("change", function (event) {
    if (!isNaN(this.value) && parseInt(this.value) >= 2)
        myBoard.currentElevation = parseInt(this.value);
    else {
        myBoard.currentElevation = 2;
        this.value = 2;
    }
});
controlsLevelChange.addEventListener("click", function (event) { myBoard.currentTerrainType = "levelChange"; updateAccion("Añadiendo cambio de nivel"); });
controlsWalls.addEventListener("click", function (event) { myBoard.currentTerrainType = "wall"; updateAccion("Añadiendo muros"); });
controlsFakeFile.addEventListener("click", function (event) {
    controlsImage.click();
});
controlsSave.addEventListener("click", function (event) {
    window.open(myBoard.canvasObj.toDataURL());
});
