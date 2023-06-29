/*
Author: Paul Kim
Date: June 28, 2023
Version: 1.0
COMP 2132 Final Project
*/

/*Variable declarations and definitions*/

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
let offset;
let redKnightPosition;
let mushroomPosition;
if (window.innerWidth < 740) {
    canvas.width = 300;
    canvas.height = 400;
    offset = { x: -525, y: -710 };
    redKnightPosition = { x: 25, y: 175 }
    mushroomPosition = { x: 195, y: 200 }
}
else if (window.innerWidth < 1000) {
    canvas.width = 700;
    canvas.height = 550;
    offset = { x: -330, y: -630 }
    redKnightPosition = { x: 75, y: 205 }
    mushroomPosition = { x: 525, y: 225 }
}
else {
    canvas.width = 1000;
    canvas.height = 700;
    offset = { x: -180, y: -570 }
    redKnightPosition = { x: 75, y: 305 }
    mushroomPosition = { x: 825, y: 325 }
}
const $upButton = $('#up-button');
const $leftButton = $('#left-button');
const $downButton = $('#down-button');
const $rightButton = $('#right-button');
const enemyName = document.getElementById('enemy-name');
const playerName = document.getElementById('player-name');
const battleMsg = document.getElementById('battle-msg');
const battleMenu = document.getElementById('battle-menu');
const attackType = document.getElementById('attack-type');
const userInterface = document.getElementById('user-interface');
const enemyHpBar = document.getElementById('enemy-hp-bar-actual');
const playerHpBar = document.getElementById('player-hp-bar-actual');
enemyName.innerHTML += 'Mushroom';
playerName.innerHTML += 'Player';
const backgroundImage = new Image();
backgroundImage.src = '../assets/tiled/background.png';
const playerUpImage = new Image();
playerUpImage.src = '../assets/player/up/up_all.png';
const playerLeftImage = new Image();
playerLeftImage.src = '../assets/player/left/left_all.png';
const playerRightImage = new Image();
playerRightImage.src = '../assets/player/right/right_all.png';
const playerDownImage = new Image();
playerDownImage.src = '../assets/player/down/down_all.png';
const foregroundImage = new Image();
foregroundImage.src = '../assets/tiled/foreground.png';
const battleBackgroundImg = new Image();
battleBackgroundImg.src = '../assets/battle_background.jpg';
const keys = { up: { pressed: false }, left: { pressed: false }, down: { pressed: false }, right: { pressed: false } };
const playerStats = { exp: 0, level: 1, hp: 100, atk: 25 };
const attacks = { Slash: { name: 'Slash', damage: playerStats.atk, type: 'Normal', color: 'white' }, Slam: { name: 'Slam', damage: 10, type: 'Normal', color: 'white' }, Heal: { name: 'Heal', damage: 25, type: 'Cure', color: 'rgb(0, 255, 221)' } };
const battle = { initiated: false };
const entities = { RedKnight: { position: redKnightPosition, image: { src: '../assets/player/right/right_0.png' }, frames: { max: 1, hold: 30 }, animate: false, name: 'Red Knight', attacks: [attacks.Slash, attacks.Heal], health: playerStats.hp }, Mushroom: { position: mushroomPosition, image: { src: '../assets/monster/mushroom2.png' }, frames: { max: 3, hold: 30 }, animate: true, isEnemy: true, name: 'Mushroom', attacks: [attacks.Slam] } };
const boundaries = [];
const collisionsMap = [];
const battleZoneAreas = [];
const battleZonesMap = [];
const collisions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 0, 0, 1025, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 1025, 0, 0, 1025, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const battleZones = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 0, 0, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 1025, 1025, 1025, 1025, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const numberOfTilesPerRow = 50;
for (let i = 0; i < collisions.length; i += numberOfTilesPerRow) {
    collisionsMap.push(collisions.slice(i, numberOfTilesPerRow + i));
}
for (let i = 0; i < battleZones.length; i += numberOfTilesPerRow) {
    battleZonesMap.push(battleZones.slice(i, numberOfTilesPerRow + i));
}

