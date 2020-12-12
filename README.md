<p align="center">
   <img alt="conway game of life gif" src="https://res.cloudinary.com/mikemoura/image/upload/v1607737309/conways-game-of-life/conway-demo-gif_hiei2f.gif"/>
</p>

# Conway's Game of Life built with Stimulus js

[![Author](https://img.shields.io/badge/author-mikemorcerf-EE4D64?style=flat-square)](https://github.com/mikemorcerf)
[![Languages](https://img.shields.io/github/languages/count/mikemorcerf/conway-game-of-life-stimulusjs?color=%23EE4D64&style=flat-square)](#)
[![Stars](https://img.shields.io/github/stars/mikemorcerf/conway-game-of-life-stimulusjs?color=EE4D64&style=flat-square)](https://github.com/mikemorcerf/conway-game-of-life-stimulusjs/stargazers)
[![Forks](https://img.shields.io/github/forks/mikemorcerf/conway-game-of-life-stimulusjs?color=%23EE4D64&style=flat-square)](https://github.com/mikemorcerf/conway-game-of-life-stimulusjs/network/members)

> Play Conway's Game of Life and summon meteors to decimate a population of square colorful cells

[Working Online Demo](https://stimulus-game-of-life.herokuapp.com/)
---

# :pushpin: Table of Contents

* [Technologies](#wrench-technologies)
* [Features](#rocket-features)
* [Installation and Getting started](#construction_worker-installation-and-getting-started)
* [How to Use](#feet-how-to-use)
* [Found a bug? Missing a specific feature?](#bug-issues)
* [License](#closed_book-license)

# :wrench: Technologies

*  [Express](https://expressjs.com/)
*  [Node.js](https://nodejs.org/en/)
*  [Stimulusjs](https://github.com/stimulusjs/stimulus)

# :rocket: Features

* Pick cells to be dead or alive
* See how cells survive throughout the generations
* Create a population of cells with the press of a button
* Destroy all cells with the press of a button

# :construction_worker: Installation and Getting Started

```bash
# Clone this repository
$ git clone https://github.com/mikemorcerf/conway-game-of-life-stimulusjs

# Go into the repository
$ cd conway-game-of-life-stimulusjs

# Install dependencies
$ yarn install

# Start the server
$ yarn dev:server

# Open http://localhost:9000/
```

# :feet: How to Use

[Working Online Demo](https://stimulus-game-of-life.herokuapp.com/)
<br><br>
Play Conway's Game of Life on your browser using StimulusJS.
<ul>
  <li>Click or tap any dead cell on the board to turn it alive</li>
  <li>Click or tap any live cell on the board to kill it</li>
  <li>Press the 🦖🦕 button to generate a random population of size 100</li>
  <li>Press the ☄️🔥 button to destroy all live cells</li>
  <li>Press the ▶︎ button to start the passing of generations</li>
  <li>You cannot interact with the game while the generations are passing</li>
  <li>Press the ◼︎ button to stop the passing of generations</li>
  <li>You may change the speed in which generations pass by changing the value in the "seconds per cycle" entry</li>
</ul>

# :bug: Issues

Feel free to **file a new issue** with a respective title and description on the [Conway's Game of Life](https://github.com/mikemorcerf/conway-game-of-life-stimulusjs/issues) repository. If you already found a solution to your problem, **I would love to review your pull request**!

# :closed_book: License

Released in 2020.
This project is under the MIT license.


Made with ♥ by [Michael de Morcerf e Moura](https://github.com/mikemorcerf) [:bowtie: Say hi!](https://www.linkedin.com/in/michaelmoura/)