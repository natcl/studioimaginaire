autowatch = 1;

const BOX_NUMBER = 4;
const BOX_SIZE = 0.5;

var first_x = 0.
var first_y = 0.
var first_pos_x = 0.
var first_post_y = 0.

var current_box = 0.

var boxes = new Array();
init_boxes();

function init_boxes()
{
	for (var i = 0; i < BOX_NUMBER; i++)
		boxes.push(new Box(-2+(BOX_SIZE*i)*1.5,0, BOX_SIZE, String(i + 1)));
}

function Box(x, y, size, label)
{
	this.x = x
	this.y = y
	this.size = size
	this.label = label
}

Box.prototype.draw = function()
{
	sketch.glcolor(0,0,0);
	var x1 = this.x;
    var x2 = this.x;
    var x3 = this.x + this.size;
    var x4 = this.x + this.size;
    var y1 = this.y;
    var y2 = this.y - this.size;
    var y3 = this.y - this.size;
    var y4 = this.y;
    var z1 = 0.;
    var z2 = 0.;
    var z3 = 0.;
    var z4 = 0.;
    sketch.framequad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4);
    sketch.moveto(this.x + this.size / 2, this.y - this.size / 2);
    sketch.text(this.label);
}

function bang() 
{
	sketch.glclear();
	//draw_box(0.35,0.8, BOX_SIZE, '1');
	//draw_box(0,0,BOX_SIZE, '2');
	
	for (var b in boxes)
	{
		boxes[b].draw();
	}
    refresh();
}

function test()
{
	boxes[0].x = 0;
	draw_boxes();

}

function draw_boxes()
{
	sketch.glclear();
	for (var i = 0 ; i < boxes.length ; i++)
		boxes[i].draw();
	refresh();

}

function onclick (x, y)
{
    first_x = x;
    first_y = y;
    current_box = box_collide(sketch.screentoworld(x,y)[0],sketch.screentoworld(x,y)[1]);
    if (current_box)
    {
    	first_pos_x = sketch.worldtoscreen(boxes[current_box -1].x, boxes[current_box -1].y)[0];
    	first_pos_y = sketch.worldtoscreen(boxes[current_box -1].x, boxes[current_box -1].y)[1];
    }
}

function ondblclick (x, y, button, mod1, shift, caps, opt, mod2)
{
	post(box_collide(sketch.screentoworld(x,y)[0],sketch.screentoworld(x,y)[1]));
	post();
	outlet(0,box_collide(sketch.screentoworld(x,y)[0],sketch.screentoworld(x,y)[1]));
	

}

function ondrag (x, y, button, mod1, shift, caps, opt, mod2)
{
   	if (current_box)
   	{
   		var xx = first_pos_x + (x - first_x);
   		var yy = first_pos_y + (y - first_y);
   		boxes[current_box - 1].x = sketch.screentoworld(xx,yy)[0];
   		boxes[current_box - 1].y = sketch.screentoworld(xx,yy)[1];
   	}
    draw_boxes();
}

function box_collide(x, y)
{
	for (var b in boxes)
	{
		if ((x >= boxes[b].x && x <= boxes[b].x + boxes[b].size) && (y <= boxes[b].y && y >= boxes[b].y - boxes[b].size))
		{
			return parseInt(b)+1;
		}
	}
	return 0;
}

function clear()
{
	sketch.glclear();
	refresh();
}