/*class declarations and definitions*/

class Boundary {
    static width = 48;
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    } // end constructor
    draw() {
        canvasContext.fillStyle = 'rgba(255,0,0,0.3)';
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    } // end function draw
} // end class Boundary

class Sprite {
    constructor({ position, image, scale = 1, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0 }) {
        this.position = position;
        this.scale = scale;
        this.image = new Image();
        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            this.width = (this.image.width / this.frames.max) * this.scale;
            this.height = this.image.height * this.scale;
        }
        this.image.src = image.src;
        this.moving = false;
        this.sprites = sprites;
        this.animate = animate;
        this.opacity = 1;
        this.rotation = rotation;
    } // end constructor 
    draw() {
        canvasContext.save();
        canvasContext.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        canvasContext.rotate(this.rotation);
        canvasContext.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        canvasContext.globalAlpha = this.opacity;
        canvasContext.drawImage(
            this.image,
            this.frames.val * this.width, //crop
            0, //crop
            this.image.width / this.frames.max, //crop
            this.image.height, //crop
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, //actual
            this.image.height //actual
        ); // end drawImage
        canvasContext.restore()
        if (!this.animate) {
            return;
        }
        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % this.frames.hold == 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            }
            else {
                this.frames.val = 0;
            }
        }
    } // end function draw
} // end class Sprite

class Entity extends Sprite {
    constructor({ position, image, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0, isEnemy = false, name, attacks, health = 100 }) {
        super({ position, image, frames, sprites, animate, rotation });
        this.isEnemy = isEnemy;
        this.name = name;
        this.health = health;
        this.attacks = attacks;
    } // end constructor
    attack({ attackType, recipient, caster }) {
        battleMsg.style.display = 'block';
        battleMsg.innerHTML = `<p>${this.name} used <strong>${attackType.name}</strong></p>`;
        let hpBarActual = '#enemy-hp-bar-actual';
        if (this.isEnemy) {
            hpBarActual = '#player-hp-bar-actual';
        }
        let rotation = 1;
        if (this.isEnemy) {
            rotation = -2;
        }
        switch (attackType.name) {
            case 'Slam':
                const tl = gsap.timeline();
                let movementDistance = 20;
                if (this.isEnemy) {
                    movementDistance = -20;
                }
                tl.to(this.position, { x: this.position.x - movementDistance }).to(this.position, { x: this.position.x + movementDistance * 2, duration: 0.1, onComplete: () => { gsap.to(hpBarActual, { width: `${recipient.health}%` }), gsap.to(recipient.position, { x: recipient.position.x + 10, yoyo: true, repeat: 5, duration: 0.1 }), gsap.to(recipient, { opacity: 0, yoyo: true, repeat: 5, duration: 0.1 }) } }).to(this.position, { x: this.position.x });
                recipient.health -= attackType.damage;
                break;
            case 'Slash':
                const slashImg = new Image();
                slashImg.src = '../assets/player/right_attack/attack_right.png';
                const slash = new Sprite({ position: { x: this.position.x, y: this.position.y }, image: slashImg, frames: { max: 1, hold: 10 }, animate: true });
                renderedSprites.splice(1, 0, slash);
                gsap.to(slash.position, { x: recipient.position.x, y: recipient.position.y, onComplete: () => { gsap.to(hpBarActual, { width: `${recipient.health}%` }), gsap.to(recipient.position, { x: recipient.position.x + 10, yoyo: true, repeat: 5, duration: 0.08 }), gsap.to(recipient, { opacity: 0, repeat: 5, yoyo: true, duration: 0.1 }), renderedSprites.splice(1, 1) } });
                recipient.health -= attackType.damage;
                break;
            case 'Heal':
                if(battlePlayer.health > 75 && battlePlayer.health < 100){
                    battlePlayer.health = 100;
                    hpBarActual = '#player-hp-bar-actual';
                    gsap.to(hpBarActual, { width: `${caster.health}%` })
                }
                else if (battlePlayer.health <= 75) {
                    caster.health += attackType.damage;
                    hpBarActual = '#player-hp-bar-actual';
                    gsap.to(hpBarActual, { width: `${caster.health}%` })
                }
                break;
        } // end switch
    } // end function attack
    faint() {
        battleMsg.innerHTML = `<p>${this.name} Fainted</p>`;
        // gsap.to(this.position, { y: this.position.y + 20 });
        gsap.to(this, { opacity: 0 })
    } // end function faint
} // end class Entity

