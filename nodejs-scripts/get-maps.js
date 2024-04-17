const MineMazeBuilder = require('@arteben/mazebuilder');
const http = require('http');
const fs = require('fs');
const path = require('path');

const projectAbsPath = path.resolve(__dirname, '../');

const config = {
  mapSizes: [{
    degreeOfWidth: 10,
    count: 2,
  }, {
    degreeOfWidth: 20,
    count: 2,
  }, {
    degreeOfWidth: 40,
    count: 1,
  }, {
    degreeOfWidth: 100,
    count: 1,
  }],
  json: 'map-list.json',
  maps: 'maps/',
}

const createLabyrinth = (degree) => {
  const maze = new MineMazeBuilder(degree);
  if (!maze.correctPlaceDoors()) {
    console.error('fail with place doors!');
    return false;
  }
  maze.placeKey();
  if (!maze.correctPlaceKey()) {
    console.error('fail with place key!');
    return false;
  }
  maze.setLaddersAndWalls();
  maze.setTorches();
  maze.getExpandedMaze();

  if (!maze.expanded) return false;

  return {
    strings: MineMazeBuilder.getMapArrStrings(maze.expanded.maze, ''),
    width: maze.expanded.width,
    height: maze.expanded.height,
  }
};

const getElementMapList = (nameMapFile, w, h) => {
  const levels = ['easy', 'middle', 'hard', 'veryhard'];
  const getLevels = (width, height) => {
    const div = Math.floor((width + height) / 100);
    return div > (levels.length - 1) ? (levels.length - 1) : div;
  }
  return {
    file: config.maps + nameMapFile,
    level: levels[getLevels(w, h)],
  }
}

const getMapStrings = (defreeOfWidth) => {
  let result = false;
  while (!result) {
    result = createLabyrinth(defreeOfWidth);
  }

  return result;
};

const mapList = [];

const setMap = (degreeOfWidth, id) => {
  const mapStrings = getMapStrings(degreeOfWidth);
  const mapName = `map${id}.txt`;
  const pathMap = `${projectAbsPath}/src/assets/${config.maps}${mapName}`;
  const syncStream = fs.createWriteStream(pathMap);
  mapStrings.strings.forEach((element) => {
    syncStream.write(element + '\n');
  });
  syncStream.end();
  mapList.push(getElementMapList(mapName, mapStrings.width, mapStrings.height));
};

let mapId = 0;
config.mapSizes.forEach((mapConfig) => {
  for (let i = 0; i < mapConfig.count; i++) {
    setMap(mapConfig.degreeOfWidth, mapId);
    mapId++
  }
})


const jsonPath = `${projectAbsPath}/src/assets/${config.json}`;

fs.writeFile(jsonPath, JSON.stringify(mapList, null, 2), (error) => {
  if (error) {
    console.log('An error has occurred ', error);
    return;
  }
});
