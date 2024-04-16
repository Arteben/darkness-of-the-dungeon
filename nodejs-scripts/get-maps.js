const MineMazeBuilder = require('@arteben/mazebuilder');

// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, "127.0.0.1");
// console.log('Server running at http://127.0.0.1:1337/');

const createLabyrinth = () => {
  const maze = new MineMazeBuilder(20, 20);
  if (!maze.correctPlaceDoors()) {
    console.error('replace please doors');
    return false;
  }
  maze.placeKey();
  if (!maze.correctPlaceKey()) {
    console.error('replace please key');
    return false;
  }
  maze.setLaddersAndWalls();
  maze.setTorches();
  // console.log(MineMazeBuilder.getMazeMapStrings(maze.maze, ' '));
  maze.getExpandedMaze();
  if (maze.expanded) {
    console.log(MineMazeBuilder.getMapArrStrings(maze.expanded.maze, ''));
  }
};

createLabyrinth();