/*class object instantiations*/

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025) {
            boundaries.push(new Boundary({ position: { x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y } }));
        }
    }) // end forEach
}) // end forEach

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol == 1025) {
            battleZoneAreas.push(new Boundary({ position: { x: j * Boundary.width + offset.x, y: i * Boundary.height + offset.y } }));
        }
    }) // end forEach
}) // end forEach

const background = new Sprite({ position: { x: offset.x, y: offset.y }, image: backgroundImage });
const player = new Sprite({ position: { x: canvas.width / 2 - 40, y: canvas.height / 2 - 40 }, image: playerDownImage, frames: { max: 4, hold: 20 }, sprites: { up: playerUpImage, left: playerLeftImage, right: playerRightImage, down: playerDownImage } });
const foreground = new Sprite({ position: { x: offset.x, y: offset.y }, image: foregroundImage });
const moveables = [background, ...boundaries, foreground, ...battleZoneAreas];
const battleBackground = new Sprite({ position: { x: 0, y: 0 }, scale: 4, image: battleBackgroundImg });

/*function declarations and definitions*/

function isColliding({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y);
} // end function isColliding

function animate() {
    const movementVelocity = 3;
    const animationId = window.requestAnimationFrame(animate);
    background.draw();
    // boundaries.forEach(boundary => {
    //     boundary.draw();
    // })
    // battleZoneAreas.forEach(battleZone => {
    //     battleZone.draw();
    // })
    player.draw();
    foreground.draw();
    let moving = true;
    player.animate = false;
    if (keys.up.pressed || keys.left.pressed || keys.down.pressed || keys.right.pressed) {
        for (let i = 0; i < battleZoneAreas.length; ++i) {
            const battleZone = battleZoneAreas[i];
            if (isColliding({ rectangle1: player, rectangle2: battleZone }) && Math.random() < 0.005) {
                battle.initiated = true;
                gsap.to('#container2', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4
                });
                window.cancelAnimationFrame(animationId);
                initBattle();
                animateBattle();
                break;
            }
        } // end for
    }
    if (battle.initiated) {
        return;
    }
    if (keys.up.pressed == true) {
        player.animate = true;
        player.image = player.sprites.up;

        for (let i = 0; i < boundaries.length; ++i) {
            const boundary = boundaries[i];
            if (isColliding({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + movementVelocity
                    }
                }
            })) {
                moving = false;
                break;
            }
        }

        if (moving)
            moveables.forEach(moveable => {
                moveable.position.y += movementVelocity;
            })

        if (keys.left.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x + 3, y: boundary.position.y } } })) {
                    moving = false;
                    break;
                }
            }
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.x += movementVelocity;
                })
        }
        else if (keys.right.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x - 3, y: boundary.position.y } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.x -= movementVelocity;
                })
        }
    }
    else if (keys.down.pressed == true) {
        player.animate = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; ++i) {
            const boundary = boundaries[i];
            if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y - movementVelocity } } })) {
                moving = false;
                break;
            }
        } // end for
        if (moving)
            moveables.forEach(moveable => {
                moveable.position.y -= movementVelocity;
            })
        if (keys.left.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x + movementVelocity, y: boundary.position.y } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.x += movementVelocity;
                })
        }
        else if (keys.right.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x - movementVelocity, y: boundary.position.y } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.x -= movementVelocity;
                })
        }
    }
    else if (keys.left.pressed == true) {
        player.animate = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; ++i) {
            const boundary = boundaries[i];
            if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x + movementVelocity, y: boundary.position.y } } })) {
                moving = false;
                break;
            }
        } // end for
        if (moving)
            moveables.forEach(moveable => {
                moveable.position.x += movementVelocity;
            })
        if (keys.up.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y + movementVelocity } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.y += movementVelocity;
                })
        }
        else if (keys.down.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y - movementVelocity } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.y -= movementVelocity;
                })
        }
    }
    else if (keys.right.pressed == true) {
        player.animate = true;
        player.image = player.sprites.right;
        for (let i = 0; i < boundaries.length; ++i) {
            const boundary = boundaries[i];
            if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x - 3, y: boundary.position.y } } })) {
                moving = false;
                break;
            }
        } // end for
        if (moving)
            moveables.forEach(moveable => {
                moveable.position.x -= 3;
            })
        if (keys.up.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y + movementVelocity } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.y += movementVelocity;
                })
        }
        else if (keys.down.pressed == true) {
            for (let i = 0; i < boundaries.length; ++i) {
                const boundary = boundaries[i];
                if (isColliding({ rectangle1: player, rectangle2: { ...boundary, position: { x: boundary.position.x, y: boundary.position.y - movementVelocity } } })) {
                    moving = false;
                    break;
                }
            } // end for
            if (moving)
                moveables.forEach(moveable => {
                    moveable.position.y -= movementVelocity;
                })
        }
    }
} // end function animate

