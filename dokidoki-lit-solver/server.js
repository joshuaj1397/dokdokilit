const express = require('express');
const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const app = express();

const port = process.env.PORT || 3005;

const vertices = [
  {
    name: 'A',
    desc: 'Vertice 1'
  },
  {
    name: 'B',
    desc: 'Vertice 2'
  },
  {
    name: 'C',
    desc: 'Vertice 3'
  },
  {
    name: 'D',
    desc: 'Vertice 4'
  },
  {
    name: 'E',
    desc: 'Vertice 5'
  }
];

// Adjacency List of edges
const edges = [
  [ , 1,  ,  , 2],
  [ ,  ,  , 3,  ],
  [ ,  ,  ,  ,  ],
  [ ,  , 4,  , 5],
  [ ,  ,  ,  ,  ],
];

function buildGraph(vertices, edges, source, target) {
  var edgeList = [];
  for (var i = 0; i < edges.length; i++) {
    var startVertice = i;
    for (var j = 0; j < edges[i].length; j++) {
      var endVertice = j;
      var trauma = edges[i][j];
      if (trauma) {
        edgeList.push('edge(' + startVertice + ', ' + endVertice + ', ' + trauma + ').\n');
      }
    }
  }
  edgeList = edgeList.join('');

  // Longest simple path in a graph is NP-hard so just make up a large number
  return '#maxint=' + (vertices.length * vertices.length) + '.\n' +
          'source(' + source + ').\n' +
          'target(' + target + ').\n' +
          'node(0..' + (vertices.length-1) + ').\n' +
          edgeList;
}

async function buildASPath(vertices, edges, source, target, optimization) {
  var model = buildGraph(vertices, edges, source, target);

  // Sync to block the execution until the file is done being written to
  fs.writeFileSync('graph.dlv', model, (err) => {
    if (err) throw err;
  });

  // Sync to block execution until the subprocess terminates
  var answerSets = execSync('.\\dlv.mingw.exe .\\graph.dlv .\\' + optimization + '.dlv -pfilter=path -silent');
  answerSets = answerSets.toString('utf-8');

  var pathRegex = /\{([^}]+)\}/g;
  var traumaRegex = /\[[0-9]+:[0-9]+\]/g;
  return {
    paths: answerSets.match(pathRegex),
    trauma: answerSets.match(traumaRegex)
  };
}

app.get('/api/graph', (req, res) => {
  res.send({ express: {edges, vertices}});
});

app.get('/api/path/:source/:target/:optimization', async (req, res) => {
  var path = await buildASPath(vertices, edges, req.params.source, req.params.target, req.params.optimization);
  res.send({ express: path});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
