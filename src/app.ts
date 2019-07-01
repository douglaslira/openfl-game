import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Point from "openfl/geom/Point";
import Stage from "openfl/display/Stage";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import TextFormat from "openfl/text/TextFormat";
import TextField from "openfl/text/TextField";
import FPS_Mem from "openfl/display/FPS";


class App extends Sprite {
	
	
	constructor () {
		
		super ();

		let tileSize = 40;
		let world = new Sprite();
		let player = new Sprite();
		let isOnGround = false;
		let velocity = new Point(0, 0);
		let instructions:TextField = new TextField();
		let by:TextField = new TextField();
		let keys = [];
		let acceleration = 0.9;
		let map = [
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
			[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		];

		// EXTRA ////////////////////////////////////////////
		let isBlock = (coords:Point) => {
			return map[Math.round(coords.y)][Math.round(coords.x)] == 1;
		}
		let checkBottomCollision = (tileCoords:Point, approximateCoords:Point) => {
			if (velocity.y >= 0) {
				approximateCoords.x = player.x / tileSize;
				approximateCoords.y = player.y / tileSize;
				tileCoords.y = Math.ceil(approximateCoords.y);
				
				tileCoords.x = Math.floor(approximateCoords.x);
				if (isBlock(tileCoords)) {
					player.y = (tileCoords.y - 1) * tileSize;
					velocity.y = 0;
					isOnGround = true;
				}
				
				tileCoords.x = Math.ceil(approximateCoords.x);
				if (isBlock(tileCoords)) {
					player.y = (tileCoords.y - 1) * tileSize;
					velocity.y = 0;
					isOnGround = true;
				}
			}
		}
		let checkTopCollision = (tileCoords:Point, approximateCoords:Point) => {
			if (velocity.y < 0) {
				approximateCoords.x = player.x / tileSize;
				approximateCoords.y = player.y / tileSize;
				
				tileCoords.y = Math.floor(approximateCoords.y);
				
				tileCoords.x = Math.floor(approximateCoords.x);
				if (isBlock(tileCoords)) {
					player.y = (tileCoords.y + 1) * tileSize;
					velocity.y = 0;
				}
				
				tileCoords.x = Math.ceil(approximateCoords.x);
				if (isBlock(tileCoords)) {
					player.y = (tileCoords.y + 1) * tileSize;
					velocity.y = 0;
				}
			}
		}
		let checkRightCollision = (tileCoords:Point, approximateCoords:Point) => {
			if(velocity.x > 0){
				approximateCoords.x = player.x / tileSize;
				approximateCoords.y = player.y / tileSize;
				
				tileCoords.x = Math.ceil(approximateCoords.x);
				
				tileCoords.y = Math.floor(approximateCoords.y);
				if (isBlock(tileCoords)) {
					player.x = (tileCoords.x - 1) * tileSize;
					velocity.x = 0;
				}
				
				tileCoords.y = Math.ceil(approximateCoords.y);
				if (isBlock(tileCoords)) {
					player.x = (tileCoords.x - 1) * tileSize;
					velocity.x = 0;
				}
			}
		}
		let checkLeftCollision = (tileCoords:Point, approximateCoords:Point) => {
			if(velocity.x <= 0){
				approximateCoords.x = player.x / tileSize;
				approximateCoords.y = player.y / tileSize;
				
				tileCoords.x = Math.floor(approximateCoords.x);
				
				tileCoords.y = Math.floor(approximateCoords.y);
				if (isBlock(tileCoords)) {
					player.x = (tileCoords.x + 1) * tileSize;
					velocity.x = 0;
				}
				
				tileCoords.y = Math.ceil(approximateCoords.y);
				if (isBlock(tileCoords)) {
					player.x = (tileCoords.x + 1) * tileSize;
					velocity.x = 0;
				}
			}
		}
		/////////////////////////////////////////////////////

		// Make world
		world.graphics.beginFill(0x3498db);
		for (let row = 0; row < map.length; row++) {
			for (let cell = 0; cell < map[row].length; cell++) {
				if(map[row][cell]==1){
					world.graphics.drawRect(cell * tileSize, row * tileSize, tileSize, tileSize);
				}
			}
		}
		
		// Make player
		player.graphics.beginFill(0xffb600);
		player.graphics.drawRect(0, 0, tileSize, tileSize);
		player.x = 300 - tileSize / 2;
		player.y = 200 - tileSize / 2;

		// Instructions
		instructions.selectable = false;
		instructions.text = "SPACE to jump, ARROW KEYS to move";
		instructions.textColor = 0xffffff;
		instructions.defaultTextFormat = new TextFormat("_sans", 14);
		instructions.x = 15;
		instructions.y = 370;
		instructions.width = 300;

		// By
		by.selectable = false;
		by.textColor = 0xffffff;
		by.htmlText = "<a href=\"https://github.com/douglaslira/dangerous-dave-game\">By Douglas Lira</a>";
		by.defaultTextFormat = new TextFormat("_sans", 14);
		by.x = 500;
		by.y = 370;
		by.width = 300;
		
		// Add elements
		this.addChild(world);
		this.addChild(player);
		this.addChild(instructions);
		this.addChild(by);
		this.addChild(new FPS_Mem(15, 15, 0xffffff));

		// Event's
		this.stage.addEventListener(KeyboardEvent.KEY_DOWN, (evt:KeyboardEvent) => {
			keys[evt.keyCode] = true;
		});
		this.stage.addEventListener(KeyboardEvent.KEY_UP, (evt:KeyboardEvent) => {
			keys[evt.keyCode] = false;
		});
		this.addEventListener(Event.ENTER_FRAME, (evt:Event) => {
			velocity.y += acceleration;
			if (isOnGround && keys[32]) {
				isOnGround = false;
				velocity.y = -16;
			}
			if (keys[39]) {
				velocity.x = 7;
			} else if (keys[37]) {
				velocity.x = -7;
			} else {
				velocity.x = 0;
			}
			
			var tileCoords:Point = new Point(0, 0);
			var approximateCoords:Point = new Point();
			
			player.y += velocity.y;
			checkBottomCollision(tileCoords, approximateCoords);
			checkTopCollision(tileCoords, approximateCoords);
			
			player.x += velocity.x;
			checkRightCollision(tileCoords, approximateCoords);
			checkLeftCollision(tileCoords, approximateCoords);
			
			// Final vertical velocity check
			if (velocity.y != 0) {
				isOnGround = false;
			}
		});

	}
	
	
}


var stage = new Stage (600, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);