let battlePlayer;
let battleMushroom;

function initBattle() {
    battlePlayer = new Entity(entities.RedKnight);
    battleMushroom = new Entity(entities.Mushroom);
    renderedSprites = [battleMushroom, battlePlayer];
    queue = [];
    userInterface.style.display = 'block';
    battleMsg.style.display = 'none';
    enemyHpBar.style.width = '100%';
    playerHpBar.style.width = `${battlePlayer.health}%`;
    battleMenu.replaceChildren();
    const randomAttack = battleMushroom.attacks[Math.floor(Math.random() * battleMushroom.attacks.length)];
    battlePlayer.attacks.forEach(attack => {
        const button = document.createElement('button');
        button.innerHTML = attack.name;
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
        button.style.borderLeft = 'solid 2px white';
        button.style.borderRight = 'solid 2px white';
        button.style.borderBottom = 'solid 2px white';
        button.style.fontWeight = 'bold';
        button.style.cursor = 'pointer';
        battleMenu.append(button);
    }) // end forEach
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            console.log(`hp: ${battlePlayer.health}`);
            console.log(`damage:${attacks.Slash.damage}`);
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            const mushroomXp = 10;
            battlePlayer.attack({ attackType: selectedAttack, recipient: battleMushroom, renderedSprites, caster: battlePlayer });
            if (battleMushroom.health <= 0) {
                playerStats.exp += mushroomXp;
                queue.push(() => {
                    battleMushroom.faint();
                })
                queue.push(() => {
                    battleMsg.innerHTML = `<p>Red Knight gains ${mushroomXp} xp</p>`;
                    console.log(`xp:${playerStats.exp}`);
                    entities.RedKnight.health = battlePlayer.health;
                })
                if (playerStats.exp > 99) {
                    playerStats.level = 4;
                    playerStats.atk = 100;
                    attacks.Slash.damage = playerStats.atk;
                }
                else if (playerStats.exp > 49) {
                    playerStats.level = 3;
                    playerStats.atk = 75;
                    attacks.Slash.damage = playerStats.atk;
                }
                else if (playerStats.exp > 19) {
                    playerStats.level = 2;
                    playerStats.atk = 50;
                    attacks.Slash.damage = playerStats.atk;
                }
                if (playerStats.exp == 20) {
                    queue.push(() => {
                        battleMsg.innerHTML = `<p>Red Knight leveled up! Level: ${playerStats.level}</p>`;
                        console.log(`lvl: ${playerStats.level}`);
                        console.log(`atk:${playerStats.atk}`);
                    })
                }
                if (playerStats.exp == 50) {
                    queue.push(() => {
                        battleMsg.innerHTML = `<p>Red Knight leveled up! Level: ${playerStats.level}</p>`;
                        console.log(`lvl: ${playerStats.level}`);
                        console.log(`atk:${playerStats.atk}`);
                    })
                }
                if (playerStats.exp == 100) {
                    queue.push(() => {
                        battleMsg.innerHTML = `<p>Red Knight leveled up! Level: ${playerStats.level}</p>`;
                        console.log(`lvl: ${playerStats.level}`);
                        console.log(`atk:${playerStats.atk}`);
                    })
                }
                queue.push(() => {
                    gsap.to('#container2', {
                        opacity: 1,
                        onComplete: () => {
                            window.cancelAnimationFrame(battleAnimationId);
                            animate();
                            userInterface.style.display = 'none';
                            gsap.to('#container2', {
                                opacity: 0
                            })
                            battle.initiated = false;
                        }
                    })
                })
            }
            queue.push(() => {
                battleMushroom.attack({ attackType: randomAttack, recipient: battlePlayer, renderedSprites });
                if (battlePlayer.health <= 0) {
                    background.position.x = offset.x;
                    background.position.y = offset.y;
                    foreground.position.x = offset.x;
                    foreground.position.y = offset.y;
                    entities.RedKnight.health = 100;
                    playerStats.exp = 0;
                    entities.RedKnight.atk = 25;
                    attacks.Slash.damage = 25;
                    queue.push(() => {
                        battlePlayer.faint();
                        queue.push(() => {
                            gsap.to('#container2', {
                                opacity: 1,
                                onComplete: () => {
                                    window.cancelAnimationFrame(battleAnimationId);
                                    animate();
                                    userInterface.style.display = 'none';
                                    gsap.to('#container2', {
                                        opacity: 0
                                    })
                                    battle.initiated = false;
                                }
                            })
                        })
                    })
                    queue.push(() => {
                        battleMsg.innerHTML = "<p><strong>Game Over</strong></p>";
                    })
                    return;
                }
            })
        }) // end eventListener
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            attackType.innerHTML = `<strong>${selectedAttack.type}</strong>`;
            attackType.style.color = selectedAttack.color;
            attackType.style.fontSize = '18px'
        }) // end event listener
    }) // end forEach
} // end function initBattle

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    battlePlayer.draw();
    battleMushroom.draw();
    renderedSprites.forEach((sprite) => {
        sprite.draw();
    }) // end forEach
} // end function animateBattle

