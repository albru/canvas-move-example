const canvas = document.getElementById('canvas');

const c = canvas.getContext('2d');

const BASE_COORDS = {
    top: { start: { x: 150, y: 114 }, end: { x: 250, y: 114 } },
    left: { start: { x: 120, y: 144 }, end: { x: 120, y: 294 } },
    right: { start: { x: 280, y: 144 }, end: { x: 280, y: 294 } }
}

const TOP_LENGTH = 100
const SIDE_LENGTH = 150
const CANVAS_WIDTH = canvas.width
const BASE_STEP = 25

function draw({ start, end }) {
    c.beginPath();
    c.moveTo(start.x, start.y)
    c.lineTo(end.x, end.y)
    c.strokeStyle = '#ffff'
    c.lineWidth = 16
    c.stroke()

}

function drawLogo() {
    const { top, left, right } = BASE_COORDS

    draw(top)
    draw(left)
    draw(right)
}

function createCoordinate(coordinate) {
    return Math.abs(Math.abs(coordinate) - CANVAS_WIDTH)
}

function checkCoord(coord) {
    return coord < 0 || coord > CANVAS_WIDTH
}

function setCoordinates(coordinates, coordinate, isPositive) {

    const step = isPositive ? BASE_STEP : -BASE_STEP

    Object.keys(coordinates).forEach(line => {
        coordinates[line].start[coordinate] = coordinates[line].start[coordinate] + step
        coordinates[line].end[coordinate] = coordinates[line].end[coordinate] + step

        if (checkCoord(coordinates[line].start[coordinate])) {
            coordinates[line].start[coordinate] = createCoordinate(coordinates[line].start[coordinate])
        }
        if (checkCoord(coordinates[line].end[coordinate])) {
            coordinates[line].end[coordinate] = createCoordinate(coordinates[line].end[coordinate])
        }
        
        if (line === 'top' && Math.abs(coordinates.top.start.x - coordinates.top.end.x) !== TOP_LENGTH) {
            if (Math.abs(coordinates.top.start.x) - Math.abs(coordinates.top.end.x) !== TOP_LENGTH) {
                coordinates.top.start.x = 0

                if (coordinates.top.end.x === 0) {
                    coordinates.top.start.x = CANVAS_WIDTH - TOP_LENGTH
                    coordinates.top.end.x = CANVAS_WIDTH
                } else {
                    draw({ start: { x: CANVAS_WIDTH - Math.abs(TOP_LENGTH - coordinates.top.end.x), y: coordinates.top.start.y }, end: { x: CANVAS_WIDTH, y: coordinates.top.start.y } })
                }
            }
        }

        if (line !== 'top' && Math.abs(coordinates[line].start.y - coordinates[line].end.y) !== SIDE_LENGTH) {
            if (Math.abs(coordinates[line].start.y) - Math.abs(coordinates[line].end.y) !== SIDE_LENGTH) {
                if (coordinates[line].end.y <= SIDE_LENGTH) {
                    coordinates[line].start.y = 0;
                    draw({ start: { y: CANVAS_WIDTH - Math.abs(SIDE_LENGTH - coordinates[line].end.y), x: coordinates[line].start.x }, end: { y: CANVAS_WIDTH, x: coordinates[line].end.x } })
                }

                if(coordinates[line].end.y > SIDE_LENGTH) {
                    coordinates[line].start.y = coordinates[line].end.y - SIDE_LENGTH;
                }
            }

        }
    })
}

function moveLogo({ coordinate, isPositive, direction }) {
    c.clearRect(0, 0, canvas.width, canvas.height)
    setCoordinates(BASE_COORDS, coordinate, isPositive, direction)
    drawLogo()
}

function movementListener(e) {
    const { keyCode } = e;

    switch (keyCode) {
        case 37:
            // left
            moveLogo({ coordinate: 'x', isPositive: false })
            break;

        case 39:
            // right
            moveLogo({ coordinate: 'x', isPositive: true })
            break;

        case 38:
            // down
            moveLogo({ coordinate: 'y', isPositive: false })
            break;

        case 40:
            // up
            moveLogo({ coordinate: 'y', isPositive: true })
            break;
    }
}

drawLogo();

document.addEventListener('keydown', (e) => movementListener(e))