/*event listeners*/

battleMsg.addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    }
    else {
        e.currentTarget.style.display = 'none';
    }
}) // end eventListener

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            keys.up.pressed = true;
            break;
        case 'a':
            keys.left.pressed = true;
            break;
        case 's':
            keys.down.pressed = true;
            break;
        case 'd':
            keys.right.pressed = true;
            break;
    }
}) // end event listener

addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            keys.up.pressed = false;
            break;
        case 'a':
            keys.left.pressed = false;
            break;
        case 's':
            keys.down.pressed = false;
            break;
        case 'd':
            keys.right.pressed = false;
            break;

    }
}) // end event listener

$upButton.mousedown(function () {
    keys.up.pressed = true;
});

$upButton.mouseup(function () {
    keys.up.pressed = false;
});

$leftButton.mousedown(function () {
    keys.left.pressed = true;
});

$leftButton.mouseup(function () {
    keys.left.pressed = false;
});

$downButton.mousedown(function () {
    keys.down.pressed = true;
});

$downButton.mouseup(function () {
    keys.down.pressed = false;
});

$rightButton.mousedown(function () {
    keys.right.pressed = true;
});

$rightButton.mouseup(function () {
    keys.right.pressed = false;
});

$downButton.bind('touchstart mousedown', function () {
    keys.down.pressed = true;
});

$downButton.mouseup(function () {
    keys.down.pressed = false;
});

$rightButton.bind('touchstart mousedown', function () {
    keys.right.pressed = true;
});

$rightButton.mouseup(function () {
    keys.right.pressed = false;
});

animate(); // init game

/*header nav toggle function*/

(function (d) {

    const $nav = d.querySelector('nav');
    const $btn = d.querySelector('.hamburger-menu');
    $btn.addEventListener('click', function () {
        $nav.classList.toggle('show');
    });

})(